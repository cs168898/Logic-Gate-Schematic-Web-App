package FYP.LogicGates.service.impl;

import FYP.LogicGates.service.PlaywrightService;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class PlaywrightServiceImpl implements PlaywrightService {

    @Override
    public byte[] generateLogicGateScreenshot(String userInput) throws Exception {
        String nodeScriptPath = "c:/Users/user/Documents/FYPandHW/FYP/web-app-logic-gates/Logic-Gate-Schematic-Web-App/playwright-script.js";

        ProcessBuilder processBuilder = new ProcessBuilder(
            "node", nodeScriptPath, new ObjectMapper().writeValueAsString(userInput)
        );

        // processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();

        // Capture the binary output from the Playwright script
        try (InputStream inputStream = new BufferedInputStream(process.getInputStream());
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new RuntimeException("Playwright script failed with exit code " + exitCode);
            }

            return outputStream.toByteArray(); // Return the binary image data
        }
    }
}