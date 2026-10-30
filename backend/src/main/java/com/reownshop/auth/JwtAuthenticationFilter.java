package com.reownshop.auth;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.reownshop.user.User;
import com.reownshop.user.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                String email = jwtService.getSubject(token);
                userRepository.findByEmailIgnoreCase(email).ifPresent(user -> authenticateIfValid(token, user));
            } catch (RuntimeException ignored) {
                // Invalid tokens are treated as unauthenticated and handled by Spring Security.
            }
        }
        filterChain.doFilter(request, response);
    }

    private void authenticateIfValid(String token, User user) {
        if (jwtService.isValid(token, user)) {
            var authorities = java.util.List.of(() -> "ROLE_" + user.getRole().name());
            var authentication = new UsernamePasswordAuthenticationToken(user, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
    }
}
