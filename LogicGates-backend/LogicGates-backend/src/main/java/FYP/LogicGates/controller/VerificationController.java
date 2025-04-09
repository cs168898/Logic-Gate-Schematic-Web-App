package FYP.LogicGates.controller;

import FYP.LogicGates.entity.Token;
import FYP.LogicGates.entity.UserDetails;
import FYP.LogicGates.repository.TokenRepository;
import FYP.LogicGates.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class VerificationController {

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/verify")
    @Transactional
    public String verifyUser(@RequestParam("token") String token) {
        Optional<Token> tokenOpt = tokenRepository.findByToken(token);

        if (tokenOpt.isEmpty()) {
            return "Invalid token";
        }

        Token validToken = tokenOpt.get();

        if (validToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            return "Token has expired";
        }

        Optional<UserDetails> userOpt = userRepository.findById(validToken.getUserid());

        if (userOpt.isPresent()) {
            UserDetails user = userOpt.get();
            user.setEnabled(true);
            userRepository.save(user);

            tokenRepository.deleteByUserid(user.getUserid()); // delete the token after it has been successful

            return "Your email has been successfully verified!";
        }

        return "User not found";
    }
}
