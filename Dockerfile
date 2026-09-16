# Multi-stage build for Spring Boot application  
  
# Build stage  
FROM eclipse-temurin:21-jdk-jammy AS build  
  
# Set the working directory  
WORKDIR /app  
  
# Copy Maven wrapper and configuration files  
COPY springmart-backend/mvnw .  
COPY springmart-backend/.mvn .mvn  
  
# Copy the main pom.xml file  
COPY springmart-backend/pom.xml .  
  
# Make the Maven wrapper executable  
RUN chmod +x ./mvnw  
  
# Download dependencies first  
RUN ./mvnw dependency:go-offline -B  
  
# Copy the source code  
COPY springmart-backend/src src  
  
# Build the application  
RUN ./mvnw clean package -DskipTests  
  
# Production stage  
FROM eclipse-temurin:21-jre-alpine  
  
# Set the working directory  
WORKDIR /app  

# Ensure data directory exists for H2 file database
RUN mkdir -p /app/data
  
# Copy the jar file from the build stage  
COPY --from=build /app/target/springmart-0.0.1-SNAPSHOT.jar app.jar  
  
# Expose the port the app runs on  
EXPOSE 8080  
  
# Run the application  
ENTRYPOINT ["java", "-jar", "app.jar"] 
