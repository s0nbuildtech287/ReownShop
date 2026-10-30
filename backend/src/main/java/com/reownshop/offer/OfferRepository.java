package com.reownshop.offer;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OfferRepository extends JpaRepository<Offer, Long> {
    Optional<Offer> findByIdAndBuyerId(Long id, Long buyerId);
    Optional<Offer> findByIdAndListingSellerId(Long id, Long sellerId);
    List<Offer> findByListingIdOrderByCreatedAtDesc(Long listingId);
    List<Offer> findByBuyerIdOrderByCreatedAtDesc(Long buyerId);
}
