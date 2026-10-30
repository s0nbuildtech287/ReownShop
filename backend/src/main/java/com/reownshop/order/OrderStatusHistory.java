package com.reownshop.order;

import java.time.Instant;
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
@Table(name = "order_status_history")
public class OrderStatusHistory {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "order_id") private Order order;
    @Column(name = "to_status", nullable = false, length = 30) private String toStatus;
    @Column(name = "actor_id") private Long actorId;
    private String note;
    @Column(name = "created_at", nullable = false) private Instant createdAt = Instant.now();
    protected OrderStatusHistory() {}
    public OrderStatusHistory(Order order, String toStatus, Long actorId, String note) {
        this.order = order; this.toStatus = toStatus; this.actorId = actorId; this.note = note;
    }
}
