package com.reownshop.order;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.reownshop.listing.Listing;
import com.reownshop.listing.ListingRepository;
import com.reownshop.payment.LedgerEntry;
import com.reownshop.payment.LedgerEntryRepository;
import com.reownshop.user.User;

@Service
public class OrderService {
    private static final long DELIVERY_FEE = 35000L;
    private static final Duration RESERVATION_DURATION = Duration.ofMinutes(15);
    private final OrderRepository orderRepository;
    private final OrderHistoryRepository historyRepository;
    private final ListingRepository listingRepository;
    private final LedgerEntryRepository ledgerRepository;

    public OrderService(OrderRepository orderRepository, OrderHistoryRepository historyRepository,
                        ListingRepository listingRepository, LedgerEntryRepository ledgerRepository) {
        this.orderRepository = orderRepository; this.historyRepository = historyRepository;
        this.listingRepository = listingRepository; this.ledgerRepository = ledgerRepository;
    }

    @Transactional
    public OrderDtos.Response create(User buyer, String key, OrderDtos.CreateRequest request) {
        if (key == null || key.isBlank() || key.length() > 64) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thiếu Idempotency-Key hợp lệ");
        }
        var existing = orderRepository.findByIdempotencyKeyAndBuyerId(key.trim(), buyer.getId());
        if (existing.isPresent()) return OrderDtos.Response.from(existing.get());
        if (request.listingId() == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thiếu listingId");

        Listing listing = listingRepository.findByIdForUpdate(request.listingId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tin đăng"));
        if (listing.getStatus() != Listing.Status.ACTIVE) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Sản phẩm đã được giữ hoặc đã bán");
        }
        Order.DeliveryMethod method = parseMethod(request.deliveryMethod());
        long shippingFee = method == Order.DeliveryMethod.SHIPPING ? DELIVERY_FEE : 0L;
        Order order = new Order(listing, buyer, method, request.shippingAddress(), request.buyerNote(), shippingFee, 0L,
                key.trim(), Instant.now().plus(RESERVATION_DURATION));
        try {
            Order saved = orderRepository.save(order);
            listing.reserve();
            historyRepository.save(new OrderStatusHistory(saved, Order.Status.PENDING_PAYMENT.name(), buyer.getId(), "Giữ sản phẩm 15 phút"));
            return OrderDtos.Response.from(saved);
        } catch (DataIntegrityViolationException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Sản phẩm vừa được người khác giữ");
        }
    }

    @Transactional(readOnly = true)
    public OrderDtos.Response get(User buyer, Long id) {
        return orderRepository.findByIdAndBuyerId(id, buyer.getId()).map(OrderDtos.Response::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng"));
    }

    @Transactional(readOnly = true)
    public OrderDtos.ListResponse list(User buyer) {
        List<OrderDtos.Response> items = orderRepository.findByBuyerIdOrderByCreatedAtDesc(buyer.getId()).stream()
                .map(OrderDtos.Response::from).toList();
        return new OrderDtos.ListResponse(items);
    }

    @Transactional
    public OrderDtos.Response ship(User seller, Long id, OrderDtos.ShipRequest request) {
        Order order = orderRepository.findByIdAndSellerId(id, seller.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn bán"));
        if (request == null || request.carrier() == null || request.carrier().isBlank()
                || request.trackingCode() == null || request.trackingCode().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thiếu đơn vị vận chuyển hoặc mã vận đơn");
        }
        try { order.markShipped(request.carrier().trim(), request.trackingCode().trim()); }
        catch (IllegalStateException ex) { throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage()); }
        historyRepository.save(new OrderStatusHistory(order, Order.Status.SHIPPED.name(), seller.getId(), "Người bán đã gửi hàng"));
        return OrderDtos.Response.from(order);
    }

    @Transactional
    public OrderDtos.Response confirmDelivery(User buyer, Long id) {
        Order order = orderRepository.findByIdAndBuyerId(id, buyer.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng"));
        try { order.markDelivered(); }
        catch (IllegalStateException ex) { throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage()); }
        historyRepository.save(new OrderStatusHistory(order, Order.Status.DELIVERED.name(), buyer.getId(), "Người mua xác nhận đã nhận hàng"));
        return OrderDtos.Response.from(order);
    }

    @Transactional
    public OrderDtos.Response complete(User buyer, Long id) {
        if (ledgerRepository == null) throw new IllegalStateException("Ledger chưa được cấu hình");
        Order order = orderRepository.findByIdAndBuyerId(id, buyer.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng"));
        try { order.markCompleted(); }
        catch (IllegalStateException ex) { throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage()); }
        if (!ledgerRepository.existsByOrderIdAndType(order.getId(), LedgerEntry.Type.RELEASE)) {
            ledgerRepository.save(new LedgerEntry(order, order.getSeller(), LedgerEntry.Type.RELEASE, order.getTotalAmount()));
        }
        historyRepository.save(new OrderStatusHistory(order, Order.Status.COMPLETED.name(), buyer.getId(), "Giải ngân cho người bán"));
        return OrderDtos.Response.from(order);
    }

    private Order.DeliveryMethod parseMethod(String value) {
        try { return Order.DeliveryMethod.valueOf(value == null ? "SHIPPING" : value.trim().toUpperCase()); }
        catch (IllegalArgumentException ex) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phương thức giao hàng không hợp lệ"); }
    }
}
