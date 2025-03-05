
// Purpose: This is the implementation of the UserService interface. It contains the actual business logic for CRUDing a user. 
// It uses the UserMapper to convert between UserDto and UserDetails, and the UserRepository to save the user to the database.

package FYP.LogicGates.service.impl;

import java.util.List;
import java.util.stream.Collectors;

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
    @Override
    public UserDto createUser(UserDto userDto) {

        UserDetails user = UserMapper.mapToUser(userDto);
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
    public UserDto updateUser(Long userId, UserDto updatedUser) {
        UserDetails user = userRepository.findById(userId).orElseThrow(
            () -> new ResourceNotFoundException("User does not exist with given id: " + userId)
            );

            user.setUserName(updatedUser.getUsername());
            user.setPassword(updatedUser.getPassword());
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

    
}
