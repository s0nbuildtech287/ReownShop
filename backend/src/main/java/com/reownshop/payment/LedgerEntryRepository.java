package com.reownshop.payment;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LedgerEntryRepository extends JpaRepository<LedgerEntry, Long> {
    boolean existsByOrderIdAndType(Long orderId, LedgerEntry.Type type);
}
