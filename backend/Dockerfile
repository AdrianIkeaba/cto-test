FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -Dmaven.test.skip=true

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/backend-1.0.0.jar app.jar

RUN groupadd -g 1001 gym && \
    useradd -u 1001 -g gym -s /bin/bash -m gym

USER gym
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
  CMD java -jar app.jar --spring.main.web-application-type=none >/dev/null 2>&1 || exit 1

ENTRYPOINT ["java","-XX:MaxRAMPercentage=75","-XX:+UseContainerSupport","-jar","app.jar"]
