package application.business

import application.TestData.blogPostData1
import application.TestData.defaultUser
import application.business.model.BlogPost
import application.persistence.BlogPostCrudRepository
import io.kotest.matchers.shouldBe
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Test

class CreateBlogPostFunctionTests {

    private val repository: BlogPostCrudRepository = mockk()
    private val cut = CreateBlogPostFunction(repository)

    @Test
    fun `delegates creation to repository and returns result`() {
        val blogPost: BlogPost = mockk()
        every { repository.create(defaultUser, blogPostData1) } returns blogPost
        val result = cut(defaultUser, blogPostData1)
        result shouldBe blogPost
    }
}
