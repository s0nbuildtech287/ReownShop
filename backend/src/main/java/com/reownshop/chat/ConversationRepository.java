package com.reownshop.chat;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    Optional<Conversation> findByListingIdAndBuyerId(Long listingId, Long buyerId);
    Optional<Conversation> findByIdAndBuyerIdOrIdAndSellerId(Long buyerIdConversationId, Long buyerId, Long sellerConversationId, Long sellerId);
    List<Conversation> findByBuyerIdOrSellerIdOrderByIdDesc(Long buyerId, Long sellerId);
}
