package application.business

import application.persistence.BlogPostSearchRepository
import org.springframework.stereotype.Component

@Component
class GetBlogPostsFunction(
    private val repository: BlogPostSearchRepository
) {
    operator fun invoke(user: User, query: PageQuery): PagedResult<BlogPost> =
        when {
            user.isAuthor -> repository.getPage(query, includeFuture = true)
            else -> repository.getPage(query, includeFuture = false)
        }
}
