package application.api

import application.business.MutableBlogPost
import application.business.MutableBlogPostData
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.matchers.shouldBe
import io.kotest.matchers.throwable.shouldHaveMessage
import io.mockk.mockk
import org.intellij.lang.annotations.Language
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.TestInstance.Lifecycle.PER_METHOD
import tools.jackson.databind.JsonNode
import tools.jackson.module.kotlin.jacksonObjectMapper
import java.time.Instant
import java.time.format.DateTimeParseException

@TestInstance(PER_METHOD)
class PatchTests {

    private val objectMapper = jacksonObjectMapper()
    private val baseData = MutableBlogPost(
        uid = mockk(), // irrelevant
        metadata = mockk(), // irrelevant
        data = MutableBlogPostData(
            title = "old title",
            summary = "old summary",
            content = "old content",
            publicationTime = Instant.parse("2026-01-29T12:34:56.789Z")
        ),
    )

    @Test
    fun `can change all values title`() {
        val patch = patchData(
            """
            {
              "title": "new title",
              "summary": "new summary",
              "content": "new content",
              "publicationTime": "2026-01-29T13:35:59.789Z"
            }
            """
        )
        patch(baseData, patch)

        with(baseData.data) {
            title shouldBe "new title"
            summary shouldBe "new summary"
            content shouldBe "new content"
            publicationTime shouldBe Instant.parse("2026-01-29T13:35:59.789Z")
        }
    }

    @Test
    fun `can change some fields to null resulting in empty values`() {
        val patch = patchData(
            """
            {
              "summary": null,
              "content": null
            }
            """
        )
        patch(baseData, patch)

        with(baseData.data) {
            title shouldBe "old title"
            summary shouldBe ""
            content shouldBe ""
            publicationTime shouldBe Instant.parse("2026-01-29T12:34:56.789Z")
        }
    }

    @Test
    fun `can change some fields to empty resulting in empty values`() {
        val patch = patchData(
            """
            {
              "summary": "",
              "content": ""
            }
            """
        )
        patch(baseData, patch)

        with(baseData.data) {
            title shouldBe "old title"
            summary shouldBe ""
            content shouldBe ""
            publicationTime shouldBe Instant.parse("2026-01-29T12:34:56.789Z")
        }
    }

    @Test
    fun `cannot change title to null`() {
        val patch = patchData("""{ "title": null }""")
        val ex = shouldThrow<IllegalStateException> {
            patch(baseData, patch)
        }
        ex.shouldHaveMessage("Can't remove 'title' from blog post!")
    }

    @Test
    fun `cannot change title to empty`() {
        val patch = patchData("""{ "title": "" }""")
        val ex = shouldThrow<IllegalStateException> {
            patch(baseData, patch)
        }
        ex.shouldHaveMessage("Can't remove 'title' from blog post!")
    }

    @Test
    fun `cannot change title to blank`() {
        val patch = patchData("""{ "title": " " }""")
        val ex = shouldThrow<IllegalStateException> {
            patch(baseData, patch)
        }
        ex.shouldHaveMessage("Can't remove 'title' from blog post!")
    }

    @Test
    fun `cannot change publicationTime to null`() {
        val patch = patchData("""{ "publicationTime": null }""")
        val ex = shouldThrow<IllegalStateException> {
            patch(baseData, patch)
        }
        ex.shouldHaveMessage("Can't remove 'publicationTime' from blog post!")
    }

    @Test
    fun `cannot change publicationTime to empty`() {
        val patch = patchData("""{ "publicationTime": "" }""")
        val ex = shouldThrow<IllegalStateException> {
            patch(baseData, patch)
        }
        ex.shouldHaveMessage("Can't remove 'publicationTime' from blog post!")
    }

    @Test
    fun `cannot change publicationTime to blank`() {
        val patch = patchData("""{ "publicationTime": " " }""")
        val ex = shouldThrow<IllegalStateException> {
            patch(baseData, patch)
        }
        ex.shouldHaveMessage("Can't remove 'publicationTime' from blog post!")
    }

    @Test
    fun `cannot change publicationTime to non-timestamp`() {
        val patch = patchData("""{ "publicationTime": "this-is-not-a-timestamp" }""")
        shouldThrow<DateTimeParseException> {
            patch(baseData, patch)
        }
    }

    private fun patchData(@Language("json") value: String): JsonNode =
        objectMapper.readTree((value))
}
