package com.reownshop.dispute;

import java.time.Instant;

import com.reownshop.order.Order;
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
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "disputes")
public class Dispute {
    public enum Reason { NOT_AS_DESCRIBED, DEFECTIVE, NOT_RECEIVED, COUNTERFEIT, OTHER }
    public enum DesiredResolution { REFUND_FULL, REFUND_PARTIAL, RETURN }
    public enum Status { OPEN, REVIEWING, WAITING_SELLER, RESOLVED }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @OneToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "order_id", unique = true) private Order order;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "opened_by", nullable = false) private User openedBy;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 30) private Reason reason;
    @Column(nullable = false, columnDefinition = "TEXT") private String description;
    @Enumerated(EnumType.STRING) @Column(name = "desired_resolution", nullable = false, length = 20) private DesiredResolution desiredResolution;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private Status status = Status.OPEN;
    @Column(name = "created_at", nullable = false) private Instant createdAt = Instant.now();

    protected Dispute() {}
    public Dispute(Order order, User openedBy, Reason reason, String description, DesiredResolution desiredResolution) {
        this.order = order; this.openedBy = openedBy; this.reason = reason; this.description = description; this.desiredResolution = desiredResolution;
    }
    public Long getId() { return id; }
    public Order getOrder() { return order; }
    public User getOpenedBy() { return openedBy; }
    public Reason getReason() { return reason; }
    public String getDescription() { return description; }
    public DesiredResolution getDesiredResolution() { return desiredResolution; }
    public Status getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
}
