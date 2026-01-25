package application.persistence

import application.TestData.defaultUser
import application.business.BlogPost
import application.business.BlogPostData
import application.business.PageQuery
import application.business.PagedResult
import application.business.PagedResult.Page
import com.ninjasquad.springmockk.MockkBean
import io.kotest.matchers.shouldBe
import io.mockk.every
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.jdbc.test.autoconfigure.JdbcTest
import org.springframework.boot.testcontainers.service.connection.ServiceConnection
import org.springframework.context.annotation.Import
import org.springframework.util.JdkIdGenerator
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.postgresql.PostgreSQLContainer
import java.time.Clock
import java.time.Instant

@JdbcTest
@Import(BlogPostCrudRepository::class, BlogPostSearchRepository::class, JdkIdGenerator::class)
@MockkBean(types = [Clock::class])
class BlogPostSearchRepositoryTests(
    @Autowired private val crud: BlogPostCrudRepository,
    @Autowired private val cut: BlogPostSearchRepository,
    @Autowired private val clock: Clock,
) {

    companion object {
        @Container
        @ServiceConnection
        val postgres = PostgreSQLContainer("postgres:17-alpine")
    }

    @Test
    fun `getting a page sorts DESC by publication date and exlcudes future posts`() {
        every { clock.instant() } returns instant("2026-01-01T10:00:00.001Z") // start in the past

        create("#01", publicationTime = instant("2026-01-25T12:00:00.001Z"))
        create("#02", publicationTime = instant("2026-01-25T13:00:00.001Z"))
        create("#03", publicationTime = instant("2026-01-25T14:00:00.001Z"))
        create("#04", publicationTime = instant("2026-01-25T15:00:00.001Z"))
        create("#05", publicationTime = instant("2026-01-25T16:00:00.001Z"))
        create("#06", publicationTime = instant("2026-01-25T17:00:00.001Z"))
        create("#07", publicationTime = instant("2026-01-25T18:00:00.001Z"))
        create("#08", publicationTime = instant("2026-01-25T19:00:00.001Z"))
        create("#09", publicationTime = instant("2026-01-25T20:00:00.001Z"))

        every { clock.instant() } returns instant("2026-01-25T18:00:59.999Z") // just before #08

        titlesOf(getPagedResult(1)) shouldBe listOf("#07", "#06", "#05")
        titlesOf(getPagedResult(2)) shouldBe listOf("#04", "#03", "#02")
        titlesOf(getPagedResult(3)) shouldBe listOf("#01")
        titlesOf(getPagedResult(4)) shouldBe emptyList()

        every { clock.instant() } returns instant("2026-01-25T19:00:00.001Z") // exactly like #08

        titlesOf(getPagedResult(1)) shouldBe listOf("#08", "#07", "#06")
        titlesOf(getPagedResult(2)) shouldBe listOf("#05", "#04", "#03")
        titlesOf(getPagedResult(3)) shouldBe listOf("#02", "#01")
        titlesOf(getPagedResult(4)) shouldBe emptyList()
    }

    @Test
    fun `getting a page returns its content and paging metadata`() {
        every { clock.instant() } returns instant("2026-01-01T10:00:00.001Z")

        val post1 = create("#01", publicationTime = instant("2026-01-25T12:00:00.001Z"))
        val post2 = create("#02", publicationTime = instant("2026-01-25T13:00:00.001Z"))
        val post3 = create("#03", publicationTime = instant("2026-01-25T14:00:00.001Z"))

        every { clock.instant() } returns instant("2026-01-27T12:34:56.789Z")

        getPagedResult(1, size = 2) shouldBe PagedResult(
            content = listOf(post3, post2),
            page = Page(
                number = 1,
                size = 2,
                totalElements = 3,
                totalPages = 2,
            ),
        )
        getPagedResult(2, size = 2) shouldBe PagedResult(
            content = listOf(post1),
            page = Page(
                number = 2,
                size = 2,
                totalElements = 3,
                totalPages = 2,
            ),
        )
    }

    private fun titlesOf(page: PagedResult<BlogPost>): List<String> =
        page.content.map { it.data.title }

    private fun create(testId: String, publicationTime: Instant): BlogPost {
        val data = BlogPostData(
            title = testId,
            summary = "summary-$testId",
            content = "content-$testId",
            publicationTime = publicationTime,
        )
        return crud.create(defaultUser, data)
    }

    private fun getPagedResult(number: Int, size: Int = 3): PagedResult<BlogPost> =
        cut.getPage(PageQuery(number = number, size = size))

    private fun instant(isoValue: String) = Instant.parse(isoValue)
}
