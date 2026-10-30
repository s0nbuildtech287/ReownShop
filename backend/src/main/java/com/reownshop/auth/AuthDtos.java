package com.reownshop.auth;

import com.reownshop.user.User;

public final class AuthDtos {
    private AuthDtos() {}

    public record RegisterRequest(String email, String password, String fullName, String phone) {}
    public record LoginRequest(String email, String password) {}
    public record UserResponse(Long id, String email, String fullName, String phone, String role) {
        public static UserResponse from(User user) {
            return new UserResponse(user.getId(), user.getEmail(), user.getFullName(), user.getPhone(), user.getRole().name());
        }
    }
    public record AuthResponse(String accessToken, String tokenType, UserResponse user) {}
}
