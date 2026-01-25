package application.api

import application.business.BlogPost
import application.business.BlogPostData
import application.business.CurrentUser
import application.business.MutableBlogPost
import application.business.PagedResult
import org.springframework.hateoas.Link
import org.springframework.hateoas.PagedModel
import org.springframework.hateoas.PagedModel.PageMetadata
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import java.time.Clock

fun user(authentication: JwtAuthenticationToken): CurrentUser = CurrentUser(uid = authentication.name)

fun blogPostData(data: CreationData, clock: Clock): BlogPostData =
    BlogPostData(
        title = data.title,
        summary = data.summary ?: "",
        content = data.content ?: "",
        publicationTime = data.publicationTime ?: clock.instant(),
    )

fun patch(post: MutableBlogPost, data: PatchData) {
    if (data.title != null) post.data.title = data.title
    if (data.summary != null) post.data.summary = data.summary
    if (data.content != null) post.data.content = data.content
    if (data.publicationTime != null) post.data.publicationTime = data.publicationTime
}

fun representation(blogPost: BlogPost, includeContent: Boolean = true) =
    BlogPostRepresentation(
        title = blogPost.data.title,
        summary = blogPost.data.summary,
        content = blogPost.data.content.takeIf { includeContent },
        publicationTime = blogPost.data.publicationTime,
    ).apply {
        add(Link.of("/api/viewer/blog-posts/${blogPost.uid}", "self"))
        add(Link.of("/api/editor/blog-posts/${blogPost.uid}", "patch"))
        add(Link.of("/api/editor/blog-posts/${blogPost.uid}", "delete"))
    }

// TODO maybe this deserves its own model that makes it clear from database to controller, that the content
//  is not loaded?
fun representations(page: PagedResult<BlogPost>): PagedModel<BlogPostRepresentation> =
    PagedModel.of(
        page.content.map { representation(it, includeContent = false) },
        PageMetadata(
            page.page.size.toLong(),
            page.page.number.toLong(),
            page.page.totalElements,
            page.page.totalPages
        )
    )
