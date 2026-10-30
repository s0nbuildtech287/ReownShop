package com.reownshop.review;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    boolean existsByOrderIdAndReviewerId(Long orderId, Long reviewerId);
    List<Review> findByRevieweeIdOrderByCreatedAtDesc(Long revieweeId);
}
