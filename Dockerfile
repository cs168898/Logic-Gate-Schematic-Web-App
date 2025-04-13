FROM mcr.microsoft.com/playwright:v1.42.1-jammy

# Install Java (OpenJDK 17)
RUN apt-get update && apt-get install -y openjdk-17-jdk

# Set working directory
WORKDIR /app

# Install Playwright
COPY package*.json ./
RUN npm install
RUN npx playwright install --with-deps

# Copy backend jar and Node.js script
COPY LogicGates-backend/LogicGates-backend/target/LogicGates-backend-0.0.1-SNAPSHOT.jar app.jar
COPY playwright-script.js ./playwright-script.js
COPY gemini-API.js ./gemini-API.js

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
