package com.konstantinos.user_registration.service;

import com.konstantinos.user_registration.dto.UserCreateRequest;
import com.konstantinos.user_registration.dto.UserDetailsResponse;
import com.konstantinos.user_registration.dto.UserSummaryResponse;

import com.konstantinos.user_registration.entity.Address;
import com.konstantinos.user_registration.entity.AddressType;
import com.konstantinos.user_registration.entity.User;
import com.konstantinos.user_registration.exception.UserNotFoundException;
import com.konstantinos.user_registration.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Service
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<UserSummaryResponse> findAll() {
        return userRepository.findAll(Sort.by("surname", "name"))
                .stream()
                .map(user -> new UserSummaryResponse(user.getId(), user.getName(), user.getSurname()))
                .toList();
    }

    @Override
    public UserDetailsResponse findById(Long id) {
        User user = userRepository.findWithAddressesById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        return toDetailsResponse(user);
    }

    @Override
    @Transactional
    public UserDetailsResponse create(UserCreateRequest request) {
        User user = new User();
        user.setName(request.name().trim());
        user.setSurname(request.surname().trim());
        user.setGender(request.gender());
        user.setBirthdate(request.birthdate());

        addAddressIfPresent(user, AddressType.WORK, request.workAddress());
        addAddressIfPresent(user, AddressType.HOME, request.homeAddress());

        User saved = userRepository.save(user);
        return toDetailsResponse(saved);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        userRepository.delete(user);
    }

    private void addAddressIfPresent(User user, AddressType type, String text) {
        if (text != null && !text.isBlank()) {
            Address address = new Address();
            address.setType(type);
            address.setFullAddress(text.trim());
            user.addAddress(address);
        }
    }
    private UserDetailsResponse toDetailsResponse(User user) {
        return new UserDetailsResponse(
                user.getId(),
                user.getName(),
                user.getSurname(),
                user.getGender(),
                user.getBirthdate(),
                findAddress(user, AddressType.WORK),
                findAddress(user, AddressType.HOME)
        );
    }

    private String findAddress(User user, AddressType addressType) {
        return user.getAddresses()
                .stream()
                .filter(address -> address.getType() == addressType)
                .map(Address::getFullAddress)
                .findFirst()
                .orElse(null);
    }
}
