# Estágio de Build
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Copia primeiro o pom.xml para aproveitar o cache de dependências do Docker
COPY pom.xml .
COPY .mvn/ .mvn/
COPY mvnw .
RUN chmod +x ./mvnw && ./mvnw dependency:go-offline -B

# Copia o código fonte e constrói o projeto
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Estágio de Execução
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copia apenas o JAR final do estágio de build
COPY --from=builder /app/target/synapse-backend-*.jar app.jar

# Define as variáveis de ambiente padrão
# ENV SERVER_PORT=8080
# ENV DB_URL="jdbc:postgresql://postgres_db:5432/sest?currentSchema=TI"
# ENV DB_USER=postgres
# ENV DB_PASS=sua_senha_segura

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
