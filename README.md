# Docker Setup для проекта Hakaton 2.0

Этот проект состоит из двух основных компонентов:
- **Frontend** (test/) - React приложение с Vite
- **Backend** (search_agregator/) - Spring Boot приложение на Java 21

## Быстрый старт

### 1. Клонирование и подготовка
```bash
git clone <repository-url>
cd Hakaton_2.0
```

### 2. Настройка переменных окружения
Отредактируйте файл `docker.env` и укажите нужные значения:
```bash
# Основные переменные
EXCEL_LINK=https://docs.google.com/spreadsheets/d/your-actual-spreadsheet-id/edit
SPRING_PROFILES_ACTIVE=docker
ELASTICSEARCH_HEAP_SIZE=512m
```

### 3. Запуск всех сервисов
```bash
docker-compose up -d
```

### 4. Проверка статуса
```bash
docker-compose ps
```

## Доступные сервисы

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Elasticsearch**: http://localhost:9200

## Структура проекта

```
Hakaton_2.0/
├── docker-compose.yml          # Основной файл Docker Compose
├── .env.example               # Пример переменных окружения
├── test/                      # React Frontend
│   ├── Dockerfile
│   ├── .dockerignore
│   └── ...
└── search_agregator/          # Java Backend
    ├── Dockerfile
    ├── .dockerignore
    └── ...
```

## Переменные окружения

Основные переменные, которые можно настроить в `.env` файле:

- `EXCEL_LINK` - ссылка на Google Sheets для парсинга данных
- `ELASTICSEARCH_HEAP_SIZE` - размер heap для Elasticsearch
- `SPRING_PROFILES_ACTIVE` - активный профиль Spring Boot
