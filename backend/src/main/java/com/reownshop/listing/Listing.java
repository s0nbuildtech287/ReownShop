package com.reownshop.listing;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.reownshop.user.User;

import jakarta.persistence.CascadeType;
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
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import jakarta.persistence.Version;

@Entity
@Table(name = "listings")
public class Listing {
    public enum Condition { NEW_99, VERY_GOOD, GOOD, FAIR }
    public enum Status { ACTIVE, RESERVED, SOLD, HIDDEN }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private long price;

    @Column(name = "retail_price")
    private Long retailPrice;

    @Column(name = "allow_offers", nullable = false)
    private boolean allowOffers = true;

    @Column(name = "min_accept_price")
    private Long minAcceptPrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "condition", nullable = false, length = 20)
    private Condition condition;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.ACTIVE;

    @Version
    @Column(nullable = false)
    private int version;

    private String province;
    private String district;
    private Double latitude;
    private Double longitude;

    @Column(name = "view_count", nullable = false)
    private int viewCount;

    @Column(name = "bumped_at", nullable = false)
    private Instant bumpedAt = Instant.now();

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @OneToMany(mappedBy = "listing", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<ListingImage> images = new ArrayList<>();

    protected Listing() {
    }

    public Listing(User seller, Category category, String title, String description, long price,
                   Long retailPrice, boolean allowOffers, Long minAcceptPrice, Condition condition,
                   String province, String district) {
        this.seller = seller;
        this.category = category;
        this.title = title;
        this.description = description;
        this.price = price;
        this.retailPrice = retailPrice;
        this.allowOffers = allowOffers;
        this.minAcceptPrice = minAcceptPrice;
        this.condition = condition;
        this.province = province;
        this.district = district;
    }

    public void addImage(String url, int sortOrder) {
        images.add(new ListingImage(this, url, sortOrder));
    }

    public void reserve() {
        if (status != Status.ACTIVE) {
            throw new IllegalStateException("Listing is not active");
        }
        status = Status.RESERVED;
    }

    public Long getId() { return id; }
    public User getSeller() { return seller; }
    public Category getCategory() { return category; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public long getPrice() { return price; }
    public Long getRetailPrice() { return retailPrice; }
    public boolean isAllowOffers() { return allowOffers; }
    public Condition getCondition() { return condition; }
    public Status getStatus() { return status; }
    public String getProvince() { return province; }
    public String getDistrict() { return district; }
    public List<ListingImage> getImages() { return images; }
    public Instant getCreatedAt() { return createdAt; }
}
