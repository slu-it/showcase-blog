package application.api

import application.business.GetBlogPostFunction
import application.business.GetBlogPostsFunction
import application.business.PageQuery
import org.springframework.hateoas.PagedModel
import org.springframework.http.ResponseEntity
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/viewer/blog-posts")
class BlogPostViewerController(
    private val getBlogPost: GetBlogPostFunction,
    private val getBlogPosts: GetBlogPostsFunction,
) {

    @GetMapping("/{uid}")
    fun get(
        auth: JwtAuthenticationToken,
        @PathVariable("uid") uid: UUID
    ): ResponseEntity<BlogPostRepresentation> {
        val blogPost = getBlogPost(user(auth), uid)
        return when (blogPost) {
            null -> ResponseEntity.notFound().build()
            else -> ResponseEntity.ok(representation(blogPost))
        }
    }

    @GetMapping
    fun getPage(
        auth: JwtAuthenticationToken,
        @RequestParam("pageNumber") pageNumber: Int,
        @RequestParam("pageSize", defaultValue = "25") pageSize: Int,
    ): PagedModel<BlogPostRepresentation> {
        val page = getBlogPosts(user(auth), PageQuery(pageNumber, pageSize))
        return representations(page)
    }
}
