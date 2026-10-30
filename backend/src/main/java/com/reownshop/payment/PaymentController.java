package com.reownshop.payment;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.reownshop.user.User;

@RestController
@RequestMapping("/api/v1")
public class PaymentController {
    private final PaymentService paymentService;
    private final String webhookSecret;

    public PaymentController(PaymentService paymentService,
                             @Value("${reownshop.payment.webhook-secret}") String webhookSecret) {
        this.paymentService = paymentService;
        this.webhookSecret = webhookSecret;
    }

    @PostMapping("/orders/{orderId}/payments")
    public PaymentDtos.Response create(@AuthenticationPrincipal User buyer, @PathVariable Long orderId,
                                       @RequestBody(required = false) PaymentDtos.CreateRequest request) {
        return paymentService.create(buyer, orderId, request);
    }

    @PostMapping("/payments/webhook")
    public PaymentDtos.Response webhook(@RequestHeader("X-Webhook-Secret") String secret,
                                        @RequestBody PaymentDtos.WebhookRequest request) {
        if (!webhookSecret.equals(secret)) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Webhook không hợp lệ");
        }
        return paymentService.webhook(request);
    }
}
