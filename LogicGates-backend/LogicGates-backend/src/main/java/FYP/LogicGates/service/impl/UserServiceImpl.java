
// Purpose: This is the implementation of the UserService interface. It contains the actual business logic for CRUDing a user. 
// It uses the UserMapper to convert between UserDto and UserDetails, and the UserRepository to save the user to the database.

package FYP.LogicGates.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import FYP.LogicGates.dto.UserDto;
import FYP.LogicGates.mapper.UserMapper;
import FYP.LogicGates.repository.UserRepository;
import FYP.LogicGates.service.UserService;
import FYP.LogicGates.entity.UserDetails;
import FYP.LogicGates.exception.ResourceNotFoundException;
import lombok.AllArgsConstructor;


@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService{

    private UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(); // Add password encoder



    @Override
    public UserDto createUser(UserDto userDto, String password) {

        String hashedPassword = passwordEncoder.encode(password);

        UserDetails user = UserMapper.mapToUser(userDto, hashedPassword);
        UserDetails savedUser = userRepository.save(user);

        return UserMapper.mapToUserDto(savedUser);
    }

    @Override
    public UserDto getUserById(Long userId){
        UserDetails user = userRepository.findById(userId)
            .orElseThrow(() -> 
                    new ResourceNotFoundException("Employee does not exist with given id: " + userId));
        return UserMapper.mapToUserDto(user);
    }

    @Override
    public List<UserDto> getAllUsers(){
        List<UserDetails> users = userRepository.findAll();
        return users.stream().map((user) -> UserMapper.mapToUserDto(user))
            .collect(Collectors.toList());
    }

    @Override
    public UserDto updateUser(Long userId, UserDto updatedUser, String password) {
        UserDetails user = userRepository.findById(userId).orElseThrow(
            () -> new ResourceNotFoundException("User does not exist with given id: " + userId)
            );

            user.setUserName(updatedUser.getUsername());

            if (password != null && !password.isEmpty()) {
                String hashedPassword = passwordEncoder.encode(password);
                user.setPassword(hashedPassword);
            }

            user.setEmail(updatedUser.getEmail());

            UserDetails updatedUserObj = userRepository.save(user);
        
            return UserMapper.mapToUserDto(updatedUserObj);
    }

    @Override
    public void deleteUser(Long userId) {
        UserDetails user = userRepository.findById(userId).orElseThrow(
            () -> new ResourceNotFoundException("User does not exist with given id: " + userId)
            );

        userRepository.deleteById(userId);

    }

    @Override
    public UserDto loginUser(String username, String password) {
        UserDetails user = userRepository.findByUsername(username);

        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            throw new ResourceNotFoundException("Invalid username or password");
        }

        return UserMapper.mapToUserDto(user);
    }

    
}
