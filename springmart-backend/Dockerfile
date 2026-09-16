# Multi-stage build keeps the final image smaller by compiling in one stage and running in another.

# Build the jar with the full JDK and Maven wrapper.
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app

# Copy build metadata first so dependency download can be cached.
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

RUN chmod +x ./mvnw
RUN ./mvnw dependency:go-offline -B

COPY src src
RUN ./mvnw clean package -DskipTests

# Run the prebuilt jar on a lighter JRE image.
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Ensure data directory exists for H2 file database
RUN mkdir -p /app/data

COPY --from=build /app/target/springmart-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
