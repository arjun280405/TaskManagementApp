FROM node:20-alpine

WORKDIR /app/task-manager-backend

COPY task-manager-backend/package*.json ./
RUN npm install --production

COPY task-manager-backend/ ./

EXPOSE 5000

CMD ["npm", "start"]
