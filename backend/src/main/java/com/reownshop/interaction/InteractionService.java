package com.reownshop.interaction;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.reownshop.listing.ListingRepository;
import com.reownshop.user.User;

@Service
public class InteractionService {
    private final FavoriteRepository favoriteRepository;
    private final NotificationRepository notificationRepository;
    private final ListingRepository listingRepository;

    public InteractionService(FavoriteRepository favoriteRepository, NotificationRepository notificationRepository,
                              ListingRepository listingRepository) {
        this.favoriteRepository = favoriteRepository; this.notificationRepository = notificationRepository; this.listingRepository = listingRepository;
    }

    @Transactional
    public void addFavorite(User user, Long listingId) {
        if (favoriteRepository.findByUserIdAndListingId(user.getId(), listingId).isPresent()) return;
        var listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tin đăng"));
        favoriteRepository.save(new Favorite(user, listing));
    }

    @Transactional
    public void removeFavorite(User user, Long listingId) {
        favoriteRepository.findByUserIdAndListingId(user.getId(), listingId).ifPresent(favoriteRepository::delete);
    }

    @Transactional(readOnly = true)
    public List<InteractionDtos.FavoriteResponse> favorites(User user) {
        return favoriteRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream().map(favorite -> {
            long current = favorite.getListing().getPrice();
            return new InteractionDtos.FavoriteResponse(favorite.getListing().getId(), favorite.getListing().getTitle(), current,
                    favorite.getPriceAtSave(), current < favorite.getPriceAtSave());
        }).toList();
    }

    @Transactional(readOnly = true)
    public InteractionDtos.NotificationList notifications(User user) {
        return new InteractionDtos.NotificationList(notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(n -> new InteractionDtos.NotificationResponse(n.getId(), n.getType().name(), n.getTitle(), n.getBody(), n.isRead(), n.getCreatedAt())).toList());
    }

    @Transactional
    public void markNotificationRead(User user, Long id) {
        notificationRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy thông báo")).markRead();
    }
}
