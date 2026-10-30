package com.reownshop.chat;

import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.reownshop.listing.ListingRepository;
import com.reownshop.user.User;

@Service
public class ChatService {
    private static final Pattern SUSPICIOUS = Pattern.compile("(stk|số tài khoản|chuyển khoản|ngân hàng|bank|zalo|inbox zalo|\\b\\d{9,16}\\b)", Pattern.CASE_INSENSITIVE);
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final ListingRepository listingRepository;

    public ChatService(ConversationRepository conversationRepository, MessageRepository messageRepository, ListingRepository listingRepository) {
        this.conversationRepository = conversationRepository; this.messageRepository = messageRepository; this.listingRepository = listingRepository;
    }

    @Transactional
    public ChatDtos.ConversationResponse open(User buyer, ChatDtos.ConversationRequest request) {
        var existing = conversationRepository.findByListingIdAndBuyerId(request.listingId(), buyer.getId());
        Conversation conversation = existing.orElseGet(() -> {
            var listing = listingRepository.findById(request.listingId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tin đăng"));
            return conversationRepository.save(new Conversation(listing, buyer));
        });
        return conversationResponse(conversation);
    }

    @Transactional(readOnly = true)
    public List<ChatDtos.ConversationResponse> conversations(User user) {
        return conversationRepository.findByBuyerIdOrSellerIdOrderByIdDesc(user.getId(), user.getId()).stream().map(this::conversationResponse).toList();
    }

    @Transactional
    public ChatDtos.MessageResponse send(User user, Long conversationId, ChatDtos.MessageRequest request) {
        Conversation conversation = conversationRepository.findByIdAndBuyerIdOrIdAndSellerId(conversationId, user.getId(), conversationId, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy cuộc trò chuyện"));
        if (request == null || request.content() == null || request.content().isBlank()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nội dung tin nhắn trống");
        Message.Type type;
        try { type = Message.Type.valueOf(request.type() == null ? "TEXT" : request.type().toUpperCase(Locale.ROOT)); }
        catch (IllegalArgumentException ex) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Loại tin nhắn không hợp lệ"); }
        boolean flagged = SUSPICIOUS.matcher(request.content()).find();
        Message message = messageRepository.save(new Message(conversation, user, type, request.content().trim(), flagged));
        conversation.touch();
        return messageResponse(message);
    }

    @Transactional(readOnly = true)
    public ChatDtos.MessageList messages(User user, Long conversationId) {
        conversationRepository.findByIdAndBuyerIdOrIdAndSellerId(conversationId, user.getId(), conversationId, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy cuộc trò chuyện"));
        return new ChatDtos.MessageList(messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId).stream().map(this::messageResponse).toList());
    }

    private ChatDtos.ConversationResponse conversationResponse(Conversation c) { return new ChatDtos.ConversationResponse(c.getId(), c.getListing().getId(), c.getListing().getTitle(), c.getBuyer().getId(), c.getSeller().getId()); }
    private ChatDtos.MessageResponse messageResponse(Message m) { return new ChatDtos.MessageResponse(m.getId(), m.getConversation().getId(), m.getSender().getId(), m.getType().name(), m.getContent(), m.isFlagged(), m.getCreatedAt()); }
}
