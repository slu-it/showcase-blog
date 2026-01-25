package application.business

import application.persistence.BlogPostSearchRepository
import org.springframework.stereotype.Component

@Component
class GetBlogPostsFunction(
    private val repository: BlogPostSearchRepository
) {
    operator fun invoke(user: CurrentUser, query: PageQuery): PagedResult<BlogPost> {
        // TODO
        //  - load blog post authorship data
        //  - if user is not the author, increase read counter
        return repository.getPage(query)
    }
}
