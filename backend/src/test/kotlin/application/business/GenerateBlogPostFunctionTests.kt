package application.business

import application.TestData.defaultUser
import application.business.model.BlogPostData
import io.kotest.matchers.collections.shouldHaveSize
import io.kotest.matchers.shouldBe
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.time.Clock
import java.time.Duration
import java.time.Instant

class GenerateBlogPostFunctionTests {

    private val createBlogPost: CreateBlogPostFunction = mockk()
    private val clock: Clock = mockk()
    private val cut = GenerateBlogPostFunction(createBlogPost, clock)

    private val now = Instant.parse("2026-01-29T12:00:00Z")

    @BeforeEach
    fun setup() {
        every { clock.instant() } returns now
        every { createBlogPost(any(), any()) } returns mockk()
    }

    @Test
    fun `invoke with amount 1 - calls createBlogPost exactly once`() {
        cut(defaultUser, 1)

        verify(exactly = 1) { createBlogPost(any(), any()) }
    }

    @Test
    fun `invoke with amount 5 - calls createBlogPost exactly 5 times`() {
        cut(defaultUser, 5)

        verify(exactly = 5) { createBlogPost(any(), any()) }
    }

    @Test
    fun `each generated post has a non-blank title, summary, and content`() {
        val capturedData = mutableListOf<BlogPostData>()
        every { createBlogPost(any(), capture(capturedData)) } returns mockk()

        cut(defaultUser, 5)

        capturedData shouldHaveSize 5
        capturedData.forEach { data ->
            data.title.isNotBlank() shouldBe true
            data.summary.isNotBlank() shouldBe true
            data.content.isNotBlank() shouldBe true
        }
    }

    @Test
    fun `the provided user is forwarded to createBlogPost for every generated post`() {
        cut(defaultUser, 3)

        verify(exactly = 3) { createBlogPost(defaultUser, any()) }
    }

    @Test
    fun `publication time of each generated post is within the 7-day window ending at the clock's current instant`() {
        val capturedData = mutableListOf<BlogPostData>()
        every { createBlogPost(any(), capture(capturedData)) } returns mockk()

        val earliest = now.minus(Duration.ofDays(7))

        cut(defaultUser, cut.blogPostPoolSize)

        capturedData.forEach { data ->
            data.publicationTime.isBefore(now) shouldBe true
            data.publicationTime.isBefore(earliest) shouldBe false
        }
    }

    @Test
    fun `no two generated posts should be the same`() {
        val capturedData = mutableListOf<BlogPostData>()
        every { createBlogPost(any(), capture(capturedData)) } returns mockk()

        cut(defaultUser, cut.blogPostPoolSize)

        capturedData.distinct() shouldHaveSize capturedData.size
    }
}
