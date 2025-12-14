package com.gym.backend.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gym.backend.GymBackendApplication;
import com.gym.backend.dto.auth.*;
import com.gym.backend.entity.Role;
import com.gym.backend.entity.User;
import com.gym.backend.entity.enums.RoleType;
import com.gym.backend.repository.RoleRepository;
import com.gym.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.Set;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

/**
 * Integration tests for authentication endpoints
 */
@SpringBootTest(classes = GymBackendApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Testcontainers
@Transactional
public class AuthControllerIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    private User testUser;
    private String testPassword = "TestPassword123!";

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        roleRepository.deleteAll();

        // Create default roles
        Role memberRole = new Role();
        memberRole.setName(RoleType.MEMBER);
        roleRepository.save(memberRole);

        Role adminRole = new Role();
        adminRole.setName(RoleType.ADMIN);
        roleRepository.save(adminRole);

        // Create test user
        testUser = new User();
        testUser.setEmail("test@example.com");
        testUser.setPassword("$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi"); // TestPassword123!
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setIsActive(true);
        testUser.setIsEmailVerified(true);
        testUser.getRoles().add(memberRole);
        testUser = userRepository.save(testUser);
    }

    @Test
    void shouldRegisterNewUser() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("newuser@example.com");
        request.setPassword("NewPassword123!");
        request.setFirstName("New");
        request.setLastName("User");
        request.setPhoneNumber("+1234567890");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken", notNullValue()))
                .andExpect(jsonPath("$.refreshToken", notNullValue()))
                .andExpect(jsonPath("$.tokenType", is("Bearer")))
                .andExpect(jsonPath("$.user.email", is("newuser@example.com")))
                .andExpect(jsonPath("$.user.firstName", is("New")))
                .andExpect(jsonPath("$.user.lastName", is("User")))
                .andExpect(jsonPath("$.user.roles", hasItem("MEMBER")));
    }

    @Test
    void shouldNotRegisterUserWithExistingEmail() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com"); // Existing email
        request.setPassword("NewPassword123!");
        request.setFirstName("New");
        request.setLastName("User");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().is5xxServerError());
    }

    @Test
    void shouldNotRegisterUserWithInvalidEmail() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("invalid-email");
        request.setPassword("NewPassword123!");
        request.setFirstName("New");
        request.setLastName("User");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldNotRegisterUserWithWeakPassword() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("newuser@example.com");
        request.setPassword("123");
        request.setFirstName("New");
        request.setLastName("User");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldLoginWithValidCredentials() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword(testPassword);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken", notNullValue()))
                .andExpect(jsonPath("$.refreshToken", notNullValue()))
                .andExpect(jsonPath("$.tokenType", is("Bearer")))
                .andExpect(jsonPath("$.user.email", is("test@example.com")))
                .andExpect(jsonPath("$.user.firstName", is("Test")))
                .andExpect(jsonPath("$.user.lastName", is("User")));
    }

    @Test
    void shouldNotLoginWithInvalidEmail() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("nonexistent@example.com");
        request.setPassword(testPassword);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().is5xxServerError());
    }

    @Test
    void shouldNotLoginWithInvalidPassword() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("WrongPassword");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldNotLoginWithInactiveUser() throws Exception {
        testUser.setIsActive(false);
        userRepository.save(testUser);

        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword(testPassword);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().is5xxServerError());
    }

    @Test
    void shouldRequestPasswordReset() throws Exception {
        PasswordResetRequest request = new PasswordResetRequest();
        request.setEmail("test@example.com");

        mockMvc.perform(post("/api/auth/password-reset")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void shouldRequestPasswordResetForNonExistentUser() throws Exception {
        PasswordResetRequest request = new PasswordResetRequest();
        request.setEmail("nonexistent@example.com");

        mockMvc.perform(post("/api/auth/password-reset")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().is5xxServerError());
    }

    @Test
    void shouldNotRequestPasswordResetWithInvalidEmail() throws Exception {
        PasswordResetRequest request = new PasswordResetRequest();
        request.setEmail("invalid-email");

        mockMvc.perform(post("/api/auth/password-reset")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturnErrorForMissingFields() throws Exception {
        // Test with empty JSON
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isBadRequest());
    }
}
