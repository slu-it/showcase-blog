package application.business.model

data class PagedResult<T>(
    val content: List<T>,
    val page: Page,
) {
    data class Page(
        val number: Int,
        val size: Int,
        val totalElements: Long,
        val totalPages: Long,
    )
}
