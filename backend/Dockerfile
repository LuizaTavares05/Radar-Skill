FROM maven:3.9-eclipse-temurin-21
WORKDIR /app
COPY backend/pom.xml .
RUN mvn -B -q -DskipTests dependency:go-offline
COPY backend/src ./src
RUN mvn -B -q -DskipTests package
RUN groupadd -r app && useradd -r -g app app
RUN cp target/*.jar app.jar && rm -rf target
USER app
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
