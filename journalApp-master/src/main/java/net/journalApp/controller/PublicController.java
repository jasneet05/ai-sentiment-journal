package net.journalApp.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import net.journalApp.dto.UserDTO;
import net.journalApp.entity.User;
import net.journalApp.service.UserDetailsServiceImpl;
import net.journalApp.service.UserService;
import net.journalApp.utilis.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/public")
@Slf4j
@Tag(name = "Public APIs")
public class PublicController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserDetailsServiceImpl userDetailsService;
    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/health-check")
    public String healthCheck() {
        log.info("Health is ok !");
        return "Ok";
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserDTO user) {
        log.info("Received signup request for user: {}", user.getUserName());
        User newUser = new User();
        newUser.setEmail(user.getEmail());
        newUser.setUserName(user.getUserName());
        newUser.setPassword(user.getPassword());
        newUser.setSentimentAnalysis(user.isSentimentAnalysis());
        if (userService.saveNewUser(newUser)) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user) {
        try {
            //validates:
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUserName(), user.getPassword()));
            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUserName());
            String jwt = jwtUtil.generateToken(userDetails.getUsername());
            return new ResponseEntity<>(jwt, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Exception occurred while createAuthenticationToken ", e);
            return new ResponseEntity<>("Incorrect username or password", HttpStatus.BAD_REQUEST);
        }
    }
}
