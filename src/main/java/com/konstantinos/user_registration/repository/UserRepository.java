package com.konstantinos.user_registration.repository;

import com.konstantinos.user_registration.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    @EntityGraph(attributePaths = "addresses")
    Optional<User> findWithAddressesById(Long id);

}
