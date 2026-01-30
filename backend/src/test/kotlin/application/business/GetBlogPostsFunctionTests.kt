package application.business

import application.TestData.defaultUser
import application.persistence.BlogPostSearchRepository
import io.kotest.matchers.shouldBe
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test

class GetBlogPostsFunctionTests {

    private val repository: BlogPostSearchRepository = mockk()
    private val cut = GetBlogPostsFunction(repository)

    private val page: PagedResult<BlogPost> = mockk()
    private val query = PageQuery(number = 1, size = 10)

    @BeforeEach
    fun stubDefaultBehaviour() {
        every { repository.getPage(any(), any()) } returns page
    }

    @Nested
    inner class AsUser {

        private val user = defaultUser.copy(isAuthor = false)

        @Test
        fun `delegates to repository and returns blog post when found`() {
            cut(user, query) shouldBe page
            verify { repository.getPage(query, includeFuture = false) }
        }
    }

    @Nested
    inner class AsAuthor {

        private val user = defaultUser.copy(isAuthor = true)

        @Test
        fun `delegates to repository and returns past blog post when found`() {
            cut(user, query) shouldBe page
            verify { repository.getPage(query, includeFuture = true) }
        }
    }
}
