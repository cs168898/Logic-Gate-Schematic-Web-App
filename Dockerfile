# Stage 1: Build the frontend
FROM node:20-alpine AS frontend-build

WORKDIR /app

# Copy frontend package.json and install dependencies
COPY logic-gates-app/package*.json ./logic-gates-app/
WORKDIR /app/logic-gates-app
RUN npm install

# Build the frontend
COPY logic-gates-app/ ./
RUN npm run build

# Stage 2: Build the backend
FROM node:20-alpine AS backend-build

WORKDIR /app

# Copy backend package.json and install dependencies
COPY LogicGates-backend/package*.json ./LogicGates-backend/
WORKDIR /app/LogicGates-backend
RUN npm install

# Copy backend source code
COPY LogicGates-backend/ ./

# Stage 3: Combine frontend and backend
FROM node:20-alpine

WORKDIR /app

# Copy backend from the previous stage
COPY --from=backend-build /app/LogicGates-backend /app

# Copy frontend build files to the backend's public directory
COPY --from=frontend-build /app/logic-gates-app/dist /app/public

# Expose the backend port
EXPOSE 8080

# Start the backend server
CMD ["npm", "run", "start"]