package com.konstantinos.user_registration.service;

import com.konstantinos.user_registration.dto.UserCreateRequest;
import com.konstantinos.user_registration.dto.UserDetailsResponse;
import com.konstantinos.user_registration.dto.UserSummaryResponse;

import java.util.List;

public interface UserService {
    List<UserSummaryResponse> findAll();

    UserDetailsResponse findById(Long id);

    UserDetailsResponse create(UserCreateRequest request);

    void delete(Long id);
}
