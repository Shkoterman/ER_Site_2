# Используем официальный образ Node.js
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем переменную окружения NODE_ENV в production
ENV NODE_ENV=production

# Копируем package.json и package-lock.json (или yarn.lock) для установки зависимостей
COPY package*.json ./

# Устанавливаем только production зависимости
RUN npm ci --only=production
# Если нет package-lock.json, можно использовать:
# RUN npm install --production

# Копируем остальные файлы проекта
COPY . .

# Собираем Next.js приложение
RUN npm run build

# Открываем порт 3000
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "start"]