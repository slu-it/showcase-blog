package application.persistence

import application.business.model.BlogPost
import application.business.model.PageQuery
import application.business.model.PagedResult
import application.business.model.PagedResult.Page
import org.springframework.jdbc.core.simple.JdbcClient
import org.springframework.stereotype.Repository
import java.time.Clock
import java.time.Instant
import java.time.ZoneOffset

@Repository
class BlogPostSearchRepository(
    private val client: JdbcClient,
    private val clock: Clock,
) {

    private val completePageQuery =
        """
        SELECT * FROM blog_posts
        ORDER BY publication_time DESC
        LIMIT :pageSize OFFSET :offset
        """.trimIndent()
    private val publishedPageQuery =
        """
        SELECT * FROM blog_posts
        WHERE publication_time <= :now
        ORDER BY publication_time DESC
        LIMIT :pageSize OFFSET :offset
        """.trimIndent()

    private val completeTotalsQuery =
        "SELECT COUNT(*) FROM blog_posts"
    private val publishedTotalsQuery =
        "SELECT COUNT(*) FROM blog_posts WHERE publication_time <= :now"

    fun getPage(query: PageQuery, includeFuture: Boolean): PagedResult<BlogPost> {
        return when (includeFuture) {
            true -> getPage(query, completePageQuery, completeTotalsQuery)
            false -> getPage(query, publishedPageQuery, publishedTotalsQuery)
        }
    }

    private fun getPage(query: PageQuery, pageQuery: String, totalsQuery: String): PagedResult<BlogPost> {
        val now = clock.instant()
        val offset = (query.number - 1) * query.size

        val content = client.sql(pageQuery)
            .param("now", withOffset(now))
            .param("pageSize", query.size)
            .param("offset", offset)
            .query(BlogPostMapper)
            .list()

        val totalElements = client.sql(totalsQuery)
            .param("now", withOffset(now))
            .query(Long::class.java)
            .single()

        return PagedResult(
            content = content,
            page = Page(
                number = query.number,
                size = query.size,
                totalElements = totalElements,
                totalPages = (totalElements + query.size - 1) / query.size,
            )
        )
    }

    private fun withOffset(instant: Instant) = instant.atOffset(ZoneOffset.UTC)
}
