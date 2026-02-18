package application.business

import application.business.model.BlogPost
import application.business.model.User
import application.persistence.BlogPostCrudRepository
import org.springframework.stereotype.Component
import java.time.Clock
import java.util.UUID

@Component
class GetBlogPostFunction(
    private val repository: BlogPostCrudRepository,
    private val clock: Clock,
) {

    // TODO
    //  - load blog post authorship data
    //  - if user is not the author, increase read counter

    operator fun invoke(user: User, uid: UUID): BlogPost? {
        val blogPost = repository.findById(uid)
            ?.takeIf { it isAvailableTo user }
        return blogPost
    }

    private infix fun BlogPost.isAvailableTo(user: User): Boolean = when {
        !user.isAuthor -> data.publicationTime.isBefore(clock.instant())
        else -> true
    }
}
