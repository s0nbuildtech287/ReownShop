package com.reownshop.offer;

import java.time.Instant;

import com.reownshop.listing.Listing;
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
@Table(name = "offers")
public class Offer {
    public enum Status { PENDING, ACCEPTED, REJECTED, COUNTERED, EXPIRED }
    public enum MadeBy { BUYER, SELLER }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "listing_id") private Listing listing;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "buyer_id") private User buyer;
    @Column(nullable = false) private long amount;
    @Column(length = 500) private String message;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private Status status = Status.PENDING;
    @Enumerated(EnumType.STRING) @Column(name = "made_by", nullable = false, length = 10) private MadeBy madeBy;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "parent_id") private Offer parent;
    @Column(name = "expires_at", nullable = false) private Instant expiresAt;
    @Column(name = "created_at", nullable = false) private Instant createdAt = Instant.now();

    protected Offer() {}
    public Offer(Listing listing, User buyer, long amount, String message, MadeBy madeBy, Offer parent, Instant expiresAt) {
        this.listing = listing; this.buyer = buyer; this.amount = amount; this.message = message;
        this.madeBy = madeBy; this.parent = parent; this.expiresAt = expiresAt;
    }
    public Long getId() { return id; }
    public Listing getListing() { return listing; }
    public User getBuyer() { return buyer; }
    public long getAmount() { return amount; }
    public String getMessage() { return message; }
    public Status getStatus() { return status; }
    public MadeBy getMadeBy() { return madeBy; }
    public Instant getExpiresAt() { return expiresAt; }
    public Instant getCreatedAt() { return createdAt; }
    public void accept() { status = Status.ACCEPTED; }
    public void reject() { status = Status.REJECTED; }
    public void countered() { status = Status.COUNTERED; }
    public boolean isExpired() { return expiresAt.isBefore(Instant.now()); }
    public void expireIfNeeded() { if (status == Status.PENDING && isExpired()) status = Status.EXPIRED; }
}
