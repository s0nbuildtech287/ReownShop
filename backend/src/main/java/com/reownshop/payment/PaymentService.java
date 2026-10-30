package com.reownshop.payment;

import java.util.Locale;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.reownshop.order.Order;
import com.reownshop.order.OrderHistoryRepository;
import com.reownshop.order.OrderRepository;
import com.reownshop.user.User;

@Service
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final LedgerEntryRepository ledgerRepository;
    private final OrderRepository orderRepository;
    private final OrderHistoryRepository historyRepository;

    public PaymentService(PaymentRepository paymentRepository, LedgerEntryRepository ledgerRepository,
                          OrderRepository orderRepository, OrderHistoryRepository historyRepository) {
        this.paymentRepository = paymentRepository;
        this.ledgerRepository = ledgerRepository;
        this.orderRepository = orderRepository;
        this.historyRepository = historyRepository;
    }

    @Transactional
    public PaymentDtos.Response create(User buyer, Long orderId, PaymentDtos.CreateRequest request) {
        Order order = orderRepository.findByIdAndBuyerId(orderId, buyer.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng"));
        var existing = paymentRepository.findByOrderId(orderId);
        if (existing.isPresent()) return response(existing.get());
        if (order.getStatus() != Order.Status.PENDING_PAYMENT) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Đơn hàng không còn chờ thanh toán");
        }
        Payment.Provider provider = parseProvider(request == null ? null : request.provider());
        Payment payment = paymentRepository.save(new Payment(order, provider, "PAY-" + UUID.randomUUID(), order.getTotalAmount()));
        return response(payment);
    }

    @Transactional
    public PaymentDtos.Response webhook(PaymentDtos.WebhookRequest request) {
        Payment payment = paymentRepository.findByProviderRef(request.providerRef())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy payment"));
        if ("SUCCESS".equalsIgnoreCase(request.status()) && payment.getStatus() != Payment.Status.SUCCESS) {
            payment.markSuccess();
            Order order = payment.getOrder();
            order.markPaidHeld();
            orderRepository.save(order);
            if (!ledgerRepository.existsByOrderIdAndType(order.getId(), LedgerEntry.Type.HOLD)) {
                ledgerRepository.save(new LedgerEntry(order, order.getSeller(), LedgerEntry.Type.HOLD, order.getTotalAmount()));
            }
            historyRepository.save(new com.reownshop.order.OrderStatusHistory(order, Order.Status.PAID_HELD.name(), null, "Thanh toán sandbox thành công"));
        }
        return response(payment);
    }

    private PaymentDtos.Response response(Payment payment) {
        return new PaymentDtos.Response(payment.getProvider().name(), payment.getProviderRef(), payment.getAmount(), payment.getStatus().name());
    }

    private Payment.Provider parseProvider(String value) {
        try { return Payment.Provider.valueOf(value == null ? "PAYOS" : value.trim().toUpperCase(Locale.ROOT)); }
        catch (IllegalArgumentException ex) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cổng thanh toán không hợp lệ"); }
    }
}
