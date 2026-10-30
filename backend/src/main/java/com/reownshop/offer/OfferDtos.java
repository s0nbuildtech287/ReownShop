package com.reownshop.offer;

import java.time.Instant;

public final class OfferDtos {
    private OfferDtos() {}
    public record CreateRequest(Long listingId, Long amount, String message, Long parentId) {}
    public record Response(Long id, Long listingId, Long buyerId, long amount, String message,
                           String status, String madeBy, Instant expiresAt, Instant createdAt) {
        static Response from(Offer offer) {
            return new Response(offer.getId(), offer.getListing().getId(), offer.getBuyer().getId(), offer.getAmount(),
                    offer.getMessage(), offer.getStatus().name(), offer.getMadeBy().name(), offer.getExpiresAt(), offer.getCreatedAt());
        }
    }
}
