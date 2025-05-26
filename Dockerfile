# Этап сборки
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

# Этап запуска
FROM node:20 AS runner

WORKDIR /app

# Копируем только нужные файлы
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/nodemon.json ./
COPY --from=builder /app/.env .env

EXPOSE 3000

CMD ["npm", "start"]
