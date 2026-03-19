package com.luxury.ecommerce.controller;

import com.luxury.ecommerce.dto.ApiResponse;
import com.luxury.ecommerce.dto.ChatRequest;
import com.luxury.ecommerce.dto.ChatResponse;
import com.luxury.ecommerce.entity.ChatHistory;
import com.luxury.ecommerce.service.AiStylistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai-stylist")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AiStylistController {

    @Autowired
    private AiStylistService aiStylistService;

    @PostMapping("/user/{userId}/chat")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ChatResponse>> chat(
            @PathVariable Long userId,
            @RequestBody ChatRequest request) {
        try {
            ChatResponse response = aiStylistService.generateRecommendation(userId, request.getPrompt());
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}/history")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<ChatHistory>>> getChatHistory(@PathVariable Long userId) {
        try {
            List<ChatHistory> history = aiStylistService.getChatHistory(userId);
            return ResponseEntity.ok(ApiResponse.success(history));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}
