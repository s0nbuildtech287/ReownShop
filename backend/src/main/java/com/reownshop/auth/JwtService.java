package com.reownshop.auth;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;

import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.reownshop.user.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
    private final Key signingKey;
    private final Duration expiration;

    public JwtService(
            @Value("${reownshop.jwt.secret}") String secret,
            @Value("${reownshop.jwt.expiration-minutes}") long expirationMinutes) {
        byte[] secretBytes = secret.getBytes(StandardCharsets.UTF_8);
        this.signingKey = Keys.hmacShaKeyFor(secretBytes);
        this.expiration = Duration.ofMinutes(expirationMinutes);
    }

    public String issue(User user) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(user.getEmail())
                .claim("role", user.getRole().name())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(expiration)))
                .signWith(signingKey)
                .compact();
    }

    public String getSubject(String token) {
        return parse(token).getSubject();
    }

    public boolean isValid(String token, User user) {
        try {
            Claims claims = parse(token);
            return claims.getSubject().equalsIgnoreCase(user.getEmail())
                    && claims.getExpiration().after(new Date())
                    && user.getStatus() == User.Status.ACTIVE;
        } catch (RuntimeException ex) {
            return false;
        }
    }

    private Claims parse(String token) {
        return Jwts.parser()
                .verifyWith(new SecretKeySpec(signingKey.getEncoded(), signingKey.getAlgorithm()))
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
