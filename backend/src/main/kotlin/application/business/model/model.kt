@file:Suppress("MatchingDeclarationName")

package application.business.model

import java.time.Instant
import java.util.UUID

data class User(
    val uid: String,
    val isUser: Boolean,
    val isAuthor: Boolean,
    val isAdmin: Boolean,
)

data class BlogPost(
    val uid: UUID,
    val data: BlogPostData,
    val metadata: BlogPostMetadata,
) {
    companion object {
        fun from(post: MutableBlogPost): BlogPost =
            BlogPost(
                uid = post.uid,
                data = BlogPostData.from(post.data),
                metadata = post.metadata
            )
    }
}

data class MutableBlogPost(
    val uid: UUID,
    val data: MutableBlogPostData,
    val metadata: BlogPostMetadata,
) {
    companion object {
        fun from(post: BlogPost): MutableBlogPost =
            MutableBlogPost(
                uid = post.uid,
                data = MutableBlogPostData.from(post.data),
                metadata = post.metadata
            )
    }
}

data class BlogPostData(
    val title: String,
    val summary: String,
    val content: String,
    val publicationTime: Instant,
) {
    companion object {
        fun from(data: MutableBlogPostData): BlogPostData =
            BlogPostData(
                title = data.title,
                summary = data.summary,
                content = data.content,
                publicationTime = data.publicationTime,
            )
    }
}

data class MutableBlogPostData(
    var title: String,
    var summary: String,
    var content: String,
    var publicationTime: Instant,
) {

    companion object {
        fun from(data: BlogPostData): MutableBlogPostData =
            MutableBlogPostData(
                title = data.title,
                summary = data.summary,
                content = data.content,
                publicationTime = data.publicationTime,
            )
    }
}

data class BlogPostMetadata(
    val createdAt: Instant,
    val createdBy: String,
    val lastUpdatedAt: Instant,
    val lastUpdatedBy: String,
)

@Suppress("MagicNumber")
data class PageQuery(
    val number: Int, // first page = 1
    val size: Int,
) {
    init {
        require(number > 0) { "number must be greater than 0, but was $number" }
        require(size > 0) { "size must be greater than 0, but was $size" }
        require(size <= 100) { "size must be less then or equal to 100, but was $size" }
    }
}

data class PagedResult<T>(
    val content: List<T>,
    val page: Page,
) {
    data class Page(
        val number: Int,
        val size: Int,
        val totalElements: Long,
        val totalPages: Long,
    )
}
