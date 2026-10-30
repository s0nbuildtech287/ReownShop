package com.reownshop.listing;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.reownshop.user.User;

@RestController
@RequestMapping("/api/v1/listings")
public class ListingController {
    private final ListingService listingService;

    public ListingController(ListingService listingService) {
        this.listingService = listingService;
    }

    @GetMapping
    public Page<ListingDtos.Response> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) Long minPrice,
            @RequestParam(required = false) Long maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 50);
        return listingService.search(keyword, categoryId, minPrice, maxPrice,
                PageRequest.of(safePage, safeSize));
    }

    @GetMapping("/{id}")
    public ListingDtos.Response get(@PathVariable Long id) {
        return listingService.get(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ListingDtos.Response create(@AuthenticationPrincipal User seller,
                                       @RequestBody ListingDtos.CreateRequest request) {
        return listingService.create(seller, request);
    }
}
