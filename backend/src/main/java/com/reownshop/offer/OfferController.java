package com.reownshop.offer;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.reownshop.user.User;

@RestController
@RequestMapping("/api/v1/offers")
public class OfferController {
    private final OfferService offerService;
    public OfferController(OfferService offerService) { this.offerService = offerService; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OfferDtos.Response create(@AuthenticationPrincipal User buyer, @RequestBody OfferDtos.CreateRequest request) {
        return offerService.create(buyer, request);
    }

    @PostMapping("/{id}/accept")
    public OfferDtos.Response accept(@AuthenticationPrincipal User seller, @PathVariable Long id) {
        return offerService.accept(seller, id);
    }

    @PostMapping("/{id}/reject")
    public OfferDtos.Response reject(@AuthenticationPrincipal User seller, @PathVariable Long id) {
        return offerService.reject(seller, id);
    }

    @GetMapping("/mine")
    public List<OfferDtos.Response> mine(@AuthenticationPrincipal User buyer) { return offerService.mine(buyer); }
}
