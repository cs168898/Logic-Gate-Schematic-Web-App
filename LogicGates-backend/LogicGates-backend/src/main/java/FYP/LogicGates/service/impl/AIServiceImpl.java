package FYP.LogicGates.service.impl;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import FYP.LogicGates.service.AIService;

@Service
public class AIServiceImpl implements AIService{

    @Override
    public String callAiAPI(String UserInput, List<String> ExistingGates) throws Exception{

        // convert List to String
        ObjectMapper mapper = new ObjectMapper();
        String gatesJson = mapper.writeValueAsString(ExistingGates);

        String env = System.getenv("ENVIRONMENT"); // e.g., "local" or "production"

        Path userInput = Files.createTempFile("logic-input", ".json"); // This is to prevent issues from length limits and special chars
        Path existingGates = Files.createTempFile("existingGates-input", ".json");
        try {
            String ApiScriptPath;

            if ("production".equals(env)) {
                ApiScriptPath = "/app/gemini-API.js";  // your production path
            } else {
                ApiScriptPath = "C:\\Users\\user\\Documents\\FYPandHW\\FYP\\web-app-logic-gates\\Logic-Gate-Schematic-Web-App\\gemini-API.js";
            }
            Files.writeString(userInput, UserInput);
            Files.writeString(existingGates, gatesJson);
            System.err.println("Launching AI script: " + ApiScriptPath);

            ProcessBuilder processBuilder = new ProcessBuilder("node", 
            ApiScriptPath, 
            userInput.toAbsolutePath().toString(), 
            existingGates.toAbsolutePath().toString());

            
            // processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();

            // 1. Read from process input (stdout) as text
            StringBuilder outputText = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    outputText.append(line).append("\n");
                }
            }

            // 2. Read from process error (stderr) and log it
            try (BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                errorReader.lines().forEach(line -> System.err.println("AI Script stderr: " + line));
            }

            // 3. Wait for the Node.js process to exit
            int exitCode = process.waitFor();
            System.err.println("Playwright process exited with code: " + exitCode);

            // 4. Check for errors or empty output
            if (exitCode != 0 || outputText.isEmpty()) {
                throw new RuntimeException("AI script failed or returned no data.");
            }

            // 5.Returning text output
            return outputText.toString().trim();
        } finally {
            // Cleanup
            Files.deleteIfExists(userInput);
            Files.deleteIfExists(existingGates);
        }
    }
    
}
