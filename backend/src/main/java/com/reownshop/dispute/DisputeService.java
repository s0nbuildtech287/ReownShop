package com.reownshop.dispute;

import java.util.Locale;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.reownshop.order.Order;
import com.reownshop.order.OrderRepository;
import com.reownshop.user.User;

@Service
public class DisputeService {
    private final DisputeRepository disputeRepository;
    private final OrderRepository orderRepository;

    public DisputeService(DisputeRepository disputeRepository, OrderRepository orderRepository) {
        this.disputeRepository = disputeRepository; this.orderRepository = orderRepository;
    }

    @Transactional
    public DisputeDtos.Response open(User buyer, Long orderId, DisputeDtos.CreateRequest request) {
        Order order = orderRepository.findByIdAndBuyerId(orderId, buyer.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng"));
        if (order.getStatus() != Order.Status.SHIPPED && order.getStatus() != Order.Status.DELIVERED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Đơn hàng chưa ở trạng thái có thể khiếu nại");
        }
        if (disputeRepository.findByOrderId(orderId).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Đơn hàng đã có khiếu nại");
        }
        if (request == null || request.description() == null || request.description().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mô tả khiếu nại không được để trống");
        }
        try {
            Dispute dispute = new Dispute(order, buyer, Dispute.Reason.valueOf(request.reason().toUpperCase(Locale.ROOT)),
                    request.description().trim(), Dispute.DesiredResolution.valueOf(request.desiredResolution().toUpperCase(Locale.ROOT)));
            return DisputeDtos.Response.from(disputeRepository.save(dispute));
        } catch (NullPointerException | IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Lý do hoặc hướng xử lý không hợp lệ");
        }
    }

    @Transactional(readOnly = true)
    public DisputeDtos.Response get(User buyer, Long id) {
        return disputeRepository.findByIdAndOpenedById(id, buyer.getId()).map(DisputeDtos.Response::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy khiếu nại"));
    }
}
