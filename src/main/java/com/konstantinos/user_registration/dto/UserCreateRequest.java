package com.konstantinos.user_registration.dto;

import com.konstantinos.user_registration.entity.Gender;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UserCreateRequest(  @NotBlank(message = "Name is required")
                                  @Size(max = 100, message = "Name must be at most 100 characters")
                                  String name,

                                  @NotBlank(message = "Surname is required")
                                  @Size(max = 100, message = "Surname must be at most 100 characters")
                                  String surname,

                                  @NotNull(message = "Gender is required")
                                  Gender gender,

                                  @NotNull(message = "Birthdate is required")
                                  @Past(message = "Birthdate must be in the past")
                                  LocalDate birthdate,

                                  @Size(max = 500, message = "Work address must be at most 500 characters")
                                  String workAddress,

                                  @Size(max = 500, message = "Home address must be at most 500 characters")
                                  String homeAddress)

{
}
