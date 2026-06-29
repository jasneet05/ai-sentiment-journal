package net.journalApp.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import net.journalApp.api.response.WeatherResponse;
import net.journalApp.entity.User;
import net.journalApp.repository.UserRepository;
import net.journalApp.service.UserService;
import net.journalApp.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@Tag(name = "User APIs", description = "Read, Update & Delete User")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WeatherService weatherService;

    @PutMapping
    public ResponseEntity<?> updateUser(@RequestBody User user) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        User userInDb = userService.findByUserName(userName);
        
        // Update fields if provided
        if (user.getUserName() != null && !user.getUserName().isEmpty()) {
            userInDb.setUserName(user.getUserName());
        }
        if (user.getEmail() != null && !user.getEmail().isEmpty()) {
            userInDb.setEmail(user.getEmail());
        }
        userInDb.setSentimentAnalysis(user.isSentimentAnalysis());
        
        // Only update password if provided and different
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            userInDb.setPassword(user.getPassword());
            userService.saveNewUser(userInDb); // saveNewUser encodes password
        } else {
            userService.saveUser(userInDb); // saveUser just saves to repo
        }
        
        return new ResponseEntity<>(userInDb, HttpStatus.OK);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteUserById() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userRepository.deleteByUserName(authentication.getName());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping
    public ResponseEntity<?> greeting() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        WeatherResponse weatherResponse = weatherService.getWeather("Mumbai");
        String greeting = "";
        if (weatherResponse != null && weatherResponse.getCurrent() != null) {
            greeting = ", Weather feels like " + weatherResponse.getCurrent().getFeelslike() + "°C in Mumbai";
        } else {
            greeting = ", Weather currently unavailable";
        }
        return new ResponseEntity<>("Hi " + authentication.getName() + greeting, HttpStatus.OK);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findByUserName(authentication.getName());
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

}

