# Logic Gate Schematic Web App

A comprehensive full-stack web application for creating, editing, and managing logic gate schematics using AI-assisted text-based input and visual canvas rendering. This project combines multiple technologies to provide an interactive platform for digital circuit design and education.

<img width="1916" height="912" alt="Screenshot 2025-05-13 131805" src="https://github.com/user-attachments/assets/caf8328b-1df3-4fcb-9602-95a5144517de" />


## Features

### Core Functionality
- **Text-to-Schematic Conversion**: Convert plain text descriptions into visual logic gate schematics
- **AI-Powered Generation**: Google Gemini AI integration for intelligent circuit suggestions
- **Real-time Rendering**: Dynamic canvas updates with automatic wire positioning and connections
- **Project Management**: Save, load, and manage multiple circuit projects
- **User Authentication**: Secure login/registration system with JWT tokens

### Advanced Features
- **Multiple Gate Types**: Support for AND, OR, NOT, NAND gates with customizable inputs/outputs
- **Netlist Generation**: Export circuit descriptions in standard netlist format
- **Responsive Design**: Mobile-friendly interface with Bootstrap styling
- **Export Capabilities**: Download schematics as text files and generate visual representations

### AI Integration
- **Gemini API**: Google's AI model for intelligent circuit interpretation
- **Natural Language Processing**: Understands human-readable circuit descriptions
- **Smart Gate Placement**: AI suggests optimal gate positioning and connections
- **Circuit Optimization**: Intelligent suggestions for circuit improvements

## Architecture

This project follows a microservices architecture with multiple backend services:

```
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────────┐
│   React Frontend│    │  Spring Boot API │    │  Playwright Service  │
│   (Vite + Konva)│◄──►│   (Java 17)      │◄──►│   (JavaScript)       │
└─────────────────┘    └──────────────────┘    └──────────────────────┘
         │                       │         \                │
         │                       │          \               │
         ▼                       ▼           \              ▼
┌─────────────────┐    ┌──────────────────┐   \   ┌─────────────────┐
│   Firebase      │    │   PostgreSQL     │    ▶ │    Gemini AI     │
│   Hosting       │    │   Database       │       │   API           │
└─────────────────┘    └──────────────────┘       └─────────────────┘
```

##  Project Structure

```
Logic-Gate-Schematic-Web-App/
├── logic-gates-app/                    # React Frontend (Vite)
│   ├── src/
│   │   ├── components/                 # UI Components
│   │   │   ├── header.jsx             # Navigation header
│   │   │   ├── login.jsx              # User authentication
│   │   │   ├── register.jsx           # User registration
│   │   │   ├── landing-page.jsx       # Welcome screen
│   │   │   ├── how-to-use.jsx         # User guide
│   │   │   ├── chatbox.jsx            # AI interaction
│   │   │   └── verify-page.jsx        # Circuit verification
│   │   ├── konvaLogicGates/           # Canvas Components
│   │   │   ├── andGate.jsx            # AND gate rendering
│   │   │   ├── orGate.jsx             # OR gate rendering
│   │   │   ├── notGate.jsx            # NOT gate rendering
│   │   │   ├── nandGate.jsx           # NAND gate rendering
│   │   │   └── functions/             # Canvas utilities
│   │   ├── pages/
│   │   │   └── home.jsx               # Main application page
│   │   ├── context/                   # React Context providers
│   │   ├── utils/                     # Utility functions
│   │   └── services/                  # API service layer
│   ├── public/                        # Static assets
│   └── package.json                   # Frontend dependencies
│
├── LogicGates-backend/                 # Spring Boot Backend (Java)
│   └── LogicGates-backend/
│       ├── src/main/java/FYP/LogicGates/
│       │   ├── controller/            # REST API endpoints
│       │   ├── service/               # Business logic layer
│       │   ├── repository/            # Data access layer
│       │   ├── entity/                # JPA entities
│       │   ├── dto/                   # Data transfer objects
│       │   ├── mapper/                # Object mappers
│       │   ├── config/                # Configuration classes
│       │   └── exception/             # Custom exceptions
│       ├── src/main/resources/        # Configuration files
│       └── pom.xml                    # Maven dependencies
│
├── gemini-API.js                      # Google Gemini AI integration
├── playwright-script.js               # 3rd Party App Integration
├── Dockerfile                         # Container configuration
├── firebase.json                      # Firebase hosting config
└── package.json                       # Root dependencies
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **Vite** - Fast build tool and dev server
- **React Konva** - Canvas-based graphics library
- **Bootstrap 5** - Responsive CSS framework
- **FontAwesome** - Icon library
- **Axios** - HTTP client for API calls

### Backend Services
- **Spring Boot 3.4.3** - Java-based REST API
- **PostgreSQL** - Primary database
- **Hibernate ORM** - Object-relational mapping
- **Spring Security** - Authentication and authorization
- **JWT** - JSON Web Token authentication

### AI & Testing
- **Google Gemini AI** - AI-powered circuit generation
- **Playwright** - 3rd Party App Integration
- **Node.js** - Runtime for automation scripts

### DevOps & Deployment
- **Docker** - Containerization
- **Firebase Hosting** - Frontend deployment
- **GitHub Actions** - CI/CD pipeline

## Prerequisites

- **Node.js** (v18+ recommended)
- **Java JDK 17** or higher
- **PostgreSQL 12+**
- **Maven 3.6+**
- **Git**

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Logic-Gate-Schematic-Web-App
```

### 2. Frontend Setup
```bash
cd logic-gates-app
npm install
```

### 3. Backend Setup
```bash
cd ../LogicGates-backend/LogicGates-backend
mvn clean install
```

### 4. Environment Configuration
Create `.env` files in respective directories:

**Frontend (.env)**
```env
VITE_BACKEND_URL=http://localhost:8080
VITE_FRONTEND_URL=http://localhost:3000
```

**Backend (application-dev.properties)**
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/logicgates
spring.datasource.username=your_username
spring.datasource.password=your_password
```

**AI Service**
```env
GEMINI_API_KEY=your_gemini_api_key
```

## Running the Application

### 1. Start PostgreSQL Database
```bash
# Ensure PostgreSQL is running on port 5432
```

### 2. Start Spring Boot Backend
```bash
cd LogicGates-backend/LogicGates-backend
mvn spring-boot:run
# Backend will run on http://localhost:8080
```

### 3. Start React Frontend
```bash
cd logic-gates-app
npm run dev
# Frontend will run on http://localhost:3000
```

## Usage Guide

### Creating Logic Gates
1. **Text Input Format**:
   ```
   name: Gate1;
   type: AND;
   input: A, B;
   output: C;
   level: 1;
   ```

2. **Supported Gate Types**:
   - `AND` - Logical AND gate
   - `OR` - Logical OR gate
   - `NOT` - Logical NOT gate
   - `NAND` - Logical NAND gate

### AI-Assisted Generation
1. Click the AI button in the interface
2. Describe your circuit in natural language
3. The Gemini AI will generate optimized gate configurations
4. Review and modify the generated circuit as needed

### Project Management
1. **Save Projects**: Use the sidebar to save current circuits
2. **Load Projects**: Browse and load previously saved projects
3. **Export**: Download netlists or visual representations
4. **Share**: Export projects for collaboration

### Canvas Interaction
- **Drag & Drop**: Move gates around the canvas
- **Wire Connections**: Automatic wire positioning and routing
- **Grid System**: Snap-to-grid for precise positioning
- **Zoom & Pan**: Navigate large circuit diagrams

## 🔧 Development

### Adding New Gate Types
1. Create new component in `konvaLogicGates/`
2. Update gate type validation
3. Add rendering logic for inputs/outputs
4. Update AI prompt templates

### API Endpoints
**Spring Boot Backend**:
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/projects` - List user projects
- `POST /api/projects` - Save new project
- `GET /api/projects/{id}` - Get project by ID


## Docker Deployment

### Build and Run
```bash
# Build the Docker image
docker build -t logic-gates-app .

# Run the container
docker run -p 8080:8080 logic-gates-app
```

### Docker Compose (Recommended)
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=docker
    depends_on:
      - postgres
  
  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: logicgates
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt password encryption
- **CORS Configuration** - Controlled cross-origin requests
- **Input Validation** - Sanitized user inputs
- **SQL Injection Protection** - Parameterized queries

## Performance Features

- **Lazy Loading** - Components load on demand
- **Canvas Optimization** - Efficient rendering with React Konva
- **Database Indexing** - Optimized PostgreSQL queries
- **Caching** - Redis integration for session management
- **CDN Integration** - Firebase hosting with global CDN

## Troubleshooting

### Common Issues

**Port Conflicts**
```bash
# Check port usage
netstat -ano | findstr :8080  # Windows
lsof -i :8080                 # Mac/Linux
```

**Database Connection**
```bash
# Verify PostgreSQL is running
pg_isready -h localhost -p 5432
```

**CORS Issues**
- Ensure backend allows requests from frontend origin
- Check `@CrossOrigin` annotations in Spring controllers

**AI Service Errors**
- Verify Gemini API key is valid
- Check API quota limits
- Ensure proper input format

### Debug Mode
```bash
# Frontend debug
cd logic-gates-app
npm run dev -- --debug

# Backend debug
cd LogicGates-backend/LogicGates-backend
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Samuel Yew Han Sen**
- LinkedIn: [https://www.linkedin.com/in/samuelyew/](https://www.linkedin.com/in/samuelyew/)
- GitHub: [@samuelyew](https://github.com/cs168898)

## Acknowledgments

- **Google Gemini AI** for intelligent circuit generation
- **React Konva** team for excellent canvas library
- **Spring Boot** community for robust backend framework

## Additional Resources

- [Logic Gates Tutorial](https://www.electronics-tutorials.ws/logic/logic_1.html)
- [React Konva Documentation](https://konvajs.org/docs/react/)
- [Spring Boot Reference](https://spring.io/projects/spring-boot)

---

**Note**: This is a Final Year Project (FYP) demonstrating advanced web development concepts, AI integration, and full-stack architecture. For production use, additional security measures and testing should be implemented.
