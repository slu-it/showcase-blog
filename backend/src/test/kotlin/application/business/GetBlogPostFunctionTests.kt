package application.business

import application.TestData.defaultUser
import application.persistence.BlogPostCrudRepository
import io.kotest.matchers.shouldBe
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Test
import java.util.UUID.randomUUID

class GetBlogPostFunctionTests {

    private val repository: BlogPostCrudRepository = mockk()
    private val cut = GetBlogPostFunction(repository)

    private val uid = randomUUID()

    @Test
    fun `delegates to repository and returns blog post when found`() {
        val blogPost: BlogPost = mockk()
        every { repository.findById(uid) } returns blogPost
        val result = cut(defaultUser, uid)
        result shouldBe blogPost
    }

    @Test
    fun `delegates to repository and returns null when not found`() {
        every { repository.findById(uid) } returns null
        val result = cut(defaultUser, uid)
        result shouldBe null
    }
}
