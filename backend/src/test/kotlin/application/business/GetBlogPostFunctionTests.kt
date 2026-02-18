package application.business

import application.TestData.blogPostData1
import application.TestData.blogPostMetadata1
import application.TestData.defaultUser
import application.business.model.BlogPost
import application.persistence.BlogPostCrudRepository
import io.kotest.matchers.shouldBe
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import java.time.Clock
import java.time.Duration.ofSeconds
import java.time.Instant
import java.util.UUID.randomUUID

class GetBlogPostFunctionTests {

    private val repository: BlogPostCrudRepository = mockk()
    private val clock: Clock = mockk()
    private val cut = GetBlogPostFunction(repository, clock)

    private val now = Instant.parse("2026-01-29T12:34:56.789Z")
    private val uid = randomUUID()

    private val pastBlogPost = BlogPost(
        uid = uid,
        data = blogPostData1.copy(
            publicationTime = now.minus(ofSeconds(1)),
        ),
        metadata = blogPostMetadata1
    )
    private val futureBlogPost = BlogPost(
        uid = uid,
        data = blogPostData1.copy(
            publicationTime = now.plus(ofSeconds(1)),
        ),
        metadata = blogPostMetadata1
    )

    @BeforeEach
    fun stubDefaultBehaviour() {
        every { clock.instant() } returns now
    }

    @Nested
    inner class AsUser {

        private val user = defaultUser.copy(isAuthor = false)

        @Test
        fun `delegates to repository and returns null when not found`() {
            every { repository.findById(uid) } returns null
            val result = cut(user, uid)
            result shouldBe null
        }

        @Test
        fun `delegates to repository and returns blog post when found`() {
            every { repository.findById(uid) } returns pastBlogPost
            val result = cut(user, uid)
            result shouldBe pastBlogPost
        }

        @Test
        fun `delegates to repository and returns future blog post when found`() {
            every { repository.findById(uid) } returns futureBlogPost
            val result = cut(user, uid)
            result shouldBe null
        }
    }

    @Nested
    inner class AsAuthor {

        private val user = defaultUser.copy(isAuthor = true)

        @Test
        fun `delegates to repository and returns null when not found`() {
            every { repository.findById(uid) } returns null
            val result = cut(user, uid)
            result shouldBe null
        }

        @Test
        fun `delegates to repository and returns past blog post when found`() {
            every { repository.findById(uid) } returns pastBlogPost
            val result = cut(user, uid)
            result shouldBe pastBlogPost
        }

        @Test
        fun `delegates to repository and returns future blog post when found`() {
            every { repository.findById(uid) } returns futureBlogPost
            val result = cut(user, uid)
            result shouldBe futureBlogPost
        }
    }
}
