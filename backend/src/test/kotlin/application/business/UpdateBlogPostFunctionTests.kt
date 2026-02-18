package application.business

import application.TestData.defaultUser
import application.business.model.BlogPost
import application.business.model.MutableBlogPost
import application.persistence.BlogPostCrudRepository
import io.kotest.matchers.shouldBe
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Test
import java.util.UUID.randomUUID

class UpdateBlogPostFunctionTests {

    private val repository: BlogPostCrudRepository = mockk()
    private val cut = UpdateBlogPostFunction(repository)

    private val uid = randomUUID()
    private val update: (MutableBlogPost) -> Unit = { it.data.title = "Updated Title" }

    @Test
    fun `delegates to repository and returns updated blog post when found`() {
        val updatedBlogPost: BlogPost = mockk()
        every { repository.updateById(defaultUser, uid, update) } returns updatedBlogPost
        val result = cut(defaultUser, uid, update)
        result shouldBe updatedBlogPost
    }

    @Test
    fun `delegates to repository and returns null when not found`() {
        every { repository.updateById(defaultUser, uid, update) } returns null
        val result = cut(defaultUser, uid, update)
        result shouldBe null
    }
}
