
//Purpose: This is a service interface that defines the contract for user-related operations. 
// It declares a method createUser that takes a UserDto and returns a UserDto.

package FYP.LogicGates.service;

import java.util.List;

import FYP.LogicGates.dto.UserDto;

public interface UserService {
    UserDto createUser(UserDto userDto, String password);
    
    UserDto getUserById(Long userId);

    List<UserDto> getAllUsers();

    UserDto updateUser(Long userId, UserDto updatedUser, String password); 

    void deleteUser(Long userId);

    UserDto loginUser(String username, String password);

    Boolean existByUsername(String username);

    Boolean existByEmail(String email);
}
