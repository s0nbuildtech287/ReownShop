package com.reownshop.chat;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import com.reownshop.user.User;

@RestController
@RequestMapping("/api/v1/chat")
public class ChatController {
    private final ChatService chatService;
    public ChatController(ChatService chatService) { this.chatService = chatService; }
    @GetMapping("/conversations") public List<ChatDtos.ConversationResponse> conversations(@AuthenticationPrincipal User user) { return chatService.conversations(user); }
    @PostMapping("/conversations") @ResponseStatus(HttpStatus.CREATED)
    public ChatDtos.ConversationResponse open(@AuthenticationPrincipal User user, @RequestBody ChatDtos.ConversationRequest request) { return chatService.open(user, request); }
    @GetMapping("/conversations/{id}/messages") public ChatDtos.MessageList messages(@AuthenticationPrincipal User user, @PathVariable Long id) { return chatService.messages(user, id); }
    @PostMapping("/conversations/{id}/messages") @ResponseStatus(HttpStatus.CREATED)
    public ChatDtos.MessageResponse send(@AuthenticationPrincipal User user, @PathVariable Long id, @RequestBody ChatDtos.MessageRequest request) { return chatService.send(user, id, request); }
}
