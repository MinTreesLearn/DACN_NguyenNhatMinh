package com.luxury.ecommerce.service;

import com.luxury.ecommerce.dto.ChatResponse;
import com.luxury.ecommerce.entity.ChatHistory;
import com.luxury.ecommerce.entity.Product;
import com.luxury.ecommerce.entity.User;
import com.luxury.ecommerce.repository.ChatHistoryRepository;
import com.luxury.ecommerce.repository.ProductRepository;
import com.luxury.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AiStylistService {

    @Autowired
    private ChatHistoryRepository chatHistoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public ChatResponse generateRecommendation(Long userId, String prompt) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Simple keyword-based recommendation logic (can be replaced with actual AI)
        String response = generateResponse(prompt, user);
        List<Product> recommendedProducts = getRecommendedProducts(prompt, user);

        // Save chat history
        ChatHistory chatHistory = new ChatHistory();
        chatHistory.setUser(user);
        chatHistory.setPrompt(prompt);
        chatHistory.setResponse(response);
        chatHistory.setRecommendedProducts(
                recommendedProducts.stream()
                        .map(p -> p.getId().toString())
                        .collect(Collectors.joining(","))
        );
        chatHistoryRepository.save(chatHistory);

        return new ChatResponse(response, recommendedProducts);
    }

    private String generateResponse(String prompt, User user) {
        String lowerPrompt = prompt.toLowerCase();

        if (lowerPrompt.contains("đi chơi") || lowerPrompt.contains("casual") || lowerPrompt.contains("hang out")) {
            return "Tôi gợi ý bạn nên mặc outfit casual, thoải mái và năng động! "
                    + "Kết hợp áo thun/polo với quần jeans và giày sneakers sẽ rất phù hợp. "
                    + getUserStyleHint(user);
        } else if (lowerPrompt.contains("đi tiệc") || lowerPrompt.contains("party") || lowerPrompt.contains("formal")) {
            return "Cho buổi tiệc, bạn nên chọn trang phục sang trọng! "
                    + "Váy cocktail hoặc suit lịch lãm kết hợp với giày cao gót/oxford sẽ làm bạn nổi bật. "
                    + getUserStyleHint(user);
        } else if (lowerPrompt.contains("đi học") || lowerPrompt.contains("school") || lowerPrompt.contains("work")) {
            return "Cho môi trường học tập/làm việc, trang phục nên gọn gàng và lịch sự! "
                    + "Áo sơ mi/blazer với quần âu và giày tây/giày búp bê là lựa chọn hoàn hảo. "
                    + getUserStyleHint(user);
        } else if (lowerPrompt.contains("mùa hè") || lowerPrompt.contains("summer")) {
            return "Cho mùa hè, bạn nên chọn trang phục nhẹ nhàng, thoáng mát! "
                    + "Áo thun cotton, quần short và sandals sẽ giúp bạn thoải mái trong thời tiết nóng. "
                    + getUserStyleHint(user);
        } else {
            return "Tôi sẽ giúp bạn tìm những outfit phù hợp nhất! "
                    + "Dưới đây là một số sản phẩm được chọn lọc dựa trên phong cách của bạn. "
                    + getUserStyleHint(user);
        }
    }

    private String getUserStyleHint(User user) {
        if (user.getStyle() != null) {
            return String.format("Dựa trên phong cách %s của bạn, tôi đã chọn những món đồ phù hợp nhất.",
                    user.getStyle());
        }
        return "Hãy cập nhật phong cách yêu thích trong profile để nhận gợi ý cá nhân hóa hơn!";
    }

    private List<Product> getRecommendedProducts(String prompt, User user) {
        List<Product> allProducts = productRepository.findAll();
        List<Product> recommended = new ArrayList<>();

        String lowerPrompt = prompt.toLowerCase();

        // Filter based on keywords and user preferences
        for (Product product : allProducts) {
            boolean matches = false;

            if (lowerPrompt.contains("đi chơi") || lowerPrompt.contains("casual")) {
                matches = product.getCategory() != null &&
                         (product.getCategory().equalsIgnoreCase("casual") ||
                          product.getCategory().equalsIgnoreCase("áo") ||
                          product.getCategory().equalsIgnoreCase("quần"));
            } else if (lowerPrompt.contains("đi tiệc") || lowerPrompt.contains("formal")) {
                matches = product.getIsPremium() != null && product.getIsPremium();
            } else if (lowerPrompt.contains("đi học") || lowerPrompt.contains("work")) {
                matches = product.getCategory() != null &&
                         (product.getCategory().equalsIgnoreCase("formal") ||
                          product.getCategory().equalsIgnoreCase("áo"));
            }

            // Apply user style preference
            if (user.getStyle() != null && product.getCategory() != null) {
                if (user.getStyle().equalsIgnoreCase(product.getCategory())) {
                    matches = true;
                }
            }

            // Apply color preference
            if (user.getFavoriteColor() != null && product.getColor() != null) {
                if (user.getFavoriteColor().equalsIgnoreCase(product.getColor())) {
                    matches = true;
                }
            }

            if (matches) {
                recommended.add(product);
            }
        }

        // If no matches, return some products anyway
        if (recommended.isEmpty()) {
            return allProducts.stream().limit(3).collect(Collectors.toList());
        }

        return recommended.stream().limit(6).collect(Collectors.toList());
    }

    public List<ChatHistory> getChatHistory(Long userId) {
        return chatHistoryRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
