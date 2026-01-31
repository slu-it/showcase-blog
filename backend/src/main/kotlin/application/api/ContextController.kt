package application.api

import application.config.NeedsUserRole
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/context")
class ContextController {

    @NeedsUserRole
    @GetMapping
    fun get(auth: JwtAuthenticationToken): Context {
        return context(user(auth))
    }
}
