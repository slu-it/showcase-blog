package application.persistence

import application.business.BlogPost
import application.business.PageQuery
import application.business.PagedResult
import application.business.PagedResult.Page
import org.springframework.jdbc.core.simple.JdbcClient
import org.springframework.stereotype.Repository
import java.time.Clock
import java.time.Instant
import java.time.ZoneOffset

@Repository
class BlogPostSearchRepository(
    private val client: JdbcClient,
    private val clock: Clock,
) {

    private val pagedSearchQuery =
        """
        SELECT * FROM blog_posts
        WHERE publication_time <= :now
        ORDER BY publication_time DESC
        LIMIT :pageSize OFFSET :offset
        """.trimIndent()

    private val countQuery =
        "SELECT COUNT(*) FROM blog_posts WHERE publication_time <= :now"

    fun getPage(query: PageQuery): PagedResult<BlogPost> {
        val now = clock.instant()
        val offset = (query.number - 1) * query.size

        val content = client.sql(pagedSearchQuery)
            .param("now", withOffset(now))
            .param("pageSize", query.size)
            .param("offset", offset)
            .query(BlogPostMapper)
            .list()

        val totalElements = client.sql(countQuery)
            .param("now", withOffset(now))
            .query(Long::class.java)
            .single()

        return PagedResult(
            content = content,
            page = Page(
                number = query.number,
                size = query.size,
                totalElements = totalElements,
                totalPages = (totalElements + query.size - 1) / query.size,
            )
        )
    }

    private fun withOffset(instant: Instant) = instant.atOffset(ZoneOffset.UTC)
}
