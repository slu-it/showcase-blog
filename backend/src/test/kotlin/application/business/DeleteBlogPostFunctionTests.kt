package application.business

import application.TestData.defaultUser
import application.persistence.BlogPostCrudRepository
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Test
import java.util.UUID.randomUUID
import kotlin.random.Random

class DeleteBlogPostFunctionTests {

    private val repository: BlogPostCrudRepository = mockk()
    private val cut = DeleteBlogPostFunction(repository)

    private val uid = randomUUID()

    @Test
    fun `delegates deletion to repository`() {
        every { repository.deleteById(uid) } returns Random.nextBoolean()
        cut(defaultUser, uid)
        verify { repository.deleteById(uid) }
    }
}
