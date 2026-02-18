package application.business

import application.business.model.BlogPostData
import application.business.model.User
import org.springframework.core.io.ClassPathResource
import org.springframework.stereotype.Component
import tools.jackson.module.kotlin.jacksonObjectMapper
import tools.jackson.module.kotlin.readValue
import java.time.Clock
import java.time.Duration
import java.time.Instant
import java.util.Deque
import java.util.LinkedList
import kotlin.random.Random.Default.nextLong

@Component
class GenerateBlogPostFunction(
    private val createBlogPost: CreateBlogPostFunction,
    private val clock: Clock
) {

    private val blogPostData = ClassPathResource("/blog-posts/generated.json")
        .let { jacksonObjectMapper().readValue<List<GeneratedData>>(it.contentAsByteArray) }

    @Suppress("MagicNumber")
    operator fun invoke(user: User, amount: Int) {
        val blogPostDataPool = getNewBlogPostDataPool()

        val now = clock.instant()
        val earliest = now.minus(Duration.ofDays(7))

        repeat(amount) {
            val picked = blogPostDataPool.pop()
            val data = BlogPostData(
                title = picked.title,
                summary = picked.summary,
                content = picked.content,
                publicationTime = randomInstantBetween(earliest, now),
            )
            createBlogPost(user, data)
        }
    }

    private fun getNewBlogPostDataPool(): Deque<GeneratedData> =
        LinkedList(blogPostData.toMutableList().shuffled())

    private fun randomInstantBetween(start: Instant, end: Instant): Instant {
        require(!end.isBefore(start)) { "End must not be before start" }

        val startMillis = start.toEpochMilli()
        val endMillis = end.toEpochMilli()

        return Instant.ofEpochMilli(nextLong(startMillis, endMillis))
    }

    private data class GeneratedData(val title: String, val summary: String, val content: String)
}
