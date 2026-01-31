package application.api

import org.springframework.hateoas.RepresentationModel
import org.springframework.hateoas.server.core.Relation
import java.time.Instant
import java.util.UUID

// CONTEXT

data class Context(
    val user: UserDto
) : RepresentationModel<Context>()

data class UserDto(
    val username: String,
    val isAuthor: Boolean,
    val isAdmin: Boolean,
)

// BLOG POSTS

data class CreationData(
    val title: String,
    val summary: String?,
    val content: String?,
    val publicationTime: Instant?,
)

@Relation(value = "blogPost", collectionRelation = "blogPosts")
data class BlogPostRepresentation(
    val uid: UUID,
    val title: String,
    val summary: String,
    val content: String?,
    val publicationTime: Instant,
) : RepresentationModel<BlogPostRepresentation>()
