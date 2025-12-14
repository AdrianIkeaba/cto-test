package com.gym.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

/**
 * CORS configuration for cross-origin requests
 */
@Configuration
public class CorsConfig {

    private final CorsProperties corsProperties;

    public CorsConfig(CorsProperties corsProperties) {
        this.corsProperties = corsProperties;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Set allowed origins
        if (corsProperties.getAllowedOrigins() != null) {
            configuration.setAllowedOrigins(corsProperties.getAllowedOrigins());
        }
        
        // Set allowed methods
        if (corsProperties.getAllowedMethods() != null) {
            configuration.setAllowedMethods(corsProperties.getAllowedMethods());
        }
        
        // Set allowed headers
        if (corsProperties.getAllowedHeaders() != null) {
            configuration.setAllowedHeaders(corsProperties.getAllowedHeaders());
        }
        
        // Set exposed headers
        if (corsProperties.getExposedHeaders() != null) {
            configuration.setExposedHeaders(corsProperties.getExposedHeaders());
        }
        
        // Set allow credentials
        configuration.setAllowCredentials(corsProperties.isAllowCredentials());
        
        // Set max age
        configuration.setMaxAge(corsProperties.getMaxAge());
        
        // Allow credentials for all origins when configured
        if (corsProperties.isAllowCredentials()) {
            configuration.setAllowedOrigins(Arrays.asList("*"));
        }

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }

    @Bean
    public CorsFilter corsFilter() {
        return new CorsFilter(corsConfigurationSource());
    }
}