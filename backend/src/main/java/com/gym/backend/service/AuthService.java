package com.gym.backend.service;

import com.gym.backend.dto.auth.*;
import com.gym.backend.entity.*;
import com.gym.backend.entity.enums.RoleType;
import com.gym.backend.repository.*;
import com.gym.backend.security.JwtTokenProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service class for authentication operations
 */
@Slf4j
@Service
@Transactional
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private EmailVerificationTokenRepository emailVerificationTokenRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private EmailService emailService;

    @Value("${app.email.verification-required:true}")
    private boolean emailVerificationRequired;

    /**
     * Register a new user
     */
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering new user with email: {}", request.getEmail());

        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User with email already exists: " + request.getEmail());
        }

        // Create new user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setIsActive(true);
        user.setIsEmailVerified(!emailVerificationRequired);

        // Assign default role (MEMBER)
        Role memberRole = roleRepository.findByName(RoleType.MEMBER)
                .orElseGet(() -> createDefaultRole(RoleType.MEMBER));
        user.getRoles().add(memberRole);

        // Save user
        User savedUser = userRepository.save(user);

        // Send email verification if required
        if (emailVerificationRequired) {
            sendEmailVerification(savedUser);
        }

        log.info("Successfully registered user with ID: {}", savedUser.getId());
        
        // Generate tokens and return response
        return generateAuthResponse(savedUser);
    }

    /**
     * Authenticate user and generate tokens
     */
    public AuthResponse login(LoginRequest request) {
        log.info("Authenticating user: {}", request.getEmail());

        // Find user
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // Check if user is active
        if (!user.isActive()) {
            throw new RuntimeException("User account is disabled");
        }

        // Check if email is verified if verification is required
        if (emailVerificationRequired && !user.isEmailVerified()) {
            throw new RuntimeException("Email not verified. Please verify your email before logging in.");
        }

        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // Update last login time
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        log.info("Successfully authenticated user: {}", request.getEmail());

        // Generate tokens and return response
        return generateAuthResponse(user);
    }

    /**
     * Refresh access token using refresh token
     */
    public AuthResponse refreshToken(String refreshToken) {
        log.debug("Refreshing access token");

        // Validate refresh token
        if (!jwtTokenProvider.validateToken(refreshToken) || !jwtTokenProvider.isRefreshToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        // Extract username from refresh token
        String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
        
        // Load user details
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user is active
        if (!user.isActive()) {
            throw new RuntimeException("User account is disabled");
        }

        log.info("Successfully refreshed token for user: {}", username);

        // Generate new access token
        return generateAuthResponse(user);
    }

    /**
     * Request password reset
     */
    public void requestPasswordReset(PasswordResetRequest request) {
        log.info("Password reset requested for email: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + request.getEmail()));

        // Generate reset token
        String resetToken = UUID.randomUUID().toString();
        LocalDateTime expiresAt = LocalDateTime.now().plusHours(24);

        // Create password reset token entity
        PasswordResetToken passwordResetToken = new PasswordResetToken();
        passwordResetToken.setUser(user);
        passwordResetToken.setToken(resetToken);
        passwordResetToken.setExpiresAt(expiresAt);
        passwordResetToken.setStatus(com.gym.backend.entity.enums.PasswordResetStatus.PENDING);

        // Save token
        passwordResetTokenRepository.save(passwordResetToken);

        // Send email
        emailService.sendPasswordResetEmail(user.getEmail(), resetToken);

        log.info("Password reset token created for user ID: {}", user.getId());
    }

    /**
     * Confirm password reset
     */
    public void confirmPasswordReset(PasswordResetConfirmRequest request) {
        log.debug("Confirming password reset with token: {}", request.getToken());

        // Find token
        PasswordResetToken tokenEntity = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid or expired token"));

        // Check if token is valid
        if (tokenEntity.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token has expired");
        }

        if (tokenEntity.getStatus() == com.gym.backend.entity.enums.PasswordResetStatus.USED) {
            throw new RuntimeException("Token has already been used");
        }

        // Update user password
        User user = tokenEntity.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Mark token as used
        tokenEntity.setStatus(com.gym.backend.entity.enums.PasswordResetStatus.USED);
        tokenEntity.setUsedAt(LocalDateTime.now());
        passwordResetTokenRepository.save(tokenEntity);

        log.info("Password successfully reset for user ID: {}", user.getId());
    }

    /**
     * Verify email
     */
    public void verifyEmail(String token) {
        log.debug("Verifying email with token: {}", token);

        // Find token
        EmailVerificationToken verificationToken = emailVerificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired token"));

        // Check if token is valid
        if (verificationToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token has expired");
        }

        // Update user email verification status
        User user = verificationToken.getUser();
        user.setIsEmailVerified(true);
        userRepository.save(user);

        log.info("Email successfully verified for user ID: {}", user.getId());
    }

    /**
     * Generate authentication response with tokens
     */
    private AuthResponse generateAuthResponse(User user) {
        // Generate tokens
        String accessToken = jwtTokenProvider.generateAccessToken(user.getEmail());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());

        // Create user info
        AuthResponse.UserInfo userInfo = AuthResponse.UserInfo.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .isActive(user.isActive())
                .isEmailVerified(user.isEmailVerified())
                .roles(user.getRoles().stream()
                        .map(Role::getName)
                        .collect(Collectors.toSet()))
                .lastLoginAt(user.getLastLoginAt())
                .createdAt(user.getCreatedAt())
                .build();

        // Create response
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(jwtTokenProvider.getExpirationTime() / 1000)
                .user(userInfo)
                .build();
    }

    /**
     * Send email verification
     */
    private void sendEmailVerification(User user) {
        String verificationToken = UUID.randomUUID().toString();
        LocalDateTime expiresAt = LocalDateTime.now().plusHours(24);

        // Create verification token entity
        EmailVerificationToken emailVerificationToken = new EmailVerificationToken();
        emailVerificationToken.setUser(user);
        emailVerificationToken.setToken(verificationToken);
        emailVerificationToken.setExpiresAt(expiresAt);
        emailVerificationToken.setStatus(com.gym.backend.entity.enums.EmailVerificationStatus.PENDING);

        // Save token
        emailVerificationTokenRepository.save(emailVerificationToken);

        // Send email
        emailService.sendVerificationEmail(user.getEmail(), verificationToken);

        log.debug("Email verification token created for user ID: {}", user.getId());
    }

    /**
     * Create default role if not exists
     */
    private Role createDefaultRole(RoleType roleType) {
        Role role = new Role();
        role.setName(roleType);
        role.setDescription(roleType.name() + " role");
        return roleRepository.save(role);
    }
}