package application.persistence

import application.TestData.blogPostData1
import application.TestData.blogPostData2
import application.TestData.defaultUser
import application.TestData.differentUser
import application.business.BlogPost
import application.business.BlogPostMetadata
import com.ninjasquad.springmockk.MockkBean
import io.kotest.matchers.comparables.shouldBeGreaterThan
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import io.mockk.every
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.jdbc.test.autoconfigure.JdbcTest
import org.springframework.boot.testcontainers.service.connection.ServiceConnection
import org.springframework.context.annotation.Import
import org.springframework.util.IdGenerator
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.postgresql.PostgreSQLContainer
import java.time.Clock
import java.time.Instant
import java.util.UUID.randomUUID

@JdbcTest
@Import(BlogPostCrudRepository::class)
@MockkBean(types = [IdGenerator::class, Clock::class])
class BlogPostCrudRepositoryTests(
    @Autowired private val cut: BlogPostCrudRepository,
    @Autowired private val idGenerator: IdGenerator,
    @Autowired private val clock: Clock,
) {

    companion object {
        @Container
        @ServiceConnection
        val postgres = PostgreSQLContainer("postgres:17-alpine")
    }

    @BeforeEach
    fun stubDefaultBehaviour() {
        every { idGenerator.generateId() } answers { randomUUID() }
        every { clock.instant() } answers { Instant.now() }
    }

    @Test
    fun `creating a post returns the final business object`() {
        val uid = randomUUID()
        val now = Instant.parse("2026-01-05T12:34:56.789Z")
        every { idGenerator.generateId() } returns uid
        every { clock.instant() } returns now

        val result = cut.create(defaultUser, blogPostData1)

        result shouldBe BlogPost(
            uid = uid,
            data = blogPostData1,
            metadata = BlogPostMetadata(
                createdAt = now,
                createdBy = "defaultUser",
                lastUpdatedAt = now,
                lastUpdatedBy = "defaultUser",
            )
        )
    }

    @Test
    fun `existing posts can be found by id`() {
        val created = cut.create(defaultUser, blogPostData2)
        val found = cut.findById(created.uid)

        found shouldBe created
    }

    @Test
    fun `non-existing posts return null when trying to find them by id`() {
        cut.findById(randomUUID()) shouldBe null
    }

    @Test
    fun `updating a post returns the updated business object`() {
        val original = cut.create(defaultUser, blogPostData1)
        val updated = cut.updateByIdOrThrow(differentUser, original.uid) { post ->
            post.data.title = blogPostData2.title
            post.data.summary = blogPostData2.summary
            post.data.content = blogPostData2.content
            post.data.publicationTime = blogPostData2.publicationTime
        }

        updated shouldNotBe original

        updated.uid shouldBe original.uid
        updated.data shouldBe blogPostData2
        updated.metadata.createdAt shouldBe original.metadata.createdAt
        updated.metadata.createdBy shouldBe original.metadata.createdBy
        updated.metadata.lastUpdatedAt shouldBeGreaterThan original.metadata.lastUpdatedAt
        updated.metadata.lastUpdatedBy shouldNotBe original.metadata.lastUpdatedBy
        updated.metadata.lastUpdatedBy shouldBe "differentUser"
    }

    @Test
    fun `deleting a post returns true if there was a post to delete`() {
        val post = cut.create(defaultUser, blogPostData1)
        cut.deleteById(post.uid) shouldBe true
    }

    @Test
    fun `deleting a post deletes only that specific post`() {
        val post1 = cut.create(defaultUser, blogPostData1)
        val post2 = cut.create(defaultUser, blogPostData2)

        cut.deleteById(post1.uid)

        cut.findById(post1.uid) shouldBe null
        cut.findById(post2.uid) shouldNotBe null
    }

    @Test
    fun `deleting a post returns false if there was no post to delete`() {
        cut.deleteById(randomUUID()) shouldBe false
    }
}
