package application.business.model

import java.time.Instant

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
