package net.journalApp.entity;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.*;
import net.journalApp.enums.Sentiment;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.Date;

@Document(collection = "journal_entries")
@Data
@NoArgsConstructor
public class JournalEntry {
    @Id
    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId id;
    @NonNull
    private String title;
    private String content;
    private LocalDateTime date;
    private Sentiment sentiment;
}

