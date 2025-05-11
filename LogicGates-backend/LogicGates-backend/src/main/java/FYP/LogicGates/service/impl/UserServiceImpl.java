
// Purpose: This is the implementation of the UserService interface. It contains the actual business logic for CRUDing a user. 
// It uses the UserMapper to convert between UserDto and UserDetails, and the UserRepository to save the user to the database.

package FYP.LogicGates.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import FYP.LogicGates.dto.UserDto;
import FYP.LogicGates.mapper.UserMapper;
import FYP.LogicGates.repository.TokenRepository;
import FYP.LogicGates.repository.UserRepository;
import FYP.LogicGates.service.MailService;
import FYP.LogicGates.service.UserService;
import FYP.LogicGates.entity.Token;
import FYP.LogicGates.entity.UserDetails;
import FYP.LogicGates.exception.ResourceNotFoundException;
import lombok.AllArgsConstructor;


@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService{
    @Autowired
    private MailService mailService;

    @Autowired
    private TokenRepository tokenRepository;

    private UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(); // Add password encoder

    private String createAndStoreVerificationToken(Long userId) {
        String token = UUID.randomUUID().toString();
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(30); // 30 minutes or your preferred time

        Token tokenEntity = new Token(userId, token, expiry);
        try {
            tokenRepository.save(tokenEntity);
            System.out.println("Token saved successfully: " + token);
            System.out.println("userId:  " + userId);
            System.out.println("Token Expiry: " + expiry);
        } catch (Exception e) {
            System.err.println("Failed to save token: " + e.getMessage());
            e.printStackTrace();
        }
        

        return token;
    }


    @Override
    @Transactional
    public UserDto createUser(UserDto userDto, String password) {
        // Check if username already exists
        if (userRepository.existsByUsername(userDto.getUsername().trim().toLowerCase())) {
            throw new IllegalArgumentException("Username already exists!");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(userDto.getEmail().trim().toLowerCase())) {
            throw new IllegalArgumentException("Email already exists!");
        }

        // Normalize username and email
        userDto.setUsername(userDto.getUsername().trim().toLowerCase());
        userDto.setEmail(userDto.getEmail().trim().toLowerCase());

        // Hash the password
        String hashedPassword = passwordEncoder.encode(password);

        // Map DTO to entity and save
        UserDetails user = UserMapper.mapToUser(userDto, hashedPassword);
        UserDetails savedUser = userRepository.save(user);
        String frontEndUrl;
        String env = System.getenv("ENVIRONMENT"); // e.g., "local" or "production"
        if ("production".equals(env)) {
            frontEndUrl = "https://logic-gate-schematic-web-app.onrender.com/verify?token=";  // your production path
        } else {
            frontEndUrl = "http://localhost:3000/verify?token=";
        }
        // Generate verification token and send mail
        String token = createAndStoreVerificationToken(savedUser.getUserid());
        String verificationLink =  frontEndUrl + token;
        try {
            mailService.sendVerificationEmail(userDto.getEmail(), verificationLink);
            System.out.println("Email sent to " + userDto.getEmail());
        } catch (Exception e) {
            System.err.println("Email sending failed: " + e.getMessage());
            e.printStackTrace();
        }
        

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

        if (!user.isEnabled()) {
            throw new IllegalStateException("Please verify your email before logging in.");
        }

        return UserMapper.mapToUserDto(user);
    }

    
    @Override
    public Boolean existByUsername(String username) {
        System.out.println("Checking username: " + username);
        return userRepository.existsByUsername(username.trim().toLowerCase());
    }

    @Override
    public Boolean existByEmail(String email) {
        System.out.println("Checking email: " + email);
        return userRepository.existsByEmail(email.trim().toLowerCase());
    }
}
