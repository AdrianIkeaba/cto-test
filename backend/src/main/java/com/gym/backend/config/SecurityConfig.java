package com.gym.backend.config;

import com.gym.backend.security.CustomUserDetailsService;
import com.gym.backend.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * Spring Security configuration
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource;

    /**
     * Password encoder bean
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Authentication provider
     */
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    /**
     * Authentication manager
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Security filter chain
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                // Public endpoints
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/auth/register").permitAll()
                .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/auth/refresh").permitAll()
                .requestMatchers(HttpMethod.POST, "/auth/password-reset").permitAll()
                .requestMatchers(HttpMethod.POST, "/auth/password-reset-confirm").permitAll()
                .requestMatchers(HttpMethod.GET, "/auth/verify-email").permitAll()
                .requestMatchers(HttpMethod.GET, "/actuator/health").permitAll()
                .requestMatchers(HttpMethod.GET, "/actuator/info").permitAll()
                .requestMatchers(HttpMethod.GET, "/health").permitAll()

                // API Documentation
                .requestMatchers("/v3/api-docs/**").permitAll()
                .requestMatchers("/swagger-ui/**").permitAll()
                .requestMatchers("/swagger-ui.html").permitAll()

                // Static resources
                .requestMatchers(HttpMethod.GET, "/", "/error").permitAll()
                .requestMatchers(HttpMethod.GET, "/favicon.ico").permitAll()

                // Admin endpoints - require ADMIN role
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/users/**").hasAnyRole("ADMIN", "STAFF")
                .requestMatchers(HttpMethod.PUT, "/users/**").hasAnyRole("ADMIN", "STAFF")
                .requestMatchers(HttpMethod.DELETE, "/users/**").hasRole("ADMIN")

                // Trainer endpoints - require TRAINER or ADMIN role
                .requestMatchers("/trainer/**").hasAnyRole("TRAINER", "ADMIN")

                // Member endpoints - require MEMBER role or above
                .requestMatchers("/member/**").hasAnyRole("MEMBER", "TRAINER", "STAFF", "ADMIN")

                // All other requests require authentication
                .anyRequest().authenticated()
            );

        // Add JWT filter
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // CORS configuration is now provided by CorsConfig class
}
