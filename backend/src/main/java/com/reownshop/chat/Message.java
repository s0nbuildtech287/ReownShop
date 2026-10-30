package com.reownshop.chat;

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
@Table(name = "messages")
public class Message {
    public enum Type { TEXT, IMAGE, OFFER, ORDER_UPDATE, SYSTEM }
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "conversation_id") private Conversation conversation;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "sender_id") private User sender;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 15) private Type type = Type.TEXT;
    private String content;
    @Column(name = "image_url") private String imageUrl;
    @Column(name = "is_flagged", nullable = false) private boolean flagged;
    @Column(name = "created_at", nullable = false) private Instant createdAt = Instant.now();
    protected Message() {}
    public Message(Conversation conversation, User sender, Type type, String content, boolean flagged) {
        this.conversation = conversation; this.sender = sender; this.type = type; this.content = content; this.flagged = flagged;
    }
    public Long getId() { return id; }
    public Conversation getConversation() { return conversation; }
    public User getSender() { return sender; }
    public Type getType() { return type; }
    public String getContent() { return content; }
    public boolean isFlagged() { return flagged; }
    public Instant getCreatedAt() { return createdAt; }
}
