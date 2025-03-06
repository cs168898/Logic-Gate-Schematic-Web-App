// This java file contains static methods to convert between UserDetails and UserDto. 
// It helps in transforming data between the entity and the DTO, ensuring that only the necessary data is exposed to the client.


package FYP.LogicGates.mapper;

import org.springframework.boot.autoconfigure.security.SecurityProperties.User;

import FYP.LogicGates.dto.UserDto;
import FYP.LogicGates.entity.UserDetails;

public class UserMapper {
    public static UserDto mapToUserDto(UserDetails user){
        return new UserDto(
            user.getId(),
            user.getUserName(),
            user.getEmail()
        );
    }

    public static UserDetails mapToUser(UserDto userDto, String password){
        return new UserDetails(
            userDto.getId(),
            userDto.getUsername(),
            password,
            userDto.getEmail()
        );
    }
}
