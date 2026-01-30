package application.api

import application.business.CreateBlogPostFunction
import application.business.DeleteBlogPostFunction
import application.business.GetBlogPostFunction
import application.business.GetBlogPostsFunction
import application.business.PageQuery
import application.business.UpdateBlogPostFunction
import application.config.NeedsAuthorRole
import application.config.NeedsUserRole
import org.springframework.hateoas.PagedModel
import org.springframework.http.HttpStatus.CREATED
import org.springframework.http.HttpStatus.NO_CONTENT
import org.springframework.http.ResponseEntity
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import tools.jackson.databind.JsonNode
import java.time.Clock
import java.util.UUID

@RestController
@RequestMapping("/api/blog-posts")
class BlogPostController(
    private val createBlogPost: CreateBlogPostFunction,
    private val updateBlogPost: UpdateBlogPostFunction,
    private val deleteBlogPost: DeleteBlogPostFunction,
    private val getBlogPost: GetBlogPostFunction,
    private val getBlogPosts: GetBlogPostsFunction,
    private val clock: Clock
) {

    @NeedsAuthorRole
    @PostMapping
    @ResponseStatus(CREATED)
    fun create(
        auth: JwtAuthenticationToken,
        @RequestBody data: CreationData
    ): BlogPostRepresentation {
        val user = user(auth)
        val blogPost = createBlogPost(user, blogPostData(data, clock))
        return representation(blogPost, user)
    }

    @NeedsAuthorRole
    @PatchMapping("/{uid}")
    fun patch(
        auth: JwtAuthenticationToken,
        @PathVariable uid: UUID,
        @RequestBody data: JsonNode
    ): ResponseEntity<BlogPostRepresentation> {
        val user = user(auth)
        val blogPost = updateBlogPost(user, uid) { post -> patch(post, data) }
        return when (blogPost) {
            null -> ResponseEntity.notFound().build()
            else -> ResponseEntity.ok(representation(blogPost, user))
        }
    }

    @NeedsAuthorRole
    @DeleteMapping("/{uid}")
    @ResponseStatus(NO_CONTENT)
    fun delete(
        auth: JwtAuthenticationToken,
        @PathVariable uid: UUID
    ) {
        deleteBlogPost(user(auth), uid)
    }

    @NeedsUserRole
    @GetMapping("/{uid}")
    fun get(
        auth: JwtAuthenticationToken,
        @PathVariable uid: UUID
    ): ResponseEntity<BlogPostRepresentation> {
        val user = user(auth)
        val blogPost = getBlogPost(user, uid)
        return when (blogPost) {
            null -> ResponseEntity.notFound().build()
            else -> ResponseEntity.ok(representation(blogPost, user))
        }
    }

    @NeedsUserRole
    @GetMapping
    fun getPage(
        auth: JwtAuthenticationToken,
        @RequestParam("pageNumber") pageNumber: Int,
        @RequestParam("pageSize", defaultValue = "25") pageSize: Int,
    ): PagedModel<BlogPostRepresentation> {
        val user = user(auth)
        val page = getBlogPosts(user, PageQuery(pageNumber, pageSize))
        return representations(page, user)
    }
}
