package net.journalApp.service;

import net.journalApp.entity.User;
import net.journalApp.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.ActiveProfiles;

import java.util.ArrayList;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("dev")
public class UserDetailsServiceImplTests {

    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;

    @Mock
    private UserRepository userRepository;

    @Test
    void loadUserByUsernameTest(){
        when(userRepository.findByUserName(ArgumentMatchers.anyString())).thenReturn(User.builder().userName("ram").password("inrinrick").roles(new ArrayList<>()).build());
        UserDetails user = userDetailsService.loadUserByUsername("ram");
        Assertions.assertNotNull(user);
    }
}
