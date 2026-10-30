package com.reownshop.offer;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.reownshop.listing.Listing;
import com.reownshop.listing.ListingRepository;
import com.reownshop.user.User;

@Service
public class OfferService {
    private static final Duration OFFER_DURATION = Duration.ofHours(24);
    private final OfferRepository offerRepository;
    private final ListingRepository listingRepository;

    public OfferService(OfferRepository offerRepository, ListingRepository listingRepository) {
        this.offerRepository = offerRepository; this.listingRepository = listingRepository;
    }

    @Transactional
    public OfferDtos.Response create(User buyer, OfferDtos.CreateRequest request) {
        if (request.listingId() == null || request.amount() == null || request.amount() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thiếu listingId hoặc mức giá hợp lệ");
        }
        Listing listing = listingRepository.findById(request.listingId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tin đăng"));
        if (listing.getStatus() != Listing.Status.ACTIVE || !listing.isAllowOffers()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Tin đăng không nhận trả giá");
        }
        Offer parent = null;
        if (request.parentId() != null) {
            parent = offerRepository.findByIdAndBuyerId(request.parentId(), buyer.getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy offer gốc"));
            if (parent.getListing().getId() != listing.getId()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Offer gốc không thuộc sản phẩm");
            }
            parent.countered();
        }
        Offer offer = new Offer(listing, buyer, request.amount(), request.message(), Offer.MadeBy.BUYER, parent,
                Instant.now().plus(OFFER_DURATION));
        return OfferDtos.Response.from(offerRepository.save(offer));
    }

    @Transactional
    public OfferDtos.Response accept(User seller, Long id) {
        Offer offer = offerRepository.findByIdAndListingSellerId(id, seller.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy offer"));
        offer.expireIfNeeded();
        if (offer.getStatus() != Offer.Status.PENDING) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Offer không còn hiệu lực");
        }
        offer.accept();
        return OfferDtos.Response.from(offer);
    }

    @Transactional
    public OfferDtos.Response reject(User seller, Long id) {
        Offer offer = offerRepository.findByIdAndListingSellerId(id, seller.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy offer"));
        if (offer.getStatus() != Offer.Status.PENDING) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Offer không còn hiệu lực");
        }
        offer.reject();
        return OfferDtos.Response.from(offer);
    }

    @Transactional(readOnly = true)
    public List<OfferDtos.Response> mine(User buyer) {
        return offerRepository.findByBuyerIdOrderByCreatedAtDesc(buyer.getId()).stream().map(OfferDtos.Response::from).toList();
    }
}
