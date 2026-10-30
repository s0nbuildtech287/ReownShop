package com.reownshop.interaction;

import java.time.Instant;
import java.util.List;

public final class InteractionDtos {
    private InteractionDtos() {}
    public record FavoriteResponse(Long listingId, String title, long currentPrice, long savedPrice, boolean priceDropped) {}
    public record NotificationResponse(Long id, String type, String title, String body, boolean read, Instant createdAt) {}
    public record NotificationList(List<NotificationResponse> items) {}
}
