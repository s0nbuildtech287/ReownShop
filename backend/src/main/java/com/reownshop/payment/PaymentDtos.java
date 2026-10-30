package com.reownshop.payment;

public final class PaymentDtos {
    private PaymentDtos() {}
    public record CreateRequest(String provider) {}
    public record WebhookRequest(String providerRef, String status) {}
    public record Response(String provider, String providerRef, long amount, String status) {}
}
