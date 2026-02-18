package application.business

import application.business.model.BlogPost
import application.business.model.MutableBlogPost
import application.business.model.User
import application.persistence.BlogPostCrudRepository
import org.springframework.stereotype.Component
import java.util.UUID

@Component
class UpdateBlogPostFunction(
    private val repository: BlogPostCrudRepository
) {
    operator fun invoke(user: User, uid: UUID, update: (MutableBlogPost) -> Unit): BlogPost? {
        // TODO
        //  - allow update only if user is the author or an admin
        return repository.updateById(user, uid, update)
    }
}
