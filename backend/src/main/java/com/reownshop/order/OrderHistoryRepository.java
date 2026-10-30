package com.reownshop.order;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderHistoryRepository extends JpaRepository<OrderStatusHistory, Long> {}
