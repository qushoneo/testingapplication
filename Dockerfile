# Базовый образ с Node.js (используем версию 20, так как у тебя "@types/node": "^20")
FROM node:20-alpine

# Установка рабочей директории
WORKDIR /app

# Копирование package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копирование остальных файлов проекта
COPY . .

# Установка Prisma и генерация клиента
RUN npx prisma generate

# Сборка приложения
RUN npm run build

# Указание порта (Next.js по умолчанию использует 3000)
EXPOSE 3000

# Команда для запуска приложения
CMD ["npm", "start"]