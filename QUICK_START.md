# Быстрый старт деплоя на VPS

Краткая инструкция для быстрого развертывания frontend на VPS.

## Предварительные требования

1. **На VPS установлены:**
   - Docker
   - Docker Compose

2. **На локальной машине:**
   - SSH доступ к VPS
   - Все файлы проекта

## Шаги деплоя

### 1. Обновите next.config.mjs

Файл уже обновлен и содержит `output: 'standalone'` ✅

### 2. Создайте .env.production

Скопируйте пример и заполните значения:

```powershell
# В PowerShell
Copy-Item frontend\.env.production.example frontend\.env.production
notepad frontend\.env.production
```

Укажите реальные значения:
```env
NEXT_PUBLIC_APP_URL=http://steins.ru
BACKEND_API_URL=http://your-backend-url:8080
ORY_SDK_URL=http://your-kratos-url:4433
```

### 3. Скопируйте файлы на VPS

```powershell
# PowerShell (из корня проекта)
scp -r frontend user@steins.ru:~/gate149/
```

Или используйте Git:
```bash
# На VPS
git clone your-repo-url ~/gate149
cd ~/gate149/frontend
```

### 4. Соберите и запустите

```bash
# На VPS
cd ~/gate149/frontend
docker compose build
docker compose up -d
```

### 5. Проверьте

```bash
# Статус
docker compose ps

# Логи
docker compose logs -f

# Проверка доступности
curl http://localhost
```

## Настройка DNS

В настройках домена steins.ru:
- **A-запись**: `@` → IP вашего VPS
- **A-запись**: `www` → IP вашего VPS

## Добавление HTTPS (рекомендуется)

### Быстрый способ с Nginx + Certbot

```bash
# На VPS
sudo apt install nginx certbot python3-certbot-nginx

# Создайте конфиг
sudo nano /etc/nginx/sites-available/steins.ru
```

Добавьте:
```nginx
server {
    listen 80;
    server_name steins.ru www.steins.ru;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Активируйте:
```bash
sudo ln -s /etc/nginx/sites-available/steins.ru /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Получите SSL
sudo certbot --nginx -d steins.ru -d www.steins.ru
```

Измените порт в docker-compose.yml:
```yaml
ports:
  - "3000:3000"  # Вместо 80:3000
```

Перезапустите:
```bash
docker compose down && docker compose up -d
```

## Обновление приложения

```bash
# На VPS
cd ~/gate149/frontend
git pull  # Если используете Git
docker compose build
docker compose up -d
```

## Полезные команды

```bash
# Статус контейнера
docker compose ps

# Логи в реальном времени
docker compose logs -f

# Перезапуск
docker compose restart

# Остановка
docker compose down

# Использование ресурсов
docker stats gate149-frontend
```

## Troubleshooting

### Контейнер не запускается
```bash
docker compose logs
```

### Порт 80 занят
```bash
sudo netstat -tulpn | grep :80
sudo systemctl stop nginx  # или другой сервис
```

### Backend недоступен
Проверьте:
1. BACKEND_API_URL в .env.production
2. Доступность backend: `curl http://your-backend-url:8080/health`
3. Если backend в Docker на том же VPS, используйте имя контейнера

### Проверка переменных окружения
```bash
docker compose exec frontend env | grep -E "BACKEND|ORY|NEXT_PUBLIC"
```

---

📖 **Полная документация:** См. `DEPLOYMENT.md` в корне проекта

