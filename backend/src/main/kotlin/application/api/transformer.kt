package application.api

import application.business.BlogPost
import application.business.BlogPostData
import application.business.MutableBlogPost
import application.business.PagedResult
import application.business.User
import application.config.isAdmin
import application.config.isAuthor
import application.config.isUser
import org.springframework.hateoas.Link
import org.springframework.hateoas.PagedModel
import org.springframework.hateoas.PagedModel.PageMetadata
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import tools.jackson.databind.JsonNode
import java.time.Clock
import java.time.Instant
import kotlin.jvm.optionals.getOrNull

fun user(authentication: JwtAuthenticationToken): User =
    User(
        uid = authentication.name,
        isUser = isUser(authentication),
        isAuthor = isAuthor(authentication),
        isAdmin = isAdmin(authentication),
    )

fun blogPostData(data: CreationData, clock: Clock): BlogPostData =
    BlogPostData(
        title = data.title,
        summary = data.summary ?: "",
        content = data.content ?: "",
        publicationTime = data.publicationTime ?: clock.instant(),
    )

fun patch(post: MutableBlogPost, data: JsonNode) {
    ifPresent(data, "title") {
        post.data.title = it.stringValueOpt().getOrNull()
            ?.takeUnless { it.isBlank() }
            ?: error("Can't remove 'title' from blog post!")
    }
    ifPresent(data, "summary") {
        post.data.summary = it.stringValueOpt().orElse("")
    }
    ifPresent(data, "content") {
        post.data.content = it.stringValueOpt().orElse("")
    }
    ifPresent(data, "publicationTime") {
        post.data.publicationTime = it.stringValueOpt().getOrNull()
            ?.takeUnless { it.isBlank() }
            ?.let(Instant::parse)
            ?: error("Can't remove 'publicationTime' from blog post!")
    }
}

private fun ifPresent(source: JsonNode, key: String, block: (JsonNode) -> Unit) {
    if (source.has(key)) block(source.get(key))
}

fun representation(blogPost: BlogPost, user: User, includeContent: Boolean = true) =
    BlogPostRepresentation(
        uid = blogPost.uid,
        title = blogPost.data.title,
        summary = blogPost.data.summary,
        content = blogPost.data.content.takeIf { includeContent },
        publicationTime = blogPost.data.publicationTime,
    ).apply {
        add(Link.of("/api/blog-posts/${blogPost.uid}", "self"))
        if (user.isAuthor) {
            add(Link.of("/api/blog-posts/${blogPost.uid}", "patch"))
            add(Link.of("/api/blog-posts/${blogPost.uid}", "delete"))
        }
    }

// TODO maybe this deserves its own model that makes it clear from database to controller, that the content
//  is not loaded?
fun representations(page: PagedResult<BlogPost>, user: User): PagedModel<BlogPostRepresentation> =
    PagedModel.of(
        page.content.map { representation(it, user, includeContent = false) },
        PageMetadata(
            page.page.size.toLong(),
            page.page.number.toLong(),
            page.page.totalElements,
            page.page.totalPages
        )
    )
