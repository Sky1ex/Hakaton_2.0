# Search Agregator

Система агрегации и поиска строительных проектов с интеграцией Google Sheets и Elasticsearch. Проект был реализован в рамках Хакатона FiloHack 2025.

## 🚀 Возможности

- **Парсинг данных** из Excel/Google Sheets
- **Полнотекстовый поиск** по проектам с поддержкой русского языка
- **REST API** для управления проектами
- **Автоматическая синхронизация** с Google Sheets
- **Elasticsearch** для быстрого поиска
- **Поддержка индикаторов** с JSON структурой

## 📋 Структура проекта

```
search_agregator/
├── src/main/java/com/example/search_agregator/
│   ├── controller/          # REST контроллеры
│   ├── model/              # Модели данных
│   ├── repository/         # Репозитории Elasticsearch
│   ├── service/            # Бизнес-логика
│   └── SearchAgregatorApplication.java
├── src/main/resources/
│   └── application.yml     # Конфигурация
├── postman_collection.json # Postman коллекция для тестирования
└── GOOGLE_SHEETS_SETUP.md # Инструкция по настройке Google Sheets
```

## 🛠 Технологии

- **Java 17**
- **Spring Boot 3.5.6**
- **Elasticsearch 8.x**
- **Apache POI** (для работы с Excel)
- **Jackson** (JSON обработка)
- **Lombok** (упрощение кода)

## ⚙️ Установка и запуск

### Предварительные требования

1. **Java 21**
2. **Elasticsearch 8.x** (запущенный на `http://localhost:9200`)
3. **Maven** (или используйте встроенный `mvnw`)

### Запуск приложения

1. **Клонируйте репозиторий**
   ```bash
   git clone <repository-url>
   cd search_agregator
   ```

2. **Настройте переменные окружения**
   ```bash
   # Windows
   set EXCEL_LINK=https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=xlsx
   
   # Linux/Mac
   export EXCEL_LINK=https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=xlsx
   ```

3. **Запустите приложение**
   ```bash
   # Windows
   mvnw.cmd spring-boot:run
   
   # Linux/Mac
   ./mvnw spring-boot:run
   ```

4. **Приложение будет доступно на** `http://localhost:8080`

## 📊 Модель данных

### ProjectCard

```json
{
  "id": "1",
  "title": "ЖК Солнечный",
  "address": "г. Ижевск, ул. Солнечная, д. 45",
  "startDate": "2024-01-01",
  "endDate": "2026-12-31",
  "status": "В процессе",
  "responsiblePersons": [
    {
      "fio": "Иванов Иван Иванович",
      "position": "ГИП",
      "phone": "+79991234567",
      "email": "ivanov@email.com",
      "description": ""
    }
  ],
  "documentLinks": [
    {
      "documentType": "Проектная документация",
      "url": "https://example.com/docs"
    }
  ],
  "indicators": {
    "Площадь застройки, м2": {
      "Секция №1": "320,89",
      "Секция №2": "570,05",
      "total": "890,94"
    }
  }
}
```

## 🔍 API Endpoints

### Поиск проектов
```http
GET /api/v1/projects/search?q={query}
```

### Получение всех проектов
```http
GET /api/v1/projects
```

### Получение проекта по ID
```http
GET /api/v1/projects/{id}
```

### Создание нового проекта
```http
POST /api/v1/projects
Content-Type: application/json

{
  "title": "Новый проект",
  "address": "Адрес проекта",
  "startDate": "2024-01-01",
  "endDate": "2026-12-31",
  "status": "В процессе",
  "responsiblePersons": [...],
  "documentLinks": [...],
  "indicators": {...}
}
```

### Удаление проекта
```http
DELETE /api/v1/projects/{id}
```

## 🧪 Тестирование

### Postman коллекция

Импортируйте `postman_collection.json` в Postman для тестирования всех endpoints.

### Переменные окружения в Postman

- `{{baseUrl}}` = `http://localhost:8080`
- `{{query}}` = поисковый запрос
- `{{projectId}}` = ID проекта

### Примеры запросов

**Поиск по адресу:**
```http
GET {{baseUrl}}/api/v1/projects/search?q=Москва
```

**Поиск по статусу:**
```http
GET {{baseUrl}}/api/v1/projects/search?q=В%20работе
```

**Создание проекта:**
```http
POST {{baseUrl}}/api/v1/projects
Content-Type: application/json

{
  "title": "Тестовый проект",
  "address": "г. Москва, ул. Тестовая, 1",
  "status": "В процессе"
}
```

## 📈 Интеграция с Google Sheets

### Автоматическая синхронизация

При создании проекта через POST запрос данные автоматически добавляются в Google Sheets.

### Настройка

1. Следуйте инструкциям в `GOOGLE_SHEETS_SETUP.md`
2. Создайте Google Apps Script
3. Установите переменную окружения:
   ```bash
   set GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```

## 🔧 Конфигурация

### application.yml

```yaml
spring:
  elasticsearch:
    uris: http://localhost:9200
  application:
    name: search_agregator

management:
  health:
    elasticsearch:
      enabled: true

spreadsheet:
  link: ${EXCEL_LINK}
```

### Переменные окружения

- `EXCEL_LINK` - URL для загрузки данных из Excel/Google Sheets
- `GOOGLE_SHEETS_WEBHOOK_URL` - URL Google Apps Script для записи данных

## 📝 Формат данных Excel

### Структура таблицы

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| ID | Название | Адрес | Дата начала | Дата окончания | Статус | Ответственные | Документы | Показатели |

### Формат ответственных лиц
```
ФИО | Должность | Телефон | Email; ФИО2 | Должность2 | Телефон2 | Email2
```

### Формат ссылок на документы
```
Тип документа | URL; Тип документа2 | URL2
```

### Формат показателей (JSON)
```json
[
  {
    "indicator_name": "Площадь застройки, м2",
    "sections": [
      { "number": "Секция №1", "amount": "320,89" },
      { "number": "Секция №2", "amount": "570,05" }
    ],
    "total": "890,94"
  }
]
```

## 🐛 Устранение неполадок

### Elasticsearch не запущен
```
Error: Connection refused: localhost:9200
```
**Решение:** Запустите Elasticsearch на порту 9200

### Ошибка парсинга JSON
```
Failed to parse indicators JSON
```
**Решение:** Проверьте формат JSON в колонке показателей Excel

### Google Sheets не обновляется
```
Warning: Failed to add project to Google Sheets
```
**Решение:** Проверьте настройку `GOOGLE_SHEETS_WEBHOOK_URL`

## 📚 Дополнительная документация

- [postman_collection.json](postman_collection.json) - Коллекция для тестирования API

