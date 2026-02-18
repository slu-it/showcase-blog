package application.api

import application.TestData.defaultUser
import application.business.model.DEFAULT_PAGE_NUMBER
import application.business.model.DEFAULT_PAGE_SIZE
import application.config.CustomJwtGrantedAuthoritiesConverter
import org.intellij.lang.annotations.Language
import org.springframework.restdocs.hypermedia.HypermediaDocumentation.linkWithRel
import org.springframework.restdocs.hypermedia.HypermediaDocumentation.links
import org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath
import org.springframework.restdocs.payload.PayloadDocumentation.requestFields
import org.springframework.restdocs.payload.PayloadDocumentation.responseFields
import org.springframework.restdocs.payload.PayloadDocumentation.subsectionWithPath
import org.springframework.restdocs.request.RequestDocumentation.parameterWithName
import org.springframework.restdocs.request.RequestDocumentation.pathParameters
import org.springframework.restdocs.request.RequestDocumentation.queryParameters
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt

fun jsonValue(@Language("json") value: String): String =
    value.trimIndent()

fun jwtWithUserRole() = jwtWithRoles("USER")
fun jwtWithAuthorRole() = jwtWithRoles("USER", "AUTHOR")
fun jwtWithAdminRole() = jwtWithRoles("USER", "AUTHOR", "ADMIN")

fun jwtWithRoles(vararg roles: String) = jwt()
    .authorities(CustomJwtGrantedAuthoritiesConverter)
    .jwt { jwt ->
        jwt.subject(defaultUser.uid)
        jwt.claim("authorities", roles.map { "ROLE_$it" })
    }

// REST Docs - Field Descriptors

fun uidField() = fieldWithPath("uid")
    .type("UUID")
    .description("The unique identifier of the blog post")

fun titleField() = fieldWithPath("title")
    .type("String")
    .description("The title of the blog post")

fun summaryField() = fieldWithPath("summary")
    .type("String")
    .description("A brief summary of the blog post")

fun contentField() = fieldWithPath("content")
    .type("String (Markdown)")
    .description("The full content of the blog post as Markdown")

fun publicationTimeField() = fieldWithPath("publicationTime")
    .type("ISO-8601 DateTime (UTC)")
    .description("The publication date and time")

fun embeddedSubsection() = subsectionWithPath("_embedded")
    .description("Embedded resources containing blog post representations")

fun pageSizeField() = fieldWithPath("page.size")
    .type("Integer")
    .description("The page size")
fun pageNumberField() = fieldWithPath("page.number")
    .type("Integer")
    .description("The current page number")
fun totalElementsField() = fieldWithPath("page.totalElements")
    .type("Long")
    .description("The total number of blog posts")
fun totalPagesField() = fieldWithPath("page.totalPages")
    .type("Long")
    .description("The total number of pages")

// REST Docs - Parameter Descriptors

fun uidParameter() = parameterWithName("uid")
    .description("The unique identifier of the blog post")
fun pageNumberParameter() = parameterWithName("pageNumber")
    .description("The page number (1-based), defaults to $DEFAULT_PAGE_NUMBER.")
fun pageSizeParameter() = parameterWithName("pageSize")
    .description("The number of items per page, defaults to $DEFAULT_PAGE_SIZE.")

// REST Docs - Link Descriptors

fun selfLink() = linkWithRel("self")
    .description("Link to this blog post")
fun patchLink() = linkWithRel("patch")
    .description("Link to update this blog post")
fun deleteLink() = linkWithRel("delete")
    .description("Link to delete this blog post")

// REST Docs - Snippet Composites

fun blogPostResponseFields() = responseFields(
    uidField(),
    titleField(),
    summaryField(),
    contentField(),
    publicationTimeField(),
    subsectionWithPath("_links").ignored()
)

fun blogPostCreationRequestFields() = requestFields(
    titleField(),
    summaryField().optional(),
    contentField().optional(),
    publicationTimeField().optional()
)

fun blogPostUpdateRequestFields() = requestFields(
    titleField().optional(),
    summaryField().optional(),
    contentField().optional(),
    publicationTimeField().optional()
)

fun blogPostUidPathParameters() = pathParameters(uidParameter())

fun blogPostPageQueryParameters() = queryParameters(pageNumberParameter(), pageSizeParameter())

fun authorLinks() = links(selfLink(), patchLink(), deleteLink())

fun userLinks() = links(selfLink())

fun pagedBlogPostResponseFields() = responseFields(
    embeddedSubsection(),
    pageSizeField(),
    totalElementsField(),
    totalPagesField(),
    pageNumberField()
)
