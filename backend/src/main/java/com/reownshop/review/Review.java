package com.reownshop.review;

import java.time.Instant;
import java.util.List;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.reownshop.order.Order;
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
@Table(name = "reviews")
public class Review {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "order_id") private Order order;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "reviewer_id") private User reviewer;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "reviewee_id") private User reviewee;
    @Column(nullable = false) private short rating;
    @JdbcTypeCode(SqlTypes.ARRAY) @Column(columnDefinition = "text[]", nullable = false) private List<String> tags;
    private String comment;
    @JdbcTypeCode(SqlTypes.ARRAY) @Column(name = "image_urls", columnDefinition = "text[]", nullable = false) private List<String> imageUrls;
    @Column(name = "created_at", nullable = false) private Instant createdAt = Instant.now();
    protected Review() {}
    public Review(Order order, User reviewer, User reviewee, short rating, List<String> tags, String comment, List<String> imageUrls) {
        this.order = order; this.reviewer = reviewer; this.reviewee = reviewee; this.rating = rating;
        this.tags = tags == null ? List.of() : tags; this.comment = comment; this.imageUrls = imageUrls == null ? List.of() : imageUrls;
    }
    public Long getId() { return id; }
    public User getReviewee() { return reviewee; }
    public short getRating() { return rating; }
    public List<String> getTags() { return tags; }
    public String getComment() { return comment; }
    public List<String> getImageUrls() { return imageUrls; }
    public Instant getCreatedAt() { return createdAt; }
}
