
// Purpose: This is a Data Transfer Object (DTO) used to transfer user data between the client and the server. 
// It is a simplified version of the UserDetails entity, often used to expose only the necessary data to the client.

package FYP.LogicGates.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class UserDto {
    private Long id;
    private String username;
    private String password;
    private String email;
}
