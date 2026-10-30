package com.reownshop.order;

import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import com.reownshop.user.User;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {
    private final OrderService orderService;
    public OrderController(OrderService orderService) { this.orderService = orderService; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderDtos.Response create(@AuthenticationPrincipal User buyer,
            @RequestHeader(value = "Idempotency-Key", required = false) String key,
            @RequestBody OrderDtos.CreateRequest request) {
        return orderService.create(buyer, key == null ? UUID.randomUUID().toString() : key, request);
    }

    @GetMapping
    public OrderDtos.ListResponse list(@AuthenticationPrincipal User buyer) { return orderService.list(buyer); }

    @GetMapping("/{id}")
    public OrderDtos.Response get(@AuthenticationPrincipal User buyer, @PathVariable Long id) {
        return orderService.get(buyer, id);
    }

    @PostMapping("/{id}/ship")
    public OrderDtos.Response ship(@AuthenticationPrincipal User seller, @PathVariable Long id,
                                   @RequestBody OrderDtos.ShipRequest request) {
        return orderService.ship(seller, id, request);
    }

    @PostMapping("/{id}/confirm-delivery")
    public OrderDtos.Response confirmDelivery(@AuthenticationPrincipal User buyer, @PathVariable Long id) {
        return orderService.confirmDelivery(buyer, id);
    }

    @PostMapping("/{id}/complete")
    public OrderDtos.Response complete(@AuthenticationPrincipal User buyer, @PathVariable Long id) {
        return orderService.complete(buyer, id);
    }
}
