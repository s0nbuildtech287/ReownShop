package com.reownshop.order;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public final class OrderDtos {
    private OrderDtos() {}
    public record CreateRequest(Long listingId, String deliveryMethod, Map<String, Object> shippingAddress, String buyerNote) {}
    public record ShipRequest(String carrier, String trackingCode) {}
    public record Response(Long id, Long listingId, String listingTitle, Long sellerId, String status,
                           String deliveryMethod, long price, long shippingFee, long platformFee, long totalAmount,
                           Map<String, Object> shippingAddress, String buyerNote, Instant reservedUntil,
                           String idempotencyKey, String carrier, String trackingCode, Instant createdAt) {
        static Response from(Order o) {
            return new Response(o.getId(), o.getListing().getId(), o.getListing().getTitle(), o.getSeller().getId(),
                    o.getStatus().name(), o.getDeliveryMethod().name(), o.getPrice(), o.getShippingFee(),
                    o.getPlatformFee(), o.getTotalAmount(), o.getShippingAddress(), o.getBuyerNote(),
                    o.getReservedUntil(), o.getIdempotencyKey(), o.getCarrier(), o.getTrackingCode(), o.getCreatedAt());
        }
    }
    public record ListResponse(List<Response> items) {}
}
