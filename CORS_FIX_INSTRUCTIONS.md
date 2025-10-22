# Инструкции по исправлению CORS проблем в Docker

## Что было исправлено:

### 1. Backend (Spring Boot)
- ✅ Добавлен класс `CorsConfig.java` с настройками CORS
- ✅ Разрешены запросы с frontend контейнера (`react_frontend:80`, `frontend:80`)
- ✅ Настроены методы: GET, POST, PUT, DELETE, OPTIONS
- ✅ Обновлен `application.yml` для использования переменных окружения

### 2. Frontend (React + Nginx)
- ✅ Создана конфигурация `nginx.conf` с проксированием API запросов
- ✅ Обновлен `Dockerfile` для использования nginx конфигурации
- ✅ Исправлен `api.ts` для использования относительных путей в production
- ✅ Настроено проксирование `/api/` и `/actuator/` запросов к backend

### 3. Docker конфигурация
- ✅ Контейнеры используют внутреннюю сеть Docker
- ✅ Frontend проксирует запросы к backend через nginx
- ✅ Backend настроен для принятия запросов от frontend

## Как протестировать:

### 1. Пересобрать контейнеры:
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### 2. Проверить статус контейнеров:
```bash
docker-compose ps
```

### 3. Проверить логи:
```bash
# Backend логи
docker-compose logs backend

# Frontend логи  
docker-compose logs frontend

# Elasticsearch логи
docker-compose logs elasticsearch
```

### 4. Тестировать API:
```bash
# Проверить health endpoint
curl http://localhost:8080/actuator/health

# Проверить API через frontend
curl http://localhost:3000/api/v1/projects

# Проверить CORS headers
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     http://localhost:8080/api/v1/projects
```

### 5. Открыть в браузере:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api/v1/projects
- Health check: http://localhost:8080/actuator/health

## Возможные проблемы и решения:

### Если CORS все еще не работает:
1. Проверить, что контейнеры запущены в одной сети:
   ```bash
   docker network ls
   docker network inspect hakaton_20_app-network
   ```

2. Проверить, что backend принимает запросы:
   ```bash
   docker exec -it search_agregator_backend curl http://localhost:8080/actuator/health
   ```

3. Проверить nginx конфигурацию:
   ```bash
   docker exec -it react_frontend nginx -t
   ```

### Если API недоступен:
1. Проверить переменные окружения:
   ```bash
   docker-compose config
   ```

2. Проверить подключение к Elasticsearch:
   ```bash
   curl http://localhost:9200/_cluster/health
   ```

## Структура запросов:

### Development режим:
- Frontend: `http://localhost:3000` → прокси → `http://localhost:8080`

### Production режим (Docker):
- Frontend: `http://localhost:3000` → nginx прокси → `http://search_agregator_backend:8080`
- Прямой доступ к API: `http://localhost:8080`

