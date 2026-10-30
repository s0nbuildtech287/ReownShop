package com.reownshop.payment;

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
import jakarta.persistence.Table;

@Entity
@Table(name = "ledger_entries")
public class LedgerEntry {
    public enum Type { HOLD, RELEASE, REFUND, FEE, WITHDRAW }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "order_id") private Order order;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "user_id") private User user;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private Type type;
    @Column(nullable = false) private long amount;
    @Column(name = "created_at", nullable = false) private Instant createdAt = Instant.now();
    protected LedgerEntry() {}
    public LedgerEntry(Order order, User user, Type type, long amount) {
        this.order = order; this.user = user; this.type = type; this.amount = amount;
    }
}
