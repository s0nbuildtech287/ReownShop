package com.reownshop.interaction;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.reownshop.user.User;

@RestController
@RequestMapping("/api/v1")
public class InteractionController {
    private final InteractionService interactionService;
    public InteractionController(InteractionService interactionService) { this.interactionService = interactionService; }

    @GetMapping("/favorites")
    public List<InteractionDtos.FavoriteResponse> favorites(@AuthenticationPrincipal User user) { return interactionService.favorites(user); }
    @PostMapping("/favorites/{listingId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void addFavorite(@AuthenticationPrincipal User user, @PathVariable Long listingId) { interactionService.addFavorite(user, listingId); }
    @DeleteMapping("/favorites/{listingId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeFavorite(@AuthenticationPrincipal User user, @PathVariable Long listingId) { interactionService.removeFavorite(user, listingId); }

    @GetMapping("/notifications")
    public InteractionDtos.NotificationList notifications(@AuthenticationPrincipal User user) { return interactionService.notifications(user); }
    @PostMapping("/notifications/{id}/read")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void markRead(@AuthenticationPrincipal User user, @PathVariable Long id) { interactionService.markNotificationRead(user, id); }
}
