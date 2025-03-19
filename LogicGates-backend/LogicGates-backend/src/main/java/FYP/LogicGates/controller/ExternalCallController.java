package FYP.LogicGates.controller;

import FYP.LogicGates.entity.LogicGate;
import FYP.LogicGates.service.PlaywrightService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/external-call")
public class ExternalCallController {
    @Autowired
    private PlaywrightService playwrightService;


    @PostMapping("/generate-screenshot")
    public ResponseEntity<ByteArrayResource> generateScreenshot(@RequestBody List<LogicGate> userInput) {
        try {

            // Convert JSON object to String before passing to Playwright script
            String jsonInput = new ObjectMapper().writeValueAsString(userInput);

            byte[] screenshot = playwrightService.generateLogicGateScreenshot(jsonInput);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=screenshot.png")
                    .contentType(MediaType.IMAGE_PNG)
                    .body(new ByteArrayResource(screenshot));
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception to the console
            return ResponseEntity.status(500).body(null);
        }
    }
}

