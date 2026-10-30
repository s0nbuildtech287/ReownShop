package com.reownshop.review;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.reownshop.order.Order;
import com.reownshop.order.OrderRepository;
import com.reownshop.user.User;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;

    public ReviewService(ReviewRepository reviewRepository, OrderRepository orderRepository) {
        this.reviewRepository = reviewRepository; this.orderRepository = orderRepository;
    }

    @Transactional
    public ReviewDtos.Response create(User reviewer, Long orderId, ReviewDtos.CreateRequest request) {
        Order order = orderRepository.findByIdAndBuyerId(orderId, reviewer.getId())
                .orElseGet(() -> orderRepository.findByIdAndSellerId(orderId, reviewer.getId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng")));
        if (order.getStatus() != Order.Status.COMPLETED) throw new ResponseStatusException(HttpStatus.CONFLICT, "Chỉ được đánh giá sau khi hoàn tất đơn");
        if (request == null || request.rating() == null || request.rating() < 1 || request.rating() > 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Điểm đánh giá phải từ 1 đến 5");
        }
        if (reviewRepository.existsByOrderIdAndReviewerId(orderId, reviewer.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Bạn đã đánh giá đơn hàng này");
        }
        User reviewee = order.getBuyer().getId().equals(reviewer.getId()) ? order.getSeller() : order.getBuyer();
        Review review = new Review(order, reviewer, reviewee, request.rating().shortValue(), request.tags(), request.comment(), request.imageUrls());
        return ReviewDtos.Response.from(reviewRepository.save(review));
    }

    @Transactional(readOnly = true)
    public List<ReviewDtos.Response> list(Long revieweeId) {
        return reviewRepository.findByRevieweeIdOrderByCreatedAtDesc(revieweeId).stream().map(ReviewDtos.Response::from).toList();
    }
}
