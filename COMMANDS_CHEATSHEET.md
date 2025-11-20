# Шпаргалка команд для управления деплоем

Быстрый справочник по всем командам для управления Gate149 Frontend в Docker на VPS.

## 📦 Docker Compose команды

### Базовые операции

```bash
# Сборка образа
docker compose build

# Сборка без кеша (если были изменения в зависимостях)
docker compose build --no-cache

# Запуск контейнера в фоновом режиме
docker compose up -d

# Остановка контейнера
docker compose down

# Перезапуск контейнера
docker compose restart

# Остановка и удаление контейнера с volumes
docker compose down -v
```

### Логи и мониторинг

```bash
# Просмотр логов
docker compose logs

# Логи в реальном времени (следить за новыми)
docker compose logs -f

# Последние 100 строк логов
docker compose logs --tail=100

# Логи за последний час
docker compose logs --since 1h

# Статус контейнеров
docker compose ps

# Детальная информация о контейнере
docker compose ps --format json
```

### Быстрое обновление

```bash
# Полное обновление (pull, build, restart)
docker compose down && docker compose build && docker compose up -d

# Обновление с просмотром логов
docker compose down && docker compose up -d --build && docker compose logs -f
```

## 🐳 Docker команды

### Управление контейнерами

```bash
# Список запущенных контейнеров
docker ps

# Список всех контейнеров (включая остановленные)
docker ps -a

# Остановить контейнер
docker stop gate149-frontend

# Запустить контейнер
docker start gate149-frontend

# Перезапустить контейнер
docker restart gate149-frontend

# Удалить контейнер
docker rm gate149-frontend

# Удалить контейнер принудительно
docker rm -f gate149-frontend
```

### Выполнение команд в контейнере

```bash
# Войти в контейнер (bash)
docker exec -it gate149-frontend sh

# Выполнить команду в контейнере
docker exec gate149-frontend ls -la

# Посмотреть переменные окружения
docker exec gate149-frontend env

# Посмотреть только нужные переменные
docker exec gate149-frontend env | grep -E "BACKEND|ORY|NEXT_PUBLIC"
```

### Мониторинг ресурсов

```bash
# Использование CPU, RAM, Network
docker stats gate149-frontend

# Статистика всех контейнеров
docker stats

# Единоразовый снимок статистики
docker stats --no-stream
```

### Работа с образами

```bash
# Список образов
docker images

# Список образов с фильтром
docker images | grep gate149

# Удалить образ
docker rmi <image_id>

# Удалить все неиспользуемые образы
docker image prune -a

# Информация об образе
docker inspect <image_id>
```

### Очистка

```bash
# Удалить остановленные контейнеры
docker container prune

# Удалить неиспользуемые образы
docker image prune -a

# Удалить неиспользуемые volumes
docker volume prune

# Удалить неиспользуемые networks
docker network prune

# Полная очистка Docker (осторожно!)
docker system prune -a

# Очистка с volumes
docker system prune -a --volumes

# Показать сколько места занимает Docker
docker system df
```

## 🔧 Системные команды (VPS)

### Управление сервисами

```bash
# Nginx
sudo systemctl status nginx
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl reload nginx  # Перезагрузить конфиг без даунтайма

# Docker
sudo systemctl status docker
sudo systemctl start docker
sudo systemctl restart docker
```

### Проверка портов

```bash
# Показать какие порты слушаются
sudo netstat -tulpn

# Показать только порт 80
sudo netstat -tulpn | grep :80

# Альтернатива (если есть lsof)
sudo lsof -i :80

# Проверить доступность порта извне
curl http://localhost:80
```

### Firewall (UFW)

```bash
# Статус firewall
sudo ufw status

# Разрешить порт
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Запретить порт
sudo ufw deny 80/tcp

# Включить firewall
sudo ufw enable

# Выключить firewall
sudo ufw disable
```

### Проверка доступности

```bash
# Проверить сайт локально
curl http://localhost

# Проверить заголовки ответа
curl -I http://localhost

# Проверить с подробным выводом
curl -v http://steins.ru

# Проверить DNS
nslookup steins.ru
dig steins.ru

# Проверить доступность с пингом
ping steins.ru

# Трассировка маршрута
traceroute steins.ru
```

## 📂 Работа с файлами

### SSH и SCP

```bash
# Подключиться к VPS
ssh user@steins.ru

# Скопировать файл на VPS
scp file.txt user@steins.ru:~/gate149/frontend/

# Скопировать директорию
scp -r frontend/ user@steins.ru:~/gate149/

# Скачать файл с VPS
scp user@steins.ru:~/gate149/frontend/.env.production ./
```

### Rsync (более эффективно)

```bash
# Синхронизировать директорию
rsync -avz frontend/ user@steins.ru:~/gate149/frontend/

# Исключить node_modules и .next
rsync -avz --exclude 'node_modules' --exclude '.next' frontend/ user@steins.ru:~/gate149/frontend/

# Показать что будет скопировано (dry-run)
rsync -avzn frontend/ user@steins.ru:~/gate149/frontend/
```

## 🔐 SSL/HTTPS с Certbot

### Получение сертификата

```bash
# Автоматическая настройка Nginx + SSL
sudo certbot --nginx -d steins.ru -d www.steins.ru

# Только получить сертификат (без настройки Nginx)
sudo certbot certonly --nginx -d steins.ru

# Показать существующие сертификаты
sudo certbot certificates

# Обновить сертификаты вручную
sudo certbot renew

# Тестовый запуск обновления
sudo certbot renew --dry-run
```

### Автообновление

```bash
# Проверить systemd timer для автообновления
sudo systemctl status certbot.timer

# Включить автообновление
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

## 📊 Логи

### Nginx логи

```bash
# Access log (посещения)
sudo tail -f /var/log/nginx/access.log

# Error log (ошибки)
sudo tail -f /var/log/nginx/error.log

# Логи для конкретного сайта
sudo tail -f /var/log/nginx/steins.ru.access.log
sudo tail -f /var/log/nginx/steins.ru.error.log

# Последние 100 строк
sudo tail -n 100 /var/log/nginx/error.log
```

### System логи

```bash
# Системные логи
sudo journalctl -xe

# Логи Docker
sudo journalctl -u docker

# Логи с следованием
sudo journalctl -u docker -f
```

## 🔄 Git операции

```bash
# Клонировать репозиторий
git clone https://github.com/username/gate149.git

# Обновить код
git pull origin main

# Проверить статус
git status

# Посмотреть последние коммиты
git log --oneline -10

# Отменить локальные изменения
git reset --hard HEAD
```

## 🚀 Быстрые сценарии

### Полный деплой с нуля

```bash
# На локальной машине (PowerShell)
scp -r frontend user@steins.ru:~/gate149/

# На VPS
ssh user@steins.ru
cd ~/gate149/frontend
docker compose build
docker compose up -d
docker compose logs -f
```

### Обновление после изменений кода

```bash
# На VPS
cd ~/gate149/frontend
git pull  # или скопируйте файлы заново
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Быстрая перезагрузка

```bash
docker compose restart
```

### Полная переустановка

```bash
# Остановить и удалить все
docker compose down -v
docker system prune -a

# Собрать и запустить заново
docker compose build --no-cache
docker compose up -d
```

### Backup

```bash
# Создать backup образа
docker save gate149-frontend:latest > ~/backups/frontend_$(date +%Y%m%d).tar

# Создать backup volumes
docker run --rm -v gate149_data:/data -v ~/backups:/backup alpine tar czf /backup/volumes_$(date +%Y%m%d).tar.gz /data

# Восстановить образ
docker load < ~/backups/frontend_20250120.tar
```

## 🐛 Отладка

### Проблемы с контейнером

```bash
# Проверить почему контейнер упал
docker logs gate149-frontend

# Проверить последний запуск
docker ps -a | grep gate149

# Проверить конфиг docker-compose
docker compose config

# Проверить конфиг и показать переменные
docker compose config --resolve-image-digests
```

### Проблемы с сетью

```bash
# Список Docker networks
docker network ls

# Детальная информация о network
docker network inspect gate149-network

# Проверить IP контейнера
docker inspect gate149-frontend | grep IPAddress

# Ping между контейнерами
docker exec gate149-frontend ping backend
```

### Проблемы с портами

```bash
# Что слушает порт 80
sudo lsof -i :80

# Все порты контейнера
docker port gate149-frontend

# Проверить доступность изнутри контейнера
docker exec gate149-frontend wget -O- http://localhost:3000
```

## 📱 Мониторинг в реальном времени

### Watch команды

```bash
# Следить за статусом контейнеров
watch -n 2 'docker ps'

# Следить за использованием ресурсов
watch -n 2 'docker stats --no-stream'

# Следить за логами Nginx
sudo tail -f /var/log/nginx/access.log | grep -v "bot"
```

---

## 💡 Полезные алиасы

Добавьте в `~/.bashrc` или `~/.bash_aliases`:

```bash
# Docker
alias dps='docker ps'
alias dpsa='docker ps -a'
alias dl='docker logs'
alias dlf='docker logs -f'
alias dc='docker compose'
alias dcup='docker compose up -d'
alias dcdown='docker compose down'
alias dcrestart='docker compose restart'
alias dclogs='docker compose logs -f'

# Nginx
alias ngtest='sudo nginx -t'
alias ngreload='sudo systemctl reload nginx'
alias ngrestart='sudo systemctl restart nginx'

# Gate149 specific
alias gate-logs='cd ~/gate149/frontend && docker compose logs -f'
alias gate-restart='cd ~/gate149/frontend && docker compose restart'
alias gate-status='cd ~/gate149/frontend && docker compose ps'
```

После добавления выполните:
```bash
source ~/.bashrc
```

---

**Совет:** Добавьте эту шпаргалку в закладки или держите под рукой для быстрого доступа к командам!

