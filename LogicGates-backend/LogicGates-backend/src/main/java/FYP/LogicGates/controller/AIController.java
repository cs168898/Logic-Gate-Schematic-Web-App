package FYP.LogicGates.controller;

import FYP.LogicGates.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private AIService aiService;

    @PostMapping("/generate")
    public String generateSchematic(@RequestBody AiRequest request) throws Exception {
        return aiService.callAiAPI(request.getUserInput(), request.getExistingGates());
    }

    // Optional: you can define this as a separate file too
    public static class AiRequest {
        private String userInput;
        private List<String> existingGates;

        public String getUserInput() {
            return userInput;
        }

        public void setUserInput(String userInput) {
            this.userInput = userInput;
        }

        public List<String> getExistingGates() {
            return existingGates;
        }

        public void setExistingGates(List<String> existingGates) {
            this.existingGates = existingGates;
        }
    }
}
