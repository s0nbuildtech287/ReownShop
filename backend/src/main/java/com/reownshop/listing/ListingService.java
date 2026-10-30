package com.reownshop.listing;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.reownshop.user.User;

@Service
public class ListingService {
    private final ListingRepository listingRepository;
    private final CategoryRepository categoryRepository;

    public ListingService(ListingRepository listingRepository, CategoryRepository categoryRepository) {
        this.listingRepository = listingRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public Page<ListingDtos.Response> search(String keyword, Integer categoryId, Long minPrice, Long maxPrice, Pageable pageable) {
        return listingRepository.search(blankToNull(keyword), categoryId, minPrice, maxPrice, pageable)
                .map(ListingDtos.Response::from);
    }

    @Transactional(readOnly = true)
    public ListingDtos.Response get(Long id) {
        return listingRepository.findDetailById(id)
                .map(ListingDtos.Response::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tin đăng"));
    }

    @Transactional
    public ListingDtos.Response create(User seller, ListingDtos.CreateRequest request) {
        if (request.categoryId() == null || request.title() == null || request.title().isBlank()
                || request.price() == null || request.price() <= 0 || request.condition() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thiếu dữ liệu tin đăng bắt buộc");
        }
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Danh mục không tồn tại"));
        Listing listing;
        try {
            listing = new Listing(seller, category, request.title().trim(), request.description(), request.price(),
                    request.retailPrice(), request.allowOffers() == null || request.allowOffers(), request.minAcceptPrice(),
                    Listing.Condition.valueOf(request.condition()), request.province(), request.district());
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tình trạng sản phẩm không hợp lệ");
        }
        if (request.imageUrls() != null) {
            for (int i = 0; i < request.imageUrls().size(); i++) {
                String url = request.imageUrls().get(i);
                if (url != null && !url.isBlank()) listing.addImage(url.trim(), i);
            }
        }
        return ListingDtos.Response.from(listingRepository.save(listing));
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
