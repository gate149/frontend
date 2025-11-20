#!/bin/bash

# Скрипт для быстрого деплоя Gate149 Frontend на VPS
# Использование: ./deploy.sh [VPS_USER@VPS_HOST]

set -e

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Проверка аргументов
if [ -z "$1" ]; then
    echo -e "${RED}Ошибка: Не указан адрес VPS${NC}"
    echo "Использование: ./deploy.sh user@steins.ru"
    exit 1
fi

VPS_HOST=$1
PROJECT_DIR="~/gate149/frontend"

echo -e "${GREEN}=== Деплой Gate149 Frontend на VPS ===${NC}"
echo -e "VPS: ${YELLOW}$VPS_HOST${NC}"
echo ""

# Проверка наличия .env.production
if [ ! -f ".env.production" ]; then
    echo -e "${RED}Ошибка: Файл .env.production не найден!${NC}"
    echo "Создайте файл .env.production на основе .env.production.example"
    exit 1
fi

echo -e "${GREEN}[1/6]${NC} Создание директории на VPS..."
ssh $VPS_HOST "mkdir -p $PROJECT_DIR"

echo -e "${GREEN}[2/6]${NC} Копирование файлов на VPS..."
rsync -avz --exclude 'node_modules' --exclude '.next' --exclude '.git' \
    ./ $VPS_HOST:$PROJECT_DIR/

echo -e "${GREEN}[3/6]${NC} Остановка старого контейнера (если существует)..."
ssh $VPS_HOST "cd $PROJECT_DIR && docker compose down || true"

echo -e "${GREEN}[4/6]${NC} Сборка Docker образа..."
ssh $VPS_HOST "cd $PROJECT_DIR && docker compose build"

echo -e "${GREEN}[5/6]${NC} Запуск контейнера..."
ssh $VPS_HOST "cd $PROJECT_DIR && docker compose up -d"

echo -e "${GREEN}[6/6]${NC} Проверка статуса..."
ssh $VPS_HOST "cd $PROJECT_DIR && docker compose ps"

echo ""
echo -e "${GREEN}=== Деплой завершен успешно! ===${NC}"
echo -e "Проверьте приложение: ${YELLOW}http://steins.ru${NC}"
echo ""
echo "Для просмотра логов выполните:"
echo -e "${YELLOW}ssh $VPS_HOST 'cd $PROJECT_DIR && docker compose logs -f'${NC}"

