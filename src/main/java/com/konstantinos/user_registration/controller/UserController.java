package com.konstantinos.user_registration.controller;

import com.konstantinos.user_registration.dto.UserCreateRequest;
import com.konstantinos.user_registration.dto.UserDetailsResponse;
import com.konstantinos.user_registration.dto.UserSummaryResponse;
import com.konstantinos.user_registration.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }

    @GetMapping
    public List<UserSummaryResponse> getAllUsers(){
        return userService.findAll();
    }

    @GetMapping("/{id}")
    public UserDetailsResponse getUserById(@PathVariable Long id) {
        return userService.findById(id);
    }
    @PostMapping
    public ResponseEntity<UserDetailsResponse> createUser(@Valid @RequestBody UserCreateRequest request) {
        UserDetailsResponse created = userService.create(request);
        URI location = URI.create("/api/users/" + created.id());
        return ResponseEntity.created(location).body(created);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id) {
        userService.delete(id);
    }
}
