package application.business.model

import java.util.UUID

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
