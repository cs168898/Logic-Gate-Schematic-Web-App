
// Purpose: This is a REST controller that handles HTTP requests related to user operations. 
// It provides an endpoint to create a new user. It uses the UserService to perform the actual business logic.

package FYP.LogicGates.controller;

import java.util.List;

import org.apache.catalina.connector.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import FYP.LogicGates.dto.LoginRequest;
import FYP.LogicGates.dto.UserDto;
import FYP.LogicGates.service.UserService;

import lombok.AllArgsConstructor;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;


@CrossOrigin(origins = "http://localhost:3000")
@AllArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {

    private UserService UserService;

    // Build Add User REST API
    @PostMapping("/register")
    public ResponseEntity<UserDto> createUser(@RequestBody UserDto UserDto, @RequestParam String password){
        UserDto savedUser = UserService.createUser(UserDto, password);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED); 
    }

    // Build Get User REST API
    @GetMapping("{userId}")
    public ResponseEntity<UserDto> getUserById(@PathVariable("userId") Long userId){
        UserDto userDto = UserService.getUserById(userId);
        return ResponseEntity.ok(userDto);

    }
    
    // Build GetAllUsers REST API
    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers(){
        List<UserDto> users = UserService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // Build Update User REST API
    @PutMapping("{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable("id") Long userId, 
                                              @RequestBody UserDto updatedUser,
                                              @RequestParam(required = false) String password){
        UserDto userDto = UserService.updateUser(userId, updatedUser, password);
        return ResponseEntity.ok(userDto);
    }

    // Build Delete User REST API
    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteUser(@PathVariable("id") Long userId){
        UserService.deleteUser(userId);
        return ResponseEntity.ok("Employee Deleted Successfully");
    }

    // Build Login User REST API
    @PostMapping("/login")
    public ResponseEntity<UserDto> loginUser(@RequestBody LoginRequest loginRequest) {
        UserDto userDto = UserService.loginUser(loginRequest.getUsername(), loginRequest.getPassword());
        return ResponseEntity.ok(userDto);
    }   
    
    
}

