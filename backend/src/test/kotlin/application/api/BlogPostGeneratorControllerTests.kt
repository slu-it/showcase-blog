package application.api

import application.business.GenerateBlogPostFunction
import application.config.SecurityConfiguration
import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import io.mockk.just
import io.mockk.runs
import io.mockk.verify
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType.APPLICATION_JSON
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.post

@ActiveProfiles("test")
@WebMvcTest(BlogPostGeneratorController::class)
@Import(SecurityConfiguration::class)
@MockkBean(types = [GenerateBlogPostFunction::class])
class BlogPostGeneratorControllerTests(
    @Autowired private val mockMvc: MockMvc,
    @Autowired private val generateBlogPost: GenerateBlogPostFunction,
) {

    @Test
    fun `POST on blog posts generator as a user returns 403`() {
        mockMvc.post("/api/blog-posts-generator") {
            with(jwtWithUserRole())
            contentType = APPLICATION_JSON
            content = jsonValue("""{ "amount": 5 }""")
        }.andExpect {
            status { isForbidden() }
        }
    }

    @Test
    fun `POST on blog posts generator as an author returns 403`() {
        mockMvc.post("/api/blog-posts-generator") {
            with(jwtWithAuthorRole())
            contentType = APPLICATION_JSON
            content = jsonValue("""{ "amount": 5 }""")
        }.andExpect {
            status { isForbidden() }
        }
    }

    @Test
    fun `POST on blog posts generator as an admin with valid amount generates blog posts and returns 200`() {
        every { generateBlogPost(any(), 5) } just runs

        mockMvc.post("/api/blog-posts-generator") {
            with(jwtWithAdminRole())
            contentType = APPLICATION_JSON
            content = jsonValue("""{ "amount": 5 }""")
        }.andExpect {
            status { isOk() }
        }

        verify { generateBlogPost(any(), 5) }
    }

    @Test
    fun `POST on blog posts generator as an admin with amount of 0 returns 400`() {
        mockMvc.post("/api/blog-posts-generator") {
            with(jwtWithAdminRole())
            contentType = APPLICATION_JSON
            content = jsonValue("""{ "amount": 0 }""")
        }.andExpect {
            status { isBadRequest() }
        }
    }

    @Test
    fun `POST on blog posts generator as an admin with amount greater than 25 returns 400`() {
        mockMvc.post("/api/blog-posts-generator") {
            with(jwtWithAdminRole())
            contentType = APPLICATION_JSON
            content = jsonValue("""{ "amount": 26 }""")
        }.andExpect {
            status { isBadRequest() }
        }
    }
}
