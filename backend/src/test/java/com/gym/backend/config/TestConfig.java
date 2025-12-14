package com.gym.backend.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import java.io.InputStream;
import java.util.Properties;

/**
 * Test configuration for authentication tests
 */
@TestConfiguration
@Profile("test")
public class TestConfig {

    @Bean
    @Primary
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    @Primary
    public JavaMailSender javaMailSender() {
        return new TestJavaMailSender();
    }

    /**
     * Mock JavaMailSender for testing
     */
    private static class TestJavaMailSender implements JavaMailSender {

        @Override
        public MimeMessage createMimeMessage() {
            return new MimeMessage(Session.getDefaultInstance(new Properties()));
        }

        @Override
        public MimeMessage createMimeMessage(InputStream inputStream) throws MailException {
            return createMimeMessage();
        }

        @Override
        public void send(MimeMessage mimeMessage) throws MailException {
            // Mock implementation - do nothing
        }

        @Override
        public void send(MimeMessage... mimeMessages) throws MailException {
            // Mock implementation - do nothing
        }

        @Override
        public void send(MimeMessage mimeMessage, MimeMessage[] mimeMessages) throws MailException {
            // Mock implementation - do nothing
        }
    }
}
