
//Purpose: This is a service interface that defines the contract for user-related operations. 
// It declares a method createUser that takes a UserDto and returns a UserDto.

package FYP.LogicGates.service;

import java.util.List;

import FYP.LogicGates.dto.UserDto;

public interface UserService {
    UserDto createUser(UserDto userDto);
    
    UserDto getUserById(Long userId);

    List<UserDto> getAllUsers();

    UserDto updateUser(Long userId, UserDto updatedUser); 

    void deleteUser(Long userId);
}
