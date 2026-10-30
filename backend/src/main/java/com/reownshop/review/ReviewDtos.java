package com.reownshop.review;

import java.time.Instant;
import java.util.List;

public final class ReviewDtos {
    private ReviewDtos() {}
    public record CreateRequest(Integer rating, List<String> tags, String comment, List<String> imageUrls) {}
    public record Response(Long id, Long revieweeId, short rating, List<String> tags, String comment, List<String> imageUrls, Instant createdAt) {
        static Response from(Review review) { return new Response(review.getId(), review.getReviewee().getId(), review.getRating(), review.getTags(), review.getComment(), review.getImageUrls(), review.getCreatedAt()); }
    }
}
