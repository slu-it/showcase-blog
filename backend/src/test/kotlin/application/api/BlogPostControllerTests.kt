package application.api

import application.TestData.blogPostData1
import application.TestData.blogPostData2
import application.TestData.defaultUser
import application.business.BlogPost
import application.business.BlogPostMetadata
import application.business.CreateBlogPostFunction
import application.business.DeleteBlogPostFunction
import application.business.GetBlogPostFunction
import application.business.GetBlogPostsFunction
import application.business.PageQuery
import application.business.PagedResult
import application.business.UpdateBlogPostFunction
import application.config.SecurityConfiguration
import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import io.mockk.just
import io.mockk.runs
import io.mockk.verify
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.hateoas.MediaTypes.HAL_JSON
import org.springframework.http.MediaType.APPLICATION_JSON
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.json.JsonCompareMode.LENIENT
import org.springframework.test.json.JsonCompareMode.STRICT
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.delete
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.patch
import org.springframework.test.web.servlet.post
import java.time.Clock
import java.time.Instant
import java.util.UUID

@ActiveProfiles("test")
@WebMvcTest(BlogPostController::class)
@Import(SecurityConfiguration::class)
@MockkBean(
    types = [
        CreateBlogPostFunction::class,
        UpdateBlogPostFunction::class,
        DeleteBlogPostFunction::class,
        GetBlogPostFunction::class,
        GetBlogPostsFunction::class,
        Clock::class
    ]
)
@Suppress("LongParameterList", "LongMethod")
class BlogPostControllerTests(
    @Autowired private val mockMvc: MockMvc,
    @Autowired private val createBlogPost: CreateBlogPostFunction,
    @Autowired private val updateBlogPost: UpdateBlogPostFunction,
    @Autowired private val deleteBlogPost: DeleteBlogPostFunction,
    @Autowired private val getBlogPost: GetBlogPostFunction,
    @Autowired private val getBlogPosts: GetBlogPostsFunction,
    @Autowired private val clock: Clock,
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

    @Nested
    inner class PostBlogPost {

        @Test
        fun `POST on blog posts as a user returns 403`() {
            mockMvc.post("/api/blog-posts") {
                with(jwtWithUserRole())
                contentType = APPLICATION_JSON
                content = jsonValue(
                    """
                    {
                        "title": "Database Indexing Best Practices",
                        "summary": "How to optimize your PostgreSQL queries with proper indexing",
                        "content": "Indexes are crucial for query performance but come with trade-offs for write operations...",
                        "publicationTime": "2025-12-01T09:00:00Z"
                    }
                    """
                )
            }.andExpect {
                status { isForbidden() }
            }
        }

        @Test
        fun `POST on blog posts as an author creates a new blog post and returns 201 with representation`() {
            every { clock.instant() } returns now
            every { createBlogPost(any(), any()) } returns blogPost1

            mockMvc.post("/api/blog-posts") {
                with(jwtWithAuthorRole())
                contentType = APPLICATION_JSON
                content = jsonValue(
                    """
                    {
                        "title": "Database Indexing Best Practices",
                        "summary": "How to optimize your PostgreSQL queries with proper indexing",
                        "content": "Indexes are crucial for query performance but come with trade-offs for write operations...",
                        "publicationTime": "2025-12-01T09:00:00Z"
                    }
                    """
                )
            }.andExpect {
                status { isCreated() }
                content {
                    contentType(HAL_JSON)
                    json(
                        """
                        {
                            "uid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                            "title": "Database Indexing Best Practices",
                            "summary": "How to optimize your PostgreSQL queries with proper indexing",
                            "content": "Indexes are crucial for query performance but come with trade-offs for write operations...",
                            "publicationTime": "2025-12-01T09:00:00Z",
                            "_links": {
                                "self": { "href": "/api/blog-posts/a1b2c3d4-e5f6-7890-abcd-ef1234567890" },
                                "patch": { "href": "/api/blog-posts/a1b2c3d4-e5f6-7890-abcd-ef1234567890" },
                                "delete": { "href": "/api/blog-posts/a1b2c3d4-e5f6-7890-abcd-ef1234567890" }
                            }
                        }
                        """,
                        compareMode = STRICT
                    )
                }
            }
        }
    }

    @Nested
    inner class PatchBlogPost {

        @Test
        fun `PATCH on a blog post as a user returns 403`() {
            mockMvc.patch("/api/blog-posts/{uid}", blogPostUid1) {
                with(jwtWithUserRole())
                contentType = APPLICATION_JSON
                content = jsonValue("""{ "title": "Updated Title" }""")
            }.andExpect {
                status { isForbidden() }
            }
        }

        @Test
        fun `PATCH on a blog post as an author returns 404 when not found`() {
            every { updateBlogPost(any(), blogPostUid1, any()) } returns null

            mockMvc.patch("/api/blog-posts/{uid}", blogPostUid1) {
                with(jwtWithAuthorRole())
                contentType = APPLICATION_JSON
                content = jsonValue("""{ "title": "Updated Title" }""")
            }.andExpect {
                status { isNotFound() }
            }
        }

        @Test
        fun `PATCH on a blog post as an author returns 200 with updated blog post representation when found`() {
            val updatedBlogPost = blogPost1.copy(
                data = blogPostData1.copy(title = "Updated Title")
            )
            every { updateBlogPost(any(), blogPostUid1, any()) } returns updatedBlogPost

            mockMvc.patch("/api/blog-posts/{uid}", blogPostUid1) {
                with(jwtWithAuthorRole())
                contentType = APPLICATION_JSON
                content = jsonValue("""{ "title": "Updated Title" }""")
            }.andExpect {
                status { isOk() }
                content {
                    contentType(HAL_JSON)
                    json(
                        """
                        {
                            "uid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                            "title": "Updated Title",
                            "summary": "How to optimize your PostgreSQL queries with proper indexing",
                            "content": "Indexes are crucial for query performance but come with trade-offs for write operations...",
                            "publicationTime": "2025-12-01T09:00:00Z",
                            "_links": {
                                "self": { "href": "/api/blog-posts/a1b2c3d4-e5f6-7890-abcd-ef1234567890" },
                                "patch": { "href": "/api/blog-posts/a1b2c3d4-e5f6-7890-abcd-ef1234567890" },
                                "delete": { "href": "/api/blog-posts/a1b2c3d4-e5f6-7890-abcd-ef1234567890" }
                            }
                        }
                        """,
                        compareMode = STRICT
                    )
                }
            }
        }
    }

    @Nested
    inner class DeleteBlogPost {

        @Test
        fun `DELETE on a blog post as a user returns 403`() {
            mockMvc.delete("/api/blog-posts/{uid}", blogPostUid1) {
                with(jwtWithUserRole())
            }.andExpect {
                status { isForbidden() }
            }
        }

        @Test
        fun `DELETE on a blog post as an author returns 204`() {
            every { deleteBlogPost(any(), blogPostUid1) } just runs

            mockMvc.delete("/api/blog-posts/{uid}", blogPostUid1) {
                with(jwtWithAuthorRole())
            }.andExpect {
                status { isNoContent() }
            }

            verify { deleteBlogPost(any(), blogPostUid1) }
        }
    }

    @Nested
    inner class GetBlogPost {

        @Test
        fun `GET on a blog post as a user returns 404 when not found`() {
            every { getBlogPost(any(), blogPostUid1) } returns null

            mockMvc.get("/api/blog-posts/{uid}", blogPostUid1) {
                with(jwtWithUserRole())
            }.andExpect {
                status { isNotFound() }
            }
        }

        @Test
        fun `GET on a blog post as a user returns 200 with blog post representation when found`() {
            every { getBlogPost(any(), blogPostUid1) } returns blogPost1

            mockMvc.get("/api/blog-posts/{uid}", blogPostUid1) {
                with(jwtWithUserRole())
            }.andExpect {
                status { isOk() }
                content {
                    contentType(HAL_JSON)
                    json(
                        """
                        {
                            "uid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                            "title": "Database Indexing Best Practices",
                            "summary": "How to optimize your PostgreSQL queries with proper indexing",
                            "content": "Indexes are crucial for query performance but come with trade-offs for write operations...",
                            "publicationTime": "2025-12-01T09:00:00Z",
                            "_links": {
                                "self": { "href": "/api/blog-posts/a1b2c3d4-e5f6-7890-abcd-ef1234567890" }
                            }
                        }
                        """,
                        compareMode = STRICT
                    )
                }
            }
        }

        @Test
        fun `GET on a blog post as an author returns 200 with extra links`() {
            every { getBlogPost(any(), blogPostUid1) } returns blogPost1

            mockMvc.get("/api/blog-posts/{uid}", blogPostUid1) {
                with(jwtWithAuthorRole())
            }.andExpect {
                status { isOk() }
                content {
                    contentType(HAL_JSON)
                    json(
                        """
                        {
                            "uid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                            "_links": {
                                "self": { "href": "/api/blog-posts/a1b2c3d4-e5f6-7890-abcd-ef1234567890" },
                                "patch": { "href": "/api/blog-posts/a1b2c3d4-e5f6-7890-abcd-ef1234567890" },
                                "delete": { "href": "/api/blog-posts/a1b2c3d4-e5f6-7890-abcd-ef1234567890" }
                            }
                        }
                        """,
                        compareMode = LENIENT
                    )
                }
            }
        }
    }

    @Nested
    inner class GetBlogPostsPage {

        private val pagedResult = PagedResult(
            content = listOf(blogPost1, blogPost2),
            page = PagedResult.Page(
                number = 1,
                size = 25,
                totalElements = 2,
                totalPages = 1,
            )
        )

        @Test
        fun `GET on blog posts as a user returns 200 with paged blog post representations`() {
            every { getBlogPosts(any(), PageQuery(1, 25)) } returns pagedResult

            mockMvc.get("/api/blog-posts") {
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
                                        "uid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                                        "title": "Database Indexing Best Practices",
                                        "summary": "How to optimize your PostgreSQL queries with proper indexing",
                                        "publicationTime": "2025-12-01T09:00:00Z",
                                        "_links": {
                                            "self": { "href": "/api/blog-posts/a1b2c3d4-e5f6-7890-abcd-ef1234567890" }
                                        }
                                    },
                                    {
                                        "uid": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
                                        "title": "Getting Started with Kotlin Coroutines",
                                        "summary": "A beginner's guide to asynchronous programming in Kotlin",
                                        "publicationTime": "2024-03-15T10:00:00Z",
                                        "_links": {
                                            "self": { "href": "/api/blog-posts/b2c3d4e5-f6a7-8901-bcde-f12345678901" }
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
                        """,
                        compareMode = STRICT
                    )
                }
            }
        }

        @Test
        fun `GET on blog posts as a user returns 200 with paged blog post representations with extra links`() {
            every { getBlogPosts(any(), PageQuery(1, 25)) } returns pagedResult

            mockMvc.get("/api/blog-posts") {
                with(jwtWithAuthorRole())
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
                                        "uid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                                        "_links": {
                                            "self": { "href": "/api/blog-posts/a1b2c3d4-e5f6-7890-abcd-ef1234567890" },
                                            "patch": { "href": "/api/blog-posts/a1b2c3d4-e5f6-7890-abcd-ef1234567890" },
                                            "delete": { "href": "/api/blog-posts/a1b2c3d4-e5f6-7890-abcd-ef1234567890" }
                                        }
                                    },
                                    {
                                        "uid": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
                                        "_links": {
                                            "self": { "href": "/api/blog-posts/b2c3d4e5-f6a7-8901-bcde-f12345678901" },
                                            "patch": { "href": "/api/blog-posts/b2c3d4e5-f6a7-8901-bcde-f12345678901" },
                                            "delete": { "href": "/api/blog-posts/b2c3d4e5-f6a7-8901-bcde-f12345678901" }
                                        }
                                    }
                                ]
                            }
                        }
                        """,
                        compareMode = LENIENT
                    )
                }
            }
        }
    }
}
