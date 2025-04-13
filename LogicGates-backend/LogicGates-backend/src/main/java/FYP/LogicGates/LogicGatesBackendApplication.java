
//Purpose: This is the main entry point for your Spring Boot application. It bootstraps the application and starts the Spring context.

package FYP.LogicGates;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LogicGatesBackendApplication {
 
	public static void main(String[] args) {
		System.out.println(">>> Starting Spring Boot App");
		SpringApplication.run(LogicGatesBackendApplication.class, args);
	}

}
