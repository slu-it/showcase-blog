package application.config

import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.Authentication
import java.lang.annotation.Inherited
import kotlin.annotation.AnnotationTarget.CLASS
import kotlin.annotation.AnnotationTarget.FUNCTION

@Retention
@Inherited
@Target(FUNCTION, CLASS)
@PreAuthorize("hasRole('USER')")
annotation class NeedsUserRole

@Retention
@Inherited
@Target(FUNCTION, CLASS)
@PreAuthorize("hasRole('AUTHOR')")
annotation class NeedsAuthorRole

@Retention
@Inherited
@Target(FUNCTION, CLASS)
@PreAuthorize("hasRole('ADMIN')")
annotation class NeedsAdminRole

fun isUser(auth: Authentication) = auth.hasRole("USER")
fun isAuthor(auth: Authentication) = auth.hasRole("AUTHOR")
fun isAdmin(auth: Authentication) = auth.hasRole("ADMIN")

private fun Authentication.hasRole(role: String): Boolean =
    authorities.any { it.authority == "ROLE_$role" }
