# Переменные окружения для деплоя

## Обязательные переменные

Создайте файл `.env.production` в директории `frontend/` с следующими переменными:

```env
# URL вашего приложения (фронтенд)
NEXT_PUBLIC_APP_URL=http://steins.ru

# URL backend API
BACKEND_API_URL=http://your-backend-url:8080

# URL Ory Kratos SDK
ORY_SDK_URL=http://your-kratos-url:4433
```

## Описание переменных

### NEXT_PUBLIC_APP_URL
- **Назначение:** URL фронтенд приложения, доступный из браузера
- **Формат:** `http://` или `https://` + домен
- **Примеры:**
  - `http://steins.ru` - без HTTPS
  - `https://steins.ru` - с HTTPS
  - `http://192.168.1.100` - по IP адресу

### BACKEND_API_URL
- **Назначение:** URL backend API для серверных запросов Next.js
- **Формат:** `http://` или `https://` + хост + порт
- **Важно:** Это URL для внутренних запросов сервера, не из браузера!
- **Примеры:**
  - `http://backend:8080` - если backend в Docker на том же VPS (рекомендуется)
  - `http://localhost:8080` - если backend на том же сервере, но не в Docker
  - `http://192.168.1.100:8080` - если backend на другом сервере в локальной сети
  - `https://api.steins.ru` - если backend на отдельном домене

### ORY_SDK_URL
- **Назначение:** URL Ory Kratos для серверных запросов аутентификации
- **Формат:** `http://` или `https://` + хост + порт
- **Важно:** Это URL для внутренних запросов сервера!
- **Примеры:**
  - `http://kratos:4433` - если Kratos в Docker на том же VPS (рекомендуется)
  - `http://localhost:4433` - если Kratos на том же сервере, но не в Docker
  - `https://auth.steins.ru` - если Kratos на отдельном домене

## Примеры конфигураций

### Вариант 1: Все сервисы на одном VPS в Docker

Рекомендуется для простоты настройки. Используйте Docker networks.

```env
NEXT_PUBLIC_APP_URL=http://steins.ru
BACKEND_API_URL=http://backend:8080
ORY_SDK_URL=http://kratos:4433
```

Создайте общую Docker network:
```bash
docker network create gate149-network
```

Подключите все контейнеры к этой сети в docker-compose.yml.

### Вариант 2: Frontend в Docker, Backend и Kratos на хосте

```env
NEXT_PUBLIC_APP_URL=http://steins.ru
BACKEND_API_URL=http://host.docker.internal:8080
ORY_SDK_URL=http://host.docker.internal:4433
```

Или используйте IP адрес хоста:
```env
NEXT_PUBLIC_APP_URL=http://steins.ru
BACKEND_API_URL=http://192.168.1.100:8080
ORY_SDK_URL=http://192.168.1.100:4433
```

### Вариант 3: Микросервисы на разных доменах

```env
NEXT_PUBLIC_APP_URL=https://steins.ru
BACKEND_API_URL=https://api.steins.ru
ORY_SDK_URL=https://auth.steins.ru
```

### Вариант 4: Локальное тестирование

```env
NEXT_PUBLIC_APP_URL=http://localhost
BACKEND_API_URL=http://localhost:8080
ORY_SDK_URL=http://localhost:4433
```

## Проверка переменных

После запуска контейнера проверьте, что переменные установлены правильно:

```bash
# Показать все переменные окружения в контейнере
docker compose exec frontend env

# Показать только нужные переменные
docker compose exec frontend env | grep -E "BACKEND|ORY|NEXT_PUBLIC"
```

## Ошибки и решения

### Ошибка: "ECONNREFUSED" при запросах к backend

**Причина:** Frontend не может подключиться к backend по указанному URL.

**Решение:**
1. Проверьте, что backend действительно запущен:
   ```bash
   curl http://your-backend-url:8080/health
   ```

2. Если backend в Docker на том же VPS:
   - Используйте имя контейнера вместо localhost
   - Убедитесь, что контейнеры в одной Docker network

3. Если используете `localhost` в Docker:
   - Замените на `host.docker.internal` (Docker Desktop)
   - Или используйте IP адрес хоста

### Ошибка: Переменные undefined в браузере

**Причина:** Переменные не были установлены при сборке.

**Решение:**
1. Убедитесь, что файл `.env.production` существует
2. Пересоберите образ:
   ```bash
   docker compose build --no-cache
   docker compose up -d
   ```

### Ошибка: Не работает аутентификация через Kratos

**Причина:** Неправильный `ORY_SDK_URL` или Kratos недоступен.

**Решение:**
1. Проверьте доступность Kratos:
   ```bash
   curl http://your-kratos-url:4433/health/ready
   ```

2. Убедитесь, что используете правильный порт:
   - `4433` - публичный API (для фронтенда)
   - `4434` - админ API (не для фронтенда)

3. Проверьте конфигурацию Kratos (CORS, allowed origins)

## Безопасность

### Рекомендации:

1. **Не используйте .env файлы в Git:**
   - Добавьте `.env.production` в `.gitignore`
   - Создавайте `.env.production` вручную на VPS

2. **Используйте HTTPS в продакшене:**
   ```env
   NEXT_PUBLIC_APP_URL=https://steins.ru
   ```

3. **Используйте Docker Secrets для чувствительных данных:**
   - Для паролей к БД
   - Для API ключей
   - Для приватных ключей

4. **Ограничьте доступ к .env файлам:**
   ```bash
   chmod 600 .env.production
   ```

## Дополнительные переменные (опционально)

Если вам нужны дополнительные настройки:

```env
# Порт приложения (по умолчанию 3000)
PORT=3000

# Уровень логирования
LOG_LEVEL=info

# Максимальный размер загружаемых файлов (в байтах)
MAX_FILE_SIZE=10485760

# Таймаут запросов к API (в миллисекундах)
API_TIMEOUT=30000
```

---

**Важно:** После изменения переменных окружения всегда пересобирайте образ:
```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

