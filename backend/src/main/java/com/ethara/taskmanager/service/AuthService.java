package com.ethara.taskmanager.service;

import com.ethara.taskmanager.dto.JwtResponse;
import com.ethara.taskmanager.dto.LoginRequest;
import com.ethara.taskmanager.dto.SignupRequest;
import com.ethara.taskmanager.entity.Role;
import com.ethara.taskmanager.entity.User;
import com.ethara.taskmanager.repository.UserRepository;
import com.ethara.taskmanager.security.JwtUtils;
import com.ethara.taskmanager.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        return new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getName(),
                userDetails.getEmail(),
                role);
    }

    public void registerUser(SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        // Determine role from request, default to ROLE_USER
        Role role = Role.ROLE_USER;
        if (signUpRequest.getRole() != null && signUpRequest.getRole().equalsIgnoreCase("ADMIN")) {
            role = Role.ROLE_ADMIN;
        }

        // Create new user's account
        User user = new User(null,
                signUpRequest.getName(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()),
                role);

        userRepository.save(user);
    }
}
