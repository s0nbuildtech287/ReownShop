package com.reownshop.interaction;

import java.io.Serializable;
import java.time.Instant;

import com.reownshop.listing.Listing;
import com.reownshop.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "favorites")
@IdClass(Favorite.Key.class)
public class Favorite {
    @Id @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id") private User user;
    @Id @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "listing_id") private Listing listing;
    @Column(name = "price_at_save", nullable = false) private long priceAtSave;
    @Column(name = "created_at", nullable = false) private Instant createdAt = Instant.now();
    protected Favorite() {}
    public Favorite(User user, Listing listing) { this.user = user; this.listing = listing; this.priceAtSave = listing.getPrice(); }
    public Listing getListing() { return listing; }
    public long getPriceAtSave() { return priceAtSave; }
    public static class Key implements Serializable {
        private Long user;
        private Long listing;
        public Key() {}
        public Key(Long user, Long listing) { this.user = user; this.listing = listing; }
        @Override public boolean equals(Object other) { return other instanceof Key key && java.util.Objects.equals(user, key.user) && java.util.Objects.equals(listing, key.listing); }
        @Override public int hashCode() { return java.util.Objects.hash(user, listing); }
    }
}
