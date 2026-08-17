FROM node:22-alpine
RUN apk add --no-cache nginx
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build
RUN rm -rf /usr/share/nginx/html && cp -r dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/http.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
