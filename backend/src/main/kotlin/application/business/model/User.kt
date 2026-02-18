package application.business.model

data class User(
    val uid: String,
    val isUser: Boolean,
    val isAuthor: Boolean,
    val isAdmin: Boolean,
)
