package net.journalApp.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import net.journalApp.entity.JournalEntry;
import net.journalApp.entity.User;
import net.journalApp.service.JournalEntryService;
import net.journalApp.service.SentimentAnalysisService;
import net.journalApp.service.UserService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/journal")
@Tag(name = "Journal APIs")
@Slf4j
public class JournalEntryController {

    @Autowired
    private JournalEntryService journalEntryService;

    @Autowired
    private UserService userService;

    @Autowired
    private SentimentAnalysisService sentimentAnalysisService;

    @GetMapping
    @Operation(summary = "Get all journal entries of a user")
    public ResponseEntity<?> getAllJournalEntriesOfUser() {
        log.info("GET /journal request received");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        User user = userService.findByUserName(userName);
        List<JournalEntry> all = user.getJournalEntries();
        // Return empty list (200) instead of 404 so frontend can display "no entries" properly
        return new ResponseEntity<>(all != null ? all : new ArrayList<>(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<JournalEntry> createEntry(@RequestBody JournalEntry myEntry) {
        log.info("POST /journal request received for entry: {}", myEntry.getTitle());
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userName = authentication.getName();
            journalEntryService.saveEntry(myEntry, userName);
            return new ResponseEntity<>(myEntry, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("Error occurred while creating entry ", e);
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("id/{myId}")
    public ResponseEntity<?> getJournalEntryById(@PathVariable String myId) {
        ObjectId objectId = new ObjectId(myId);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        User user = userService.findByUserName(userName);
        // Use hex string comparison to avoid DBRef proxy issues
        List<JournalEntry> collect = user.getJournalEntries().stream()
                .filter(x -> x.getId() != null && x.getId().toHexString().equals(myId))
                .collect(Collectors.toList());
        if (!collect.isEmpty()) {
            Optional<JournalEntry> journalEntry = journalEntryService.findById(objectId);
            if (journalEntry.isPresent()) {
                return new ResponseEntity<>(journalEntry.get(), HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("id/{myId}")
    public ResponseEntity<?> deleteJournalEntryById(@PathVariable String myId) {
        ObjectId objectId = new ObjectId(myId);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        boolean removed = journalEntryService.deleteById(objectId, username);
        if (removed) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("id/{myId}")
    public ResponseEntity<?> updateJournalById(@PathVariable String myId, @RequestBody JournalEntry newEntry) {
        ObjectId objectId = new ObjectId(myId);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        User user = userService.findByUserName(userName);
        // Use hex string comparison to avoid DBRef proxy issues
        List<JournalEntry> collect = user.getJournalEntries().stream()
                .filter(x -> x.getId() != null && x.getId().toHexString().equals(myId))
                .collect(Collectors.toList());
        if (!collect.isEmpty()) {
            Optional<JournalEntry> journalEntry = journalEntryService.findById(objectId);
            if (journalEntry.isPresent()) {
                JournalEntry old = journalEntry.get();
                old.setTitle(newEntry.getTitle() != null && !newEntry.getTitle().equals("") ? newEntry.getTitle() : old.getTitle());
                boolean contentChanged = newEntry.getContent() != null && !newEntry.getContent().equals("") && !newEntry.getContent().equals(old.getContent());
                if (contentChanged) {
                    old.setContent(newEntry.getContent());
                    try {
                        old.setSentiment(sentimentAnalysisService.analyze(newEntry.getContent()));
                    } catch (Exception e) {
                        log.warn("Sentiment analysis failed on update", e);
                    }
                }
                journalEntryService.saveEntry(old);
                return new ResponseEntity<>(old, HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }


}

