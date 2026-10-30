package com.reownshop.dispute;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DisputeRepository extends JpaRepository<Dispute, Long> {
    Optional<Dispute> findByOrderId(Long orderId);
    Optional<Dispute> findByIdAndOpenedById(Long id, Long openedById);
}
