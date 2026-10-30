package com.reownshop.order;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByIdempotencyKeyAndBuyerId(String idempotencyKey, Long buyerId);
    Optional<Order> findByIdAndBuyerId(Long id, Long buyerId);
    Optional<Order> findByIdAndSellerId(Long id, Long sellerId);
    List<Order> findByBuyerIdOrderByCreatedAtDesc(Long buyerId);
}
