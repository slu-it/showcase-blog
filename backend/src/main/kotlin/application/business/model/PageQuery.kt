package application.business.model

const val DEFAULT_PAGE_NUMBER = 1
const val DEFAULT_PAGE_SIZE = 25
const val MAX_PAGE_SIZE = 100

data class PageQuery(
    val number: Int = DEFAULT_PAGE_NUMBER, // first page = 1
    val size: Int = DEFAULT_PAGE_SIZE,
) {
    init {
        require(number > 0) { "number must be greater than 0, but was $number" }
        require(size > 0) { "size must be greater than 0, but was $size" }
        require(size <= MAX_PAGE_SIZE) { "size must be less then or equal to 100, but was $size" }
    }
}
