package FYP.LogicGates.service.impl;

import FYP.LogicGates.service.PlaywrightService;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class PlaywrightServiceImpl implements PlaywrightService {

    @Override
    public byte[] generateLogicGateScreenshot(String userInput) throws Exception {
        // Path scriptPath = Paths.get("apps", "playwright-script.js");
        // if (!Files.exists(scriptPath)) {
        //     throw new RuntimeException("Script file not found at " + scriptPath.toAbsolutePath());
        // }

        Path tempInput = Files.createTempFile("logic-input", ".json");

        String env = System.getenv("ENVIRONMENT"); // e.g., "local" or "production"
        
        try {
            String nodeScriptPath;

            if ("production".equals(env)) {
                nodeScriptPath = "/app/playwright-script.js";  // your production path
            } else {
                nodeScriptPath = "C:\\Users\\user\\Documents\\FYPandHW\\FYP\\web-app-logic-gates\\Logic-Gate-Schematic-Web-App\\playwright-script.js";
            }
            Files.writeString(tempInput, userInput);
            System.err.println("Launching Node script: " + nodeScriptPath);

            ProcessBuilder processBuilder = new ProcessBuilder("node", nodeScriptPath, tempInput.toAbsolutePath().toString());

            

            // processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();

            // 1. Read from process input (stdout) in a loop
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            try (InputStream in = new BufferedInputStream(process.getInputStream())) {
                byte[] buffer = new byte[1024];
                int bytesRead;
                while ((bytesRead = in.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, bytesRead);
                }
            }

            // 2. Read from process error (stderr) and log it
            try (BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                errorReader.lines().forEach(line -> System.err.println("Playwright stderr: " + line));
            }

            // 3. Wait for the Node.js process to exit
            int exitCode = process.waitFor();
            System.err.println("Playwright process exited with code: " + exitCode);
            System.err.println("Bytes read from stdout: " + outputStream.size());

            // 4. Check for errors or empty output
            if (exitCode != 0 || outputStream.size() == 0) {
                throw new RuntimeException("Playwright script failed or returned no data.");
            }

            // 5. Return the binary output as a byte array
            return outputStream.toByteArray();
        } finally {
            // Cleanup
            Files.deleteIfExists(tempInput);
        }
        
    }
}