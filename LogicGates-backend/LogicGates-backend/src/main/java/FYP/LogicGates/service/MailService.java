package FYP.LogicGates.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class MailService {

    private final RestTemplate restTemplate = new RestTemplate();

    private final String BREVO_API_KEY = "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"; // Replace this or load from .env

    public void sendVerificationEmail(String toEmail, String verificationLink) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("api-key", BREVO_API_KEY);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> payload = new HashMap<>();
        payload.put("sender", Map.of("name", "Logic Gate App", "email", "samuelyew98@gmail.com"));
        payload.put("to", List.of(Map.of("email", toEmail)));
        payload.put("subject", "Verify Your Email");
        payload.put("htmlContent", "<h1>Welcome to Logic Gate Schematic Through Text<h1><p>Click <a href=\"" + verificationLink + "\">here</a> to verify your email.</p>");

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(
                "https://api.brevo.com/v3/smtp/email",
                request,
                String.class
        );

        System.out.println("Brevo response: " + response.getBody());
    }
}
