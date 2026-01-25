package application.business

import application.persistence.BlogPostCrudRepository
import org.springframework.stereotype.Component

@Component
class CreateBlogPostFunction(
    private val repository: BlogPostCrudRepository
) {
    operator fun invoke(user: CurrentUser, data: BlogPostData): BlogPost {
        // TODO
        //  - check if user can create a blog post
        //  - user can create if they are an author
        return repository.create(user, data)
    }
}
