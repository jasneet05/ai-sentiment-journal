package net.journalApp.service;

import com.fasterxml.jackson.databind.JsonNode;
import net.journalApp.enums.Sentiment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;

@Service
public class SentimentAnalysisService {

    private static final Logger log = LoggerFactory.getLogger(SentimentAnalysisService.class);

    private static final Map<Sentiment, List<String>> KEYWORDS = new HashMap<>();

    static {
        KEYWORDS.put(Sentiment.HAPPY, Arrays.asList(
                "happy", "great", "wonderful", "amazing", "good", "fantastic",
                "love", "beautiful", "joy", "excited", "grateful", "awesome",
                "fun", "lovely", "nice", "glad", "blessed", "cheerful",
                "delighted", "pleased", "excellent", "perfect", "best", "smile"));

        KEYWORDS.put(Sentiment.SAD, Arrays.asList(
                "sad", "unhappy", "depressed", "disappointed", "upset", "lonely",
                "hurt", "crying", "cry", "tears", "gloomy", "miserable",
                "heartbroken", "sorrow", "grief", "blue", "down", "low",
                "hopeless", "regret", "miss", "lost", "alone", "pain"));

        KEYWORDS.put(Sentiment.ANGRY, Arrays.asList(
                "angry", "mad", "furious", "frustrated", "annoyed", "irritated",
                "rage", "hate", "terrible", "awful", "horrible", "livid",
                "outraged", "infuriated", "bitter", "hostile", "destroy",
                "ruined", "worst", "stupid", "damn"));

        KEYWORDS.put(Sentiment.ANXIOUS, Arrays.asList(
                "anxious", "nervous", "worried", "scared", "afraid", "stressed",
                "panic", "fearful", "uneasy", "tense", "overwhelmed", "concerned",
                "restless", "terrified", "dread", "uncertain", "confused",
                "doubt", "insecure", "pressure"));
    }

    private final WebClient webClient;

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${gemini.api.model:gemini-2.0-flash}")
    private String model;

    public SentimentAnalysisService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://generativelanguage.googleapis.com").build();
    }

    public Sentiment analyze(String text) {
        if (text == null || text.trim().isEmpty()) {
            return null;
        }

        Sentiment geminiResult = tryGeminiApi(text);
        if (geminiResult != null) {
            return geminiResult;
        }

        log.info("Falling back to keyword-based sentiment analysis");
        return analyzeWithKeywords(text);
    }

    private Sentiment tryGeminiApi(String text) {
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("dummy")) {
            log.warn("Gemini API key is not configured, using keyword fallback");
            return null;
        }

        try {
            String prompt = "Classify the sentiment of this journal entry into exactly one word: " +
                    "HAPPY, SAD, ANGRY, or ANXIOUS. Return only the word, nothing else.\n\nEntry: " + text;

            Map<String, Object> textPart = new HashMap<>();
            textPart.put("text", prompt);

            Map<String, Object> partWrapper = new HashMap<>();
            partWrapper.put("parts", Collections.singletonList(textPart));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", Collections.singletonList(partWrapper));

            JsonNode response = webClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/v1beta/models/{model}:generateContent")
                            .queryParam("key", apiKey)
                            .build(model))
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();

            if (response == null || !response.has("candidates")) {
                log.warn("Invalid or empty response from Gemini API");
                return null;
            }

            JsonNode candidates = response.path("candidates");
            if (!candidates.isArray() || candidates.size() == 0) {
                log.warn("No candidates in Gemini response");
                return null;
            }

            String result = candidates.get(0)
                    .path("content").path("parts").get(0)
                    .path("text").asText()
                    .trim()
                    .toUpperCase();

            if (result.isEmpty()) {
                log.warn("Empty sentiment result from Gemini");
                return null;
            }

            return Sentiment.valueOf(result);

        } catch (IllegalArgumentException e) {
            log.warn("Unrecognized sentiment value from Gemini: {}", e.getMessage());
            return null;
        } catch (Exception e) {
            log.error("Gemini API call failed ({}), using keyword fallback", e.getMessage());
            return null;
        }
    }

    private Sentiment analyzeWithKeywords(String text) {
        String lowerText = text.toLowerCase();
        Map<Sentiment, Integer> scores = new HashMap<>();

        for (Map.Entry<Sentiment, List<String>> entry : KEYWORDS.entrySet()) {
            int count = 0;
            for (String keyword : entry.getValue()) {
                if (lowerText.contains(keyword)) {
                    count++;
                }
            }
            if (count > 0) {
                scores.put(entry.getKey(), count);
            }
        }

        return scores.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);
    }
}
