import { chromium } from 'playwright';
import fs from 'fs/promises';
import { stdout } from 'process';

function formatLogicGates(jsonArray) {
    if (!Array.isArray(jsonArray)) {
        jsonArray = [jsonArray];
    }

    try {
        return jsonArray.map(gate => {
            let parts = [];

            parts.push(`name: ${gate.name};`);
            parts.push(`type: ${gate.type?.toUpperCase() || "UNKNOWN"};`);
            parts.push(`input: ${Array.isArray(gate.input) ? gate.input.join(",") : gate.input || ""};`);
            if (gate.output) parts.push(`output: ${gate.output};`);
            if (gate.level) parts.push(`level: ${gate.level};`);

            return parts.join("\n");
        }).join("\n\n");

    } catch (e) {
        console.error("Formatting error:", e);
        return "Invalid input format!";
    }
}


(async () => {
    const args = process.argv.slice(2);
    const filePath = args[0];

    if (!filePath) {
        console.error("No input file provided.");
        process.exit(1);
    }

    let userInput;
    try {
        userInput = await fs.readFile(filePath, 'utf-8');
    } catch (err) {
        console.error("Failed to read input file:", err);
        process.exit(1);
    }

    let parsedInput;
    try {
        parsedInput = JSON.parse(userInput);
        if (typeof parsedInput === "string") {
            parsedInput = JSON.parse(parsedInput);
        }
    } catch (err) {
        console.error("JSON parse error:", err);
        process.exit(1);
    }


    const cleanedText = formatLogicGates(parsedInput);
    console.error("Cleaned input for the app:", cleanedText);

    try {
        const browser = await chromium.launch({ headless: true , args: [
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--js-flags=--max-old-space-size=256', // Tighten memory even more
            '--disable-accelerated-2d-canvas',
            '--disable-dev-tools',
            '--disable-setuid-sandbox',
            '--single-process'
          ]});
        const context = await browser.newContext();
        const page = await context.newPage({ viewport: { width: 1280, height: 720 } });
        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.error("Frontend error:", msg.text());
            }
        });
        const frontendURL = process.env.VITE_FRONTEND_URL || 'http://localhost:3000';
        await page.goto(frontendURL, { waitUntil: 'networkidle' });

        // await page.evaluate(() => {
        //     const canvas = document.querySelectorAll(".konvajs-content canvas");
            
        //     if (canvas[1]) {
        //         canvas[1].style.width = "800px"; // Increase canvas size
        //         canvas[1].style.height = "600px";
        //     }
        // });

        // Hide the textarea and tools window
        await page.locator('.user-input').evaluate(el => el.style.opacity = '0');
        await page.locator('.tools-window').evaluate(el => el.style.opacity = '0');

        await page.evaluate(() => {
            const container = document.querySelector('.konvajs-container');
            if (container) {
                container.style.transform = 'scale(0.8)';
                container.style.transformOrigin = 'top left';
                container.style.width = 'auto'; // 100% / 0.6
                container.style.height = 'auto';
            }
        });

        await page.fill(".user-input2", cleanedText);
        await page.click(".create-button");

        // wait for canvas to appear and be visible
        await page.waitForSelector(".konvajs-content canvas", { state: "attached", timeout: 20000 });
        await page.waitForTimeout(3000); // extra padding for animations/render delay


        await page.locator(".konvajs-container");
        
        
            

          
        // Take a screenshot and output binary data to stdout
        const screenshotBuffer = await page.locator('.konvajs-container').screenshot();

        await browser.close();

        console.error('writing screenshot buffer')
        stdout.write(screenshotBuffer); // No callback needed — synchronous write
        
    } catch (error) {
        console.error("Error in Playwright script:", error);
        process.exit(1);
    }
})();