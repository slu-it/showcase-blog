package application.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.convert.converter.Converter
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.invoke
import org.springframework.security.config.http.SessionCreationPolicy.STATELESS
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.security.web.SecurityFilterChain

@Configuration
@EnableWebSecurity
class SecurityConfiguration {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http {
            cors { disable() }
            csrf { disable() }
            authorizeHttpRequests {
                authorize("/api/**", hasRole("USER"))
                authorize("/error", permitAll)
                authorize(anyRequest, denyAll)
            }
            oauth2ResourceServer {
                jwt {
                    jwtAuthenticationConverter = CustomJwtAuthenticationConverter
                }
            }
            sessionManagement {
                sessionCreationPolicy = STATELESS
            }
        }
        return http.build()
    }
}

object CustomJwtAuthenticationConverter : Converter<Jwt, JwtAuthenticationToken> {
    override fun convert(source: Jwt): JwtAuthenticationToken {
        val authorities = source.getClaimAsStringList("authorities") ?: emptyList()

        val grantedAuthorities = authorities
            .map(::SimpleGrantedAuthority)
            .toSet()

        return JwtAuthenticationToken(source, grantedAuthorities)
    }
}
