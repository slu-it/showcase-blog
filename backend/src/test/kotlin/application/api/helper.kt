package application.api

import application.TestData.defaultUser
import application.config.CustomJwtGrantedAuthoritiesConverter
import org.intellij.lang.annotations.Language
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
