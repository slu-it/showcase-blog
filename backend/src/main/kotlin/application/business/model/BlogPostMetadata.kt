package application.business.model

import java.time.Instant

data class BlogPostMetadata(
    val createdAt: Instant,
    val createdBy: String,
    val lastUpdatedAt: Instant,
    val lastUpdatedBy: String,
)
