package com.reownshop.listing;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;

public interface ListingRepository extends JpaRepository<Listing, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select l from Listing l join fetch l.seller where l.id = :id")
    Optional<Listing> findByIdForUpdate(@Param("id") Long id);

    @Query(value = """
            SELECT l.* FROM listings l
            WHERE l.status = 'ACTIVE'
              AND (:keyword IS NULL OR unaccent(lower(l.title)) LIKE '%' || unaccent(lower(CAST(:keyword AS text))) || '%')
              AND (:categoryId IS NULL OR l.category_id = :categoryId)
              AND (:minPrice IS NULL OR l.price >= :minPrice)
              AND (:maxPrice IS NULL OR l.price <= :maxPrice)
            ORDER BY l.bumped_at DESC
            """, countQuery = """
            SELECT count(*) FROM listings l
            WHERE l.status = 'ACTIVE'
              AND (:keyword IS NULL OR unaccent(lower(l.title)) LIKE '%' || unaccent(lower(CAST(:keyword AS text))) || '%')
              AND (:categoryId IS NULL OR l.category_id = :categoryId)
              AND (:minPrice IS NULL OR l.price >= :minPrice)
              AND (:maxPrice IS NULL OR l.price <= :maxPrice)
            """, nativeQuery = true)
    Page<Listing> search(@Param("keyword") String keyword,
                         @Param("categoryId") Integer categoryId,
                         @Param("minPrice") Long minPrice,
                         @Param("maxPrice") Long maxPrice,
                         Pageable pageable);

    @Query("select l from Listing l join fetch l.seller join fetch l.category left join fetch l.images where l.id = :id")
    Optional<Listing> findDetailById(@Param("id") Long id);
}
