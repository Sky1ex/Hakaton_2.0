# Настройка интеграции с Google Sheets

## Вариант 1: Google Apps Script (Рекомендуемый)

### Шаг 1: Создайте Google Apps Script

1. Откройте вашу Google Sheets таблицу
2. Перейдите в `Расширения` → `Apps Script`
3. Создайте новый скрипт со следующим кодом:

```javascript
function doPost(e) {
  try {
    // Получаем данные из POST запроса
    const data = JSON.parse(e.postData.contents);
    
    // Получаем активный лист
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Подготавливаем данные для записи
    const rowData = [
      data.id || '',
      data.title || '',
      data.address || '',
      data.startDate || '',
      data.endDate || '',
      data.status || '',
      data.responsiblePersons || '',
      data.documentLinks || '',
      data.indicators || ''
    ];
    
    // Добавляем новую строку
    sheet.appendRow(rowData);
    
    // Возвращаем успешный ответ
    return ContentService
      .createTextOutput(JSON.stringify({success: true, message: 'Project added successfully'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Возвращаем ошибку
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({message: 'Google Sheets API is working'}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### Шаг 2: Разверните скрипт как веб-приложение

1. В Apps Script нажмите `Развернуть` → `Новое развертывание`
2. Выберите тип: `Веб-приложение`
3. Настройки:
   - **Выполнять как**: `Я`
   - **У кого есть доступ**: `Все`
4. Нажмите `Развернуть`
5. Скопируйте URL веб-приложения

### Шаг 3: Настройте переменную окружения

Установите переменную окружения с URL вашего веб-приложения:

```bash
# Windows
set GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

# Linux/Mac
export GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

## Вариант 2: Ручное добавление (Текущий)

Если вы не хотите настраивать Google Apps Script, система будет логировать данные в консоль для ручного добавления в таблицу.

## Вариант 3: Google Sheets API (Продвинутый)

Для более сложной интеграции можно использовать Google Sheets API с OAuth2 аутентификацией.

### Необходимые зависимости:

```xml
<dependency>
    <groupId>com.google.apis</groupId>
    <artifactId>google-api-services-sheets</artifactId>
    <version>v4-rev20220927-1.32.1</version>
</dependency>
<dependency>
    <groupId>com.google.auth</groupId>
    <artifactId>google-auth-library-oauth2-http</artifactId>
    <version>1.11.0</version>
</dependency>
```

## Тестирование

После настройки webhook URL, протестируйте создание проекта через POST запрос. Данные должны автоматически добавляться в Google Sheets.

## Структура данных в Google Sheets

Данные будут добавляться в следующем формате:

| Колонка | Описание |
|---------|----------|
| A | ID проекта |
| B | Название проекта |
| C | Адрес |
| D | Дата начала |
| E | Дата окончания |
| F | Статус |
| G | Ответственные лица |
| H | Ссылки на документы |
| I | Показатели (JSON) |
