package net.journalApp.api.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class WeatherResponse {
    private Current current;

    @Getter
    @Setter
    public static class Current {
        @JsonProperty("temp_c")
        private double temperature;

        @JsonProperty("feelslike_c")
        private double feelslike;

        @JsonProperty("condition")
        private Condition condition;

        @Getter
        @Setter
        public static class Condition {
            private String text;
        }

        public List<String> getWeatherDescriptions() {
            if (condition != null && condition.getText() != null) {
                return List.of(condition.getText());
            }
            return null;
        }
    }

}
