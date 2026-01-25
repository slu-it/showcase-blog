package application.api

import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class HelloController {

    @GetMapping("/hello")
    fun sayHello(authentication: JwtAuthenticationToken): HelloResponse {
        val user = authentication.name
        return HelloResponse("Hello $user!")
    }

    @PostMapping("/hello")
    fun sayHello(@RequestBody request: HelloRequest, authentication: JwtAuthenticationToken): HelloResponse {
        val user = authentication.name
        return HelloResponse("Hello ${request.name}, from user: $user")
    }

    data class HelloRequest(val name: String)
    data class HelloResponse(val message: String)
}
