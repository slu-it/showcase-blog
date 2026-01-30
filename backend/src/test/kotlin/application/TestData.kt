package application

import application.business.BlogPostData
import application.business.BlogPostMetadata
import application.business.User
import java.time.Instant

object TestData {

    // CurrentUser

    val defaultUser = user("defaultUser")
    val differentUser = user("differentUser")

    fun user(uid: String, isUser: Boolean = true, isAuthor: Boolean = false, isAdmin: Boolean = false) =
        User(uid = uid, isUser = isUser, isAuthor = isAuthor, isAdmin = isAdmin)

    // BlogPostData

    val blogPostData1 = BlogPostData(
        title = "Database Indexing Best Practices",
        summary = "How to optimize your PostgreSQL queries with proper indexing",
        content = "Indexes are crucial for query performance but come with trade-offs for write operations...",
        publicationTime = Instant.parse("2025-12-01T09:00:00Z"),
    )
    val blogPostData2 = BlogPostData(
        title = "Getting Started with Kotlin Coroutines",
        summary = "A beginner's guide to asynchronous programming in Kotlin",
        content = "Coroutines are a powerful feature in Kotlin that simplify asynchronous programming...",
        publicationTime = Instant.parse("2024-03-15T10:00:00Z"),
    )

    // BlogPostMetadata

    val blogPostMetadata1 = BlogPostMetadata(
        createdAt = Instant.parse("2025-11-28T14:55:00Z"),
        createdBy = "defaultUser",
        lastUpdatedAt = Instant.parse("2025-11-28T14:55:00Z"),
        lastUpdatedBy = "defaultUser",
    )
    val blogPostMetadata2 = BlogPostMetadata(
        createdAt = Instant.parse("2025-11-28T14:55:00Z"),
        createdBy = "defaultUser",
        lastUpdatedAt = Instant.parse("2025-12-01T08:55:00Z"),
        lastUpdatedBy = "differentUser",
    )
}
