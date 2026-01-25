package application.business

import application.persistence.BlogPostCrudRepository
import org.springframework.stereotype.Component
import java.util.UUID

@Component
class DeleteBlogPostFunction(
    private val repository: BlogPostCrudRepository
) {
    operator fun invoke(user: CurrentUser, uid: UUID) {
        // TODO
        //  - load blog post authorship data
        //  - check if user can delete the blog post
        //  - user can delete if they are the post's author or an admin
        repository.deleteById(uid)
    }
}
