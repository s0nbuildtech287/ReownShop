package com.reownshop.chat;

import java.time.Instant;

import com.reownshop.listing.Listing;
import com.reownshop.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "conversations")
public class Conversation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "listing_id") private Listing listing;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "buyer_id") private User buyer;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "seller_id") private User seller;
    @Column(name = "last_message_at", nullable = false) private Instant lastMessageAt = Instant.now();
    protected Conversation() {}
    public Conversation(Listing listing, User buyer) { this.listing = listing; this.buyer = buyer; this.seller = listing.getSeller(); }
    public Long getId() { return id; }
    public Listing getListing() { return listing; }
    public User getBuyer() { return buyer; }
    public User getSeller() { return seller; }
    public void touch() { lastMessageAt = Instant.now(); }
}
