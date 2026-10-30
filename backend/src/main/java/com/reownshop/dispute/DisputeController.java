package com.reownshop.dispute;

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
@RequestMapping("/api/v1")
public class DisputeController {
    private final DisputeService disputeService;
    public DisputeController(DisputeService disputeService) { this.disputeService = disputeService; }
    @PostMapping("/orders/{orderId}/disputes")
    @ResponseStatus(HttpStatus.CREATED)
    public DisputeDtos.Response open(@AuthenticationPrincipal User buyer, @PathVariable Long orderId, @RequestBody DisputeDtos.CreateRequest request) {
        return disputeService.open(buyer, orderId, request);
    }
    @GetMapping("/disputes/{id}")
    public DisputeDtos.Response get(@AuthenticationPrincipal User buyer, @PathVariable Long id) { return disputeService.get(buyer, id); }
}
