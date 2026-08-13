FROM node:20-alpine

WORKDIR /app
RUN apk add --no-cache bash
COPY mobile/package*.json ./
RUN npm install
COPY mobile/ .
EXPOSE 8082 19000 19001 19002

CMD ["npx", "expo", "start", "--port", "8082", "--host", "lan"]