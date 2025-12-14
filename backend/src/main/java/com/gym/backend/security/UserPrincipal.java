package com.gym.backend.security;

import com.gym.backend.entity.User;
import com.gym.backend.entity.enums.RoleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Custom UserDetails implementation for Spring Security
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPrincipal implements UserDetails {

    private Long id;
    private String username; // email
    private String password;
    private String firstName;
    private String lastName;
    private Collection<? extends GrantedAuthority> authorities;
    private boolean enabled;

    public static UserPrincipal create(User user) {
        List<GrantedAuthority> authorities = user.getRoles().stream()
            .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
            .collect(Collectors.toList());

        return UserPrincipal.builder()
            .id(user.getId())
            .username(user.getEmail())
            .password(user.getPassword())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .authorities(authorities)
            .enabled(user.isActive())
            .build();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}
