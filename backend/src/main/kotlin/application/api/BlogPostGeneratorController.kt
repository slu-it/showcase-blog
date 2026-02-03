package application.api

import application.business.GenerateBlogPostFunction
import application.config.NeedsAdminRole
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/blog-posts-generator")
class BlogPostGeneratorController(
    private val generateBlogPost: GenerateBlogPostFunction,
) {

    @PostMapping
    @NeedsAdminRole
    fun generate(auth: JwtAuthenticationToken, @RequestBody request: GenerationRequest) {
        generateBlogPost(user(auth), request.amount)
    }

    @Suppress("MagicNumber")
    data class GenerationRequest(
        val amount: Int,
    ) {
        init {
            require(amount > 0) { "amount must be greater than 0" }
            require(amount <= 25) { "amount must be less or equal to 25" } // depends on available generated posts
        }
    }
}
