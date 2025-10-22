# Hakaton 2.0 - Система управления строительными проектами

Полнофункциональная система для централизованного хранения и быстрого доступа к информации о строительных объектах с возможностью поиска и фильтрации.

## 🏗️ Архитектура проекта

Проект состоит из трех основных компонентов:

- **Frontend** (`test/`) - React приложение с современным UI
- **Backend** (`search_agregator/`) - Spring Boot API с интеграцией Elasticsearch  
- **Elasticsearch** - поисковый движок для быстрого поиска

## 🚀 Быстрый старт

### Предварительные требования

- Docker и Docker Compose
- Git

### Установка и запуск

1. **Клонируйте репозиторий:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/hakaton-2.0-full-project.git
   cd hakaton-2.0-full-project
   ```

2. **Настройте переменные окружения:**
   ```bash
   cp docker.env.example docker.env
   # Отредактируйте docker.env с вашими настройками
   ```

3. **Запустите все сервисы:**
   ```bash
   docker-compose up -d
   ```

4. **Проверьте статус сервисов:**
   ```bash
   docker-compose ps
   ```

## 🌐 Доступные сервисы

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Elasticsearch**: http://localhost:9200

## 📁 Структура проекта

```
hakaton-2.0-full-project/
├── README.md                    # Этот файл
├── docker-compose.yml          # Конфигурация Docker Compose
├── docker.env.example          # Пример переменных окружения
├── test/                       # React Frontend
│   ├── src/
│   ├── package.json
│   └── Dockerfile
└── search_agregator/           # Spring Boot Backend
    ├── src/
    ├── pom.xml
    └── Dockerfile
```

## 🐳 Docker команды

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

## 📊 Функциональность

### Frontend (`test/`)
- ✅ Отображение списка строительных объектов
- ✅ Поиск по названию объекта
- ✅ Фильтрация по городу и району
- ✅ Детальная карточка объекта
- ✅ Адаптивный дизайн
- ✅ Современный UI с Tailwind CSS

### Backend (`search_agregator/`)
- ✅ REST API для управления проектами
- ✅ Полнотекстовый поиск с Elasticsearch
- ✅ Парсинг данных из Excel/Google Sheets
- ✅ Автоматическая синхронизация с Google Sheets
- ✅ Поддержка индикаторов с JSON структурой

## 📝 Переменные окружения

Основные переменные в `docker.env`:

```bash
# Ссылка на Google Sheets для парсинга данных
EXCEL_LINK=https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=xlsx

# Профиль Spring Boot
SPRING_PROFILES_ACTIVE=docker

# Размер heap для Elasticsearch
ELASTICSEARCH_HEAP_SIZE=512m

# URL для записи в Google Sheets (опционально)
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

## 🛠️ Разработка

### Локальная разработка Frontend
```bash
cd test
npm install
npm run dev
```

### Локальная разработка Backend
```bash
cd search_agregator
./mvnw spring-boot:run
```

### Требования для локальной разработки
- **Frontend**: Node.js 18+, npm
- **Backend**: Java 21, Maven
- **Elasticsearch**: Docker (для локального запуска)

## 🐛 Устранение неполадок

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

## 📚 Дополнительная документация

- [Frontend README](test/README.md)
- [Backend README](search_agregator/README.md)
- [Docker README](DOCKER_README.md)

## 📄 Лицензия

Этот проект создан в рамках Хакатона FiloHack 2025.
