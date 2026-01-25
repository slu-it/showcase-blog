package application.persistence

import application.business.BlogPost
import application.business.BlogPostData
import application.business.CurrentUser
import application.business.MutableBlogPost
import org.springframework.jdbc.core.simple.JdbcClient
import org.springframework.stereotype.Repository
import org.springframework.util.IdGenerator
import java.time.Clock
import java.time.Instant
import java.time.ZoneOffset
import java.util.UUID
import kotlin.jvm.optionals.getOrNull

@Repository
class BlogPostCrudRepository(
    private val client: JdbcClient,
    private val idGenerator: IdGenerator,
    private val clock: Clock
) {

    private val creationStatement =
        """
        INSERT INTO blog_posts (uid, title, summary, content, publication_time, created_at, created_by, last_updated_at, last_updated_by)
        VALUES (:uid, :title, :summary, :content, :publicationTime, :currentTime, :currentUser, :currentTime, :currentUser)
        """.trimIndent()

    private val updateStatement =
        """
        UPDATE blog_posts
        SET title = :title,
            summary = :summary,
            content = :content,
            publication_time = :publicationTime,
            last_updated_at = :currentTime,
            last_updated_by = :currentUser
        WHERE uid = :uid
        """.trimIndent()

    private val deleteStatement = "DELETE FROM blog_posts WHERE uid = :uid"

    private val findByIdQuery = "SELECT * FROM blog_posts WHERE uid = :uid"

    fun create(user: CurrentUser, data: BlogPostData): BlogPost {
        val uid = idGenerator.generateId()

        client.sql(creationStatement)
            .param("uid", uid)
            .param("title", data.title)
            .param("summary", data.summary)
            .param("content", data.content)
            .param("publicationTime", withOffset(data.publicationTime))
            .param("currentTime", withOffset(clock.instant()))
            .param("currentUser", user.uid)
            .update()

        return findByIdOrThrow(uid)
    }

    fun findByIdOrThrow(uid: UUID): BlogPost {
        return findById(uid) ?: error("BlogPost with id $uid not found!")
    }

    fun findById(uid: UUID): BlogPost? =
        client.sql(findByIdQuery)
            .param("uid", uid)
            .query(BlogPostMapper)
            .optional()
            .getOrNull()

    fun updateByIdOrThrow(user: CurrentUser, uid: UUID, update: (MutableBlogPost) -> Unit): BlogPost =
        updateById(user, uid, update) ?: error("BlogPost with id $uid not found!")

    fun updateById(user: CurrentUser, uid: UUID, update: (MutableBlogPost) -> Unit): BlogPost? {
        val current = findById(uid) ?: return null
        val mutable = MutableBlogPost.from(current)
        update(mutable)
        val updated = BlogPost.from(mutable)

        client.sql(updateStatement)
            .param("uid", uid)
            .param("title", updated.data.title)
            .param("summary", updated.data.summary)
            .param("content", updated.data.content)
            .param("publicationTime", withOffset(updated.data.publicationTime))
            .param("currentTime", withOffset(clock.instant()))
            .param("currentUser", user.uid)
            .update()

        return findByIdOrThrow(uid)
    }

    fun deleteById(uid: UUID): Boolean {
        val deletedCount = client.sql(deleteStatement)
            .param("uid", uid)
            .update()

        return deletedCount > 0
    }

    private fun withOffset(instant: Instant) = instant.atOffset(ZoneOffset.UTC)
}
