package application.business

import application.persistence.BlogPostCrudRepository
import org.springframework.stereotype.Component
import java.util.UUID

@Component
class GetBlogPostFunction(
    private val repository: BlogPostCrudRepository
) {
    operator fun invoke(user: CurrentUser, uid: UUID): BlogPost? {
        // TODO
        //  - load blog post authorship data
        //  - if user is not the author, increase read counter
        return repository.findById(uid)
    }
}
