# Multi-stage build для Spring Boot приложения
FROM eclipse-temurin:21-jdk-alpine AS build

# Установка Maven
RUN apk add --no-cache maven

# Установка рабочей директории
WORKDIR /app

# Копирование pom.xml
COPY pom.xml .

# Скачивание зависимостей (для кэширования)
RUN mvn dependency:go-offline -B

# Копирование исходного кода
COPY src ./src

# Сборка приложения
RUN mvn clean package -DskipTests || (echo "Build failed" && exit 1)

# Production stage
FROM eclipse-temurin:21-jre-alpine

# Установка рабочей директории
WORKDIR /app

# Создание пользователя для безопасности
RUN addgroup --system spring && adduser --system spring --ingroup spring

# Копирование JAR файла из build stage
COPY --from=build /app/target/*.jar app.jar

# Изменение владельца файлов
RUN chown spring:spring app.jar

# Переключение на пользователя spring
USER spring:spring

# Открытие порта 8080
EXPOSE 8080

# Переменные окружения
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Запуск приложения
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
