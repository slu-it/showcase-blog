package application.persistence

import application.business.BlogPost
import application.business.BlogPostData
import application.business.BlogPostMetadata
import org.springframework.jdbc.core.RowMapper
import java.sql.ResultSet
import java.util.UUID

object BlogPostMapper : RowMapper<BlogPost> {
    override fun mapRow(rs: ResultSet, rowNum: Int): BlogPost =
        BlogPost(
            uid = rs.getObject("uid") as UUID,
            data = BlogPostData(
                title = rs.getString("title"),
                summary = rs.getString("summary"),
                content = rs.getString("content"),
                publicationTime = rs.getTimestamp("publication_time").toInstant(),
            ),
            metadata = BlogPostMetadata(
                createdAt = rs.getTimestamp("created_at").toInstant(),
                createdBy = rs.getString("created_by"),
                lastUpdatedAt = rs.getTimestamp("last_updated_at").toInstant(),
                lastUpdatedBy = rs.getString("last_updated_by")
            )
        )
}
