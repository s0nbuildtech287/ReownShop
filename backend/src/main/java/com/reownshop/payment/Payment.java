package com.reownshop.payment;

import java.time.Instant;

import com.reownshop.order.Order;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "payments")
public class Payment {
    public enum Provider { PAYOS, VNPAY, MOMO }
    public enum Status { PENDING, SUCCESS, FAILED }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @OneToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "order_id", unique = true)
    private Order order;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private Provider provider;
    @Column(name = "provider_ref", unique = true, length = 100) private String providerRef;
    @Column(nullable = false) private long amount;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private Status status = Status.PENDING;
    @Column(name = "created_at", nullable = false) private Instant createdAt = Instant.now();

    protected Payment() {}
    public Payment(Order order, Provider provider, String providerRef, long amount) {
        this.order = order; this.provider = provider; this.providerRef = providerRef; this.amount = amount;
    }
    public Long getId() { return id; }
    public Order getOrder() { return order; }
    public Provider getProvider() { return provider; }
    public String getProviderRef() { return providerRef; }
    public long getAmount() { return amount; }
    public Status getStatus() { return status; }
    public void markSuccess() { status = Status.SUCCESS; }
}
