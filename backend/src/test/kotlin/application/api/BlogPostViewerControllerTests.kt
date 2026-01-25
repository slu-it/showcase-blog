package application.api

import application.TestData.blogPostData1
import application.TestData.blogPostData2
import application.TestData.defaultUser
import application.business.BlogPost
import application.business.BlogPostMetadata
import application.business.GetBlogPostFunction
import application.business.GetBlogPostsFunction
import application.business.PageQuery
import application.business.PagedResult
import application.config.SecurityConfiguration
import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.hateoas.MediaTypes.HAL_JSON
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import java.time.Instant
import java.util.UUID

@ActiveProfiles("test")
@WebMvcTest(BlogPostViewerController::class)
@Import(SecurityConfiguration::class)
@MockkBean(
    types = [
        GetBlogPostFunction::class,
        GetBlogPostsFunction::class,
    ]
)
class BlogPostViewerControllerTests(
    @Autowired private val mockMvc: MockMvc,
    @Autowired private val getBlogPost: GetBlogPostFunction,
    @Autowired private val getBlogPosts: GetBlogPostsFunction,
) {

    private val blogPostUid1 = UUID.fromString("a1b2c3d4-e5f6-7890-abcd-ef1234567890")
    private val blogPostUid2 = UUID.fromString("b2c3d4e5-f6a7-8901-bcde-f12345678901")
    private val now = Instant.parse("2025-06-15T12:00:00Z")

    private val blogPost1 = BlogPost(
        uid = blogPostUid1,
        data = blogPostData1,
        metadata = BlogPostMetadata(
            createdAt = now,
            createdBy = defaultUser.uid,
            lastUpdatedAt = now,
            lastUpdatedBy = defaultUser.uid,
        )
    )

    private val blogPost2 = BlogPost(
        uid = blogPostUid2,
        data = blogPostData2,
        metadata = BlogPostMetadata(
            createdAt = now,
            createdBy = defaultUser.uid,
            lastUpdatedAt = now,
            lastUpdatedBy = defaultUser.uid,
        )
    )

    @Test
    fun `GET by UID returns 200 with blog post representation when found`() {
        every { getBlogPost(any(), blogPostUid1) } returns blogPost1

        mockMvc.get("/api/viewer/blog-posts/{uid}", blogPostUid1) {
            with(jwtWithUserRole())
        }.andExpect {
            status { isOk() }
            content {
                contentType(HAL_JSON)
                json(
                    """
                    {
                        "title": "Database Indexing Best Practices",
                        "summary": "How to optimize your PostgreSQL queries with proper indexing",
                        "content": "Indexes are crucial for query performance but come with trade-offs for write operations...",
                        "publicationTime": "2025-12-01T09:00:00Z",
                        "_links": {
                            "self": { "href": "/api/viewer/blog-posts/a1b2c3d4-e5f6-7890-abcd-ef1234567890" },
                            "patch": { "href": "/api/editor/blog-posts/a1b2c3d4-e5f6-7890-abcd-ef1234567890" },
                            "delete": { "href": "/api/editor/blog-posts/a1b2c3d4-e5f6-7890-abcd-ef1234567890" }
                        }
                    }
                    """
                )
            }
        }
    }

    @Test
    fun `GET page returns 200 with paged blog post representations`() {
        val pagedResult = PagedResult(
            content = listOf(blogPost1, blogPost2),
            page = PagedResult.Page(
                number = 1,
                size = 25,
                totalElements = 2,
                totalPages = 1,
            )
        )
        every { getBlogPosts(any(), PageQuery(1, 25)) } returns pagedResult

        mockMvc.get("/api/viewer/blog-posts") {
            with(jwtWithUserRole())
            queryParam("pageNumber", "1")
            queryParam("pageSize", "25")
        }.andExpect {
            status { isOk() }
            content {
                contentType(HAL_JSON)
                json(
                    """
                    {
                        "_embedded": {
                            "blogPosts": [
                                {
                                    "title": "Database Indexing Best Practices",
                                    "summary": "How to optimize your PostgreSQL queries with proper indexing",
                                    "publicationTime": "2025-12-01T09:00:00Z",
                                    "_links": {
                                        "self": { "href": "/api/viewer/blog-posts/a1b2c3d4-e5f6-7890-abcd-ef1234567890" },
                                        "patch": { "href": "/api/editor/blog-posts/a1b2c3d4-e5f6-7890-abcd-ef1234567890" },
                                        "delete": { "href": "/api/editor/blog-posts/a1b2c3d4-e5f6-7890-abcd-ef1234567890" }
                                    }
                                },
                                {
                                    "title": "Getting Started with Kotlin Coroutines",
                                    "summary": "A beginner's guide to asynchronous programming in Kotlin",
                                    "publicationTime": "2024-03-15T10:00:00Z",
                                    "_links": {
                                        "self": { "href": "/api/viewer/blog-posts/b2c3d4e5-f6a7-8901-bcde-f12345678901" },
                                        "patch": { "href": "/api/editor/blog-posts/b2c3d4e5-f6a7-8901-bcde-f12345678901" },
                                        "delete": { "href": "/api/editor/blog-posts/b2c3d4e5-f6a7-8901-bcde-f12345678901" }
                                    }
                                }
                            ]
                        },
                        "page": {
                            "size": 25,
                            "totalElements": 2,
                            "totalPages": 1,
                            "number": 1
                        }
                    }
                    """
                )
            }
        }
    }
}
