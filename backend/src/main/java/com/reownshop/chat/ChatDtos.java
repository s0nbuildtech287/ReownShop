package com.reownshop.chat;

import java.time.Instant;
import java.util.List;

public final class ChatDtos {
    private ChatDtos() {}
    public record ConversationRequest(Long listingId) {}
    public record MessageRequest(String type, String content) {}
    public record ConversationResponse(Long id, Long listingId, String listingTitle, Long buyerId, Long sellerId) {}
    public record MessageResponse(Long id, Long conversationId, Long senderId, String type, String content, boolean flagged, Instant createdAt) {}
    public record MessageList(List<MessageResponse> items) {}
}
