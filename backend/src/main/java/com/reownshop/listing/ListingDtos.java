package com.reownshop.listing;

import java.time.Instant;
import java.util.List;

import com.reownshop.user.User;

public final class ListingDtos {
    private ListingDtos() {}

    public record CreateRequest(
            Integer categoryId,
            String title,
            String description,
            Long price,
            Long retailPrice,
            Boolean allowOffers,
            Long minAcceptPrice,
            String condition,
            String province,
            String district,
            List<String> imageUrls) {}

    public record Response(
            Long id,
            String title,
            String description,
            long price,
            Long retailPrice,
            boolean allowOffers,
            String condition,
            String status,
            Integer categoryId,
            String categoryName,
            Long sellerId,
            String sellerName,
            String province,
            String district,
            List<String> imageUrls,
            Instant createdAt) {
        static Response from(Listing listing) {
            User seller = listing.getSeller();
            return new Response(
                    listing.getId(), listing.getTitle(), listing.getDescription(), listing.getPrice(),
                    listing.getRetailPrice(), listing.isAllowOffers(), listing.getCondition().name(),
                    listing.getStatus().name(), listing.getCategory().getId(), listing.getCategory().getName(),
                    seller.getId(), seller.getFullName(), listing.getProvince(), listing.getDistrict(),
                    listing.getImages().stream().map(ListingImage::getUrl).toList(), listing.getCreatedAt());
        }
    }
}
