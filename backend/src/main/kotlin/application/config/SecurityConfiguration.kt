package application.config

import org.springframework.boot.security.autoconfigure.actuate.web.servlet.EndpointRequest.toAnyEndpoint
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.Ordered.HIGHEST_PRECEDENCE
import org.springframework.core.Ordered.LOWEST_PRECEDENCE
import org.springframework.core.annotation.Order
import org.springframework.core.convert.converter.Converter
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.invoke
import org.springframework.security.config.http.SessionCreationPolicy.STATELESS
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.security.web.SecurityFilterChain

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
class SecurityConfiguration {

    @Bean
    @Order(HIGHEST_PRECEDENCE)
    fun actuatorSecurityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http {
            securityMatcher(toAnyEndpoint())
            cors { disable() }
            csrf { disable() }
            authorizeHttpRequests {
                authorize(anyRequest, permitAll)
            }
            sessionManagement {
                sessionCreationPolicy = STATELESS
            }
        }
        return http.build()
    }

    @Bean
    @Order(LOWEST_PRECEDENCE)
    fun generalSecurityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http {
            cors { disable() }
            csrf { disable() }
            authorizeHttpRequests {
                authorize("/api/**", hasRole("USER"))
                authorize("/docs/**", hasRole("ADMIN"))
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
        return JwtAuthenticationToken(source, CustomJwtGrantedAuthoritiesConverter.convert(source))
    }
}

object CustomJwtGrantedAuthoritiesConverter : Converter<Jwt, Collection<GrantedAuthority>> {
    override fun convert(source: Jwt): Collection<GrantedAuthority> {
        val authorities = source.getClaimAsStringList("authorities")
            ?: emptyList()
        return authorities.map(::SimpleGrantedAuthority).toSet()
    }
}
