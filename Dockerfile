# Многоступенчатая сборка для оптимизации размера образа

# Этап 1: Установка зависимостей
FROM node:20-alpine AS deps
WORKDIR /app

# Копируем файлы зависимостей
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm ci --only=production

# Этап 2: Сборка приложения
FROM node:20-alpine AS builder
WORKDIR /app

# Копируем зависимости из предыдущего этапа
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Переменные окружения для сборки (можно переопределить через build args)
ARG NEXT_PUBLIC_APP_URL
ARG BACKEND_API_URL
ARG ORY_SDK_URL

ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV BACKEND_API_URL=$BACKEND_API_URL
ENV ORY_SDK_URL=$ORY_SDK_URL
ENV NODE_ENV=production

# Устанавливаем все зависимости (включая dev) для сборки
RUN npm ci

# Собираем приложение
RUN npm run build

# Этап 3: Production образ
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Создаем пользователя для безопасности
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем необходимые файлы из builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Меняем владельца файлов
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Запускаем приложение
CMD ["node", "server.js"]

