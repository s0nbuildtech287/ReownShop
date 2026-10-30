package com.reownshop.dispute;

import java.time.Instant;

public final class DisputeDtos {
    private DisputeDtos() {}
    public record CreateRequest(String reason, String description, String desiredResolution) {}
    public record Response(Long id, Long orderId, String reason, String description, String desiredResolution, String status, Instant createdAt) {
        static Response from(Dispute dispute) {
            return new Response(dispute.getId(), dispute.getOrder().getId(), dispute.getReason().name(), dispute.getDescription(),
                    dispute.getDesiredResolution().name(), dispute.getStatus().name(), dispute.getCreatedAt());
        }
    }
}
