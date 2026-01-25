package application.api

import org.springframework.hateoas.RepresentationModel
import org.springframework.hateoas.server.core.Relation
import java.time.Instant

data class CreationData(
    val title: String,
    val summary: String?,
    val content: String?,
    val publicationTime: Instant?,
)

data class PatchData(
    val title: String?,
    val summary: String?,
    val content: String?,
    val publicationTime: Instant?,
)

@Relation(value = "blogPost", collectionRelation = "blogPosts")
data class BlogPostRepresentation(
    val title: String,
    val summary: String,
    val content: String?,
    val publicationTime: Instant,
) : RepresentationModel<BlogPostRepresentation>()
