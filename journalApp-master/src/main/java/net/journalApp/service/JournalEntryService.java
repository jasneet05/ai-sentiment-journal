package net.journalApp.service;

import lombok.extern.slf4j.Slf4j;
import net.journalApp.entity.JournalEntry;
import net.journalApp.entity.User;
import net.journalApp.repository.JournalEntryRepository;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class JournalEntryService {

    @Autowired
    private JournalEntryRepository journalEntryRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private SentimentAnalysisService sentimentAnalysisService;

    @Transactional
    public void saveEntry(JournalEntry journalEntry, String userName) {
        try {
            User user = userService.findByUserName(userName);
            journalEntry.setDate(LocalDateTime.now());

            if (journalEntry.getContent() != null && !journalEntry.getContent().isEmpty() && journalEntry.getSentiment() == null) {
                try {
                    journalEntry.setSentiment(sentimentAnalysisService.analyze(journalEntry.getContent()));
                } catch (Exception e) {
                    log.warn("Sentiment analysis failed, saving without sentiment", e);
                }
            }

            JournalEntry saved = journalEntryRepository.save(journalEntry);
            user.getJournalEntries().add(saved);
            userService.saveUser(user);
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while saving the entry.", e);
        }
    }

    public void saveEntry(JournalEntry journalEntry) {
        journalEntryRepository.save(journalEntry);
    }

    public List<JournalEntry> getAll() {
        return journalEntryRepository.findAll();
    }

    public Optional<JournalEntry> findById(ObjectId id) {
        return journalEntryRepository.findById(id);
    }

    @Transactional
    public boolean deleteById(ObjectId id, String userName) {
        boolean removed = false;
        try {
            User user = userService.findByUserName(userName);
            log.info("Attempting to delete entry with id: {}", id.toHexString());
            log.info("User journal entries count: {}", user.getJournalEntries().size());
            user.getJournalEntries().forEach(e -> log.info("  -> entry id in user: {}", e.getId()));

            // Compare hex strings to avoid DBRef proxy ObjectId equality issues
            removed = user.getJournalEntries().removeIf(x -> {
                if (x.getId() == null) return false;
                return x.getId().toHexString().equals(id.toHexString());
            });

            log.info("removeIf result (removed={})", removed);

            if (removed) {
                userService.saveUser(user);
                journalEntryRepository.deleteById(id);
                log.info("Entry {} deleted from DB and user list", id.toHexString());
            } else {
                // Entry may not be in the user's list anymore; delete from DB anyway
                log.warn("Entry {} not found in user's journal list, deleting from DB directly", id.toHexString());
                journalEntryRepository.deleteById(id);
                removed = true;
            }
        } catch (Exception e) {
            log.error("Error deleting entry", e);
            throw new RuntimeException("An error occurred while deleting the entry.", e);
        }
        return removed;
    }

}
