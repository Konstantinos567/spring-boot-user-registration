package com.konstantinos.user_registration.dto;

import com.konstantinos.user_registration.entity.Gender;

import java.time.LocalDate;

public record UserDetailsResponse(Long id,
                                  String name,
                                  String surname,
                                  Gender gender,
                                  LocalDate birthdate,
                                  String workAddress,
                                  String homeAddress) {
}
