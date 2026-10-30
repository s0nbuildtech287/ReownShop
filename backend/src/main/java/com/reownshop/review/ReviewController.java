package com.reownshop.review;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.reownshop.user.User;

@RestController
@RequestMapping("/api/v1")
public class ReviewController {
    private final ReviewService reviewService;
    public ReviewController(ReviewService reviewService) { this.reviewService = reviewService; }
    @PostMapping("/orders/{orderId}/reviews")
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewDtos.Response create(@AuthenticationPrincipal User reviewer, @PathVariable Long orderId, @RequestBody ReviewDtos.CreateRequest request) {
        return reviewService.create(reviewer, orderId, request);
    }
    @GetMapping("/users/{userId}/reviews")
    public List<ReviewDtos.Response> list(@PathVariable Long userId) {
        return reviewService.list(userId);
    }
}
