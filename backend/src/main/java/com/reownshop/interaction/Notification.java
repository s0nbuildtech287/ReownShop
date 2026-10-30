package com.reownshop.interaction;

import java.time.Instant;

import com.reownshop.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "notifications")
public class Notification {
    public enum Type { ORDER, OFFER, MESSAGE, SYSTEM }
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "user_id") private User user;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 10) private Type type;
    @Column(nullable = false, length = 200) private String title;
    private String body;
    @Column(name = "ref_type", length = 20) private String refType;
    @Column(name = "ref_id") private Long refId;
    @Column(name = "is_read", nullable = false) private boolean read;
    @Column(name = "created_at", nullable = false) private Instant createdAt = Instant.now();
    protected Notification() {}
    public Notification(User user, Type type, String title, String body, String refType, Long refId) {
        this.user = user; this.type = type; this.title = title; this.body = body; this.refType = refType; this.refId = refId;
    }
    public Long getId() { return id; }
    public Type getType() { return type; }
    public String getTitle() { return title; }
    public String getBody() { return body; }
    public boolean isRead() { return read; }
    public Instant getCreatedAt() { return createdAt; }
    public void markRead() { read = true; }
}
