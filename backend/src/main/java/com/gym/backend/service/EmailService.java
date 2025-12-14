package com.gym.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Service class for email operations
 */
@Slf4j
@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Value("${app.backend.url:http://localhost:8080/api}")
    private String backendUrl;

    /**
     * Send verification email
     */
    public void sendVerificationEmail(String toEmail, String token) {
        try {
            log.info("Sending verification email to: {}", toEmail);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Verify Your Email - Gym Management System");
            
            String verificationLink = backendUrl + "/auth/verify-email?token=" + token;
            String emailBody = buildVerificationEmailBody(toEmail, verificationLink);
            
            message.setText(emailBody);
            mailSender.send(message);
            
            log.info("Verification email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send verification email to: {}", toEmail, e);
            // Don't throw exception to avoid breaking the registration flow
        }
    }

    /**
     * Send password reset email
     */
    public void sendPasswordResetEmail(String toEmail, String token) {
        try {
            log.info("Sending password reset email to: {}", toEmail);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Password Reset - Gym Management System");
            
            String resetLink = frontendUrl + "/reset-password?token=" + token;
            String emailBody = buildPasswordResetEmailBody(toEmail, resetLink);
            
            message.setText(emailBody);
            mailSender.send(message);
            
            log.info("Password reset email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send password reset email to: {}", toEmail, e);
            // Don't throw exception to avoid breaking the password reset flow
        }
    }

    /**
     * Build verification email body
     */
    private String buildVerificationEmailBody(String email, String verificationLink) {
        return String.format(
            "Dear %s,\n\n" +
            "Welcome to the Gym Management System!\n\n" +
            "Please click the link below to verify your email address:\n" +
            "%s\n\n" +
            "This link will expire in 24 hours.\n\n" +
            "If you did not create an account, please ignore this email.\n\n" +
            "Best regards,\n" +
            "Gym Management System Team",
            email, verificationLink
        );
    }

    /**
     * Build password reset email body
     */
    private String buildPasswordResetEmailBody(String email, String resetLink) {
        return String.format(
            "Dear %s,\n\n" +
            "You have requested to reset your password for the Gym Management System.\n\n" +
            "Please click the link below to reset your password:\n" +
            "%s\n\n" +
            "This link will expire in 24 hours.\n\n" +
            "If you did not request a password reset, please ignore this email.\n\n" +
            "Best regards,\n" +
            "Gym Management System Team",
            email, resetLink
        );
    }
}