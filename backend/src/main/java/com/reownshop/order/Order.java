package com.reownshop.order;

import java.time.Instant;
import java.util.Map;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

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
@Table(name = "orders")
public class Order {
    public enum Status { PENDING_PAYMENT, PAID_HELD, SHIPPED, DELIVERED, COMPLETED, DISPUTED, REFUNDED, CANCELLED }
    public enum DeliveryMethod { SHIPPING, MEETUP }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "listing_id")
    private Listing listing;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "buyer_id")
    private User buyer;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "seller_id")
    private User seller;
    @Column(nullable = false) private long price;
    @Column(name = "shipping_fee", nullable = false) private long shippingFee;
    @Column(name = "platform_fee", nullable = false) private long platformFee;
    @Column(name = "total_amount", nullable = false) private long totalAmount;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 30) private Status status = Status.PENDING_PAYMENT;
    @Enumerated(EnumType.STRING) @Column(name = "delivery_method", nullable = false, length = 10)
    private DeliveryMethod deliveryMethod;
    @JdbcTypeCode(SqlTypes.JSON) @Column(name = "shipping_address", columnDefinition = "jsonb")
    private Map<String, Object> shippingAddress;
    @Column(name = "buyer_note", length = 500) private String buyerNote;
    @Column(name = "reserved_until", nullable = false) private Instant reservedUntil;
    @Column(name = "idempotency_key", nullable = false, unique = true, length = 64) private String idempotencyKey;
    @Column(length = 50) private String carrier;
    @Column(name = "tracking_code", length = 100) private String trackingCode;
    @Column(name = "paid_at") private Instant paidAt;
    @Column(name = "shipped_at") private Instant shippedAt;
    @Column(name = "delivered_at") private Instant deliveredAt;
    @Column(name = "completed_at") private Instant completedAt;
    @Column(name = "created_at", nullable = false) private Instant createdAt = Instant.now();

    protected Order() {}

    public Order(Listing listing, User buyer, DeliveryMethod deliveryMethod, Map<String, Object> shippingAddress,
                 String buyerNote, long shippingFee, long platformFee, String idempotencyKey, Instant reservedUntil) {
        this.listing = listing;
        this.buyer = buyer;
        this.seller = listing.getSeller();
        this.price = listing.getPrice();
        this.shippingFee = shippingFee;
        this.platformFee = platformFee;
        this.totalAmount = price + shippingFee + platformFee;
        this.deliveryMethod = deliveryMethod;
        this.shippingAddress = shippingAddress;
        this.buyerNote = buyerNote;
        this.idempotencyKey = idempotencyKey;
        this.reservedUntil = reservedUntil;
    }

    public Long getId() { return id; }
    public Listing getListing() { return listing; }
    public User getBuyer() { return buyer; }
    public User getSeller() { return seller; }
    public long getPrice() { return price; }
    public long getShippingFee() { return shippingFee; }
    public long getPlatformFee() { return platformFee; }
    public long getTotalAmount() { return totalAmount; }
    public Status getStatus() { return status; }
    public DeliveryMethod getDeliveryMethod() { return deliveryMethod; }
    public Map<String, Object> getShippingAddress() { return shippingAddress; }
    public String getBuyerNote() { return buyerNote; }
    public Instant getReservedUntil() { return reservedUntil; }
    public String getIdempotencyKey() { return idempotencyKey; }
    public String getCarrier() { return carrier; }
    public String getTrackingCode() { return trackingCode; }
    public Instant getCreatedAt() { return createdAt; }

    public void markPaidHeld() {
        if (status != Status.PENDING_PAYMENT) {
            throw new IllegalStateException("Order is not waiting for payment");
        }
        status = Status.PAID_HELD;
        paidAt = Instant.now();
    }

    public void markShipped(String carrier, String trackingCode) {
        if (status != Status.PAID_HELD) throw new IllegalStateException("Order is not ready to ship");
        status = Status.SHIPPED;
        this.carrier = carrier;
        this.trackingCode = trackingCode;
        shippedAt = Instant.now();
    }

    public void markDelivered() {
        if (status != Status.SHIPPED) throw new IllegalStateException("Order is not shipped");
        status = Status.DELIVERED;
        deliveredAt = Instant.now();
    }

    public void markCompleted() {
        if (status != Status.DELIVERED) throw new IllegalStateException("Order is not delivered");
        status = Status.COMPLETED;
        completedAt = Instant.now();
    }
}
