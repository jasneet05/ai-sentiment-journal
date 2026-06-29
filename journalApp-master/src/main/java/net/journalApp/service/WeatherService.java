package net.journalApp.service;

import net.journalApp.api.response.WeatherResponse;
import net.journalApp.cache.AppCache;
import net.journalApp.constants.Placeholders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WeatherService {
    @Value("${weather.api.key}")
    private String apiKey;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private AppCache appCache;

    @Autowired
    private RedisService redisService;

    public WeatherResponse getWeather(String city) {
        try {
            WeatherResponse weatherResponse = redisService.get("weather_of_" + city, WeatherResponse.class);
            if (weatherResponse != null) {
                return weatherResponse;
            } else {
                String apiConfig = appCache.appCache.get(AppCache.keys.WEATHER_API.toString());
                if (apiConfig == null) return null;
                
                String finalAPI = apiConfig.replace(Placeholders.CITY, city).replace(Placeholders.API_KEY, apiKey);
                ResponseEntity<WeatherResponse> response = restTemplate.exchange(finalAPI, HttpMethod.GET, null, WeatherResponse.class);
                WeatherResponse body = response.getBody();
                if (body != null && body.getCurrent() != null) {
                    redisService.set("weather_of_" + city, body, 300l);
                    return body;
                }
            }
        } catch (Exception e) {
            // Log error but don't crash
            return null;
        }
        return null;
    }
}
