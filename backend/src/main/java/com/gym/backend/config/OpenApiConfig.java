package com.gym.backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * OpenAPI 3 configuration for API documentation
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI gymApi() {
        return new OpenAPI()
                .info(apiInfo())
                .servers(List.of(
                        new Server().url("http://localhost:8080/api").description("Development server"),
                        new Server().url("https://api.gym.com").description("Production server")
                ))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new Components()
                        .addSecuritySchemes("Bearer Authentication",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .name("Authorization")
                                        .description("JWT Authorization header using the Bearer scheme")));
    }

    private Info apiInfo() {
        return new Info()
                .title("Gym Management System API")
                .description("REST API for Gym Management System with JWT authentication")
                .version("1.0.0")
                .contact(new Contact()
                        .name("Gym Development Team")
                        .email("dev@gym.com")
                        .url("https://github.com/gym/backend"))
                .license(new License()
                        .name("Apache 2.0")
                        .url("http://springdoc.org"));
    }
}