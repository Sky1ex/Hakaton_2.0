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

## Полезные команды

### Пересборка и перезапуск
```bash
# Пересборка всех образов
docker-compose build

# Пересборка конкретного сервиса
docker-compose build frontend
docker-compose build backend

# Перезапуск с пересборкой
docker-compose up -d --build
```

### Логи
```bash
# Все логи
docker-compose logs -f

# Логи конкретного сервиса
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f elasticsearch
```

### Остановка и очистка
```bash
# Остановка сервисов
docker-compose down

# Остановка с удалением volumes
docker-compose down -v

# Удаление всех образов
docker-compose down --rmi all
```

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

## Troubleshooting

### Проблемы с портами
Если порты заняты, измените их в `docker-compose.yml`:
```yaml
ports:
  - "3001:80"  # Frontend на порту 3001
  - "8081:8080"  # Backend на порту 8081
```

### Проблемы с памятью Elasticsearch
Увеличьте лимиты памяти в `docker-compose.yml`:
```yaml
environment:
  - "ES_JAVA_OPTS=-Xms1g -Xmx1g"
```

### Очистка Docker
```bash
# Удаление неиспользуемых контейнеров и образов
docker system prune -a

# Удаление всех volumes
docker volume prune
```
