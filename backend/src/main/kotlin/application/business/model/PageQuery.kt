package application.business.model

@Suppress("MagicNumber")
data class PageQuery(
    val number: Int, // first page = 1
    val size: Int,
) {
    init {
        require(number > 0) { "number must be greater than 0, but was $number" }
        require(size > 0) { "size must be greater than 0, but was $size" }
        require(size <= 100) { "size must be less then or equal to 100, but was $size" }
    }
}
