# Etapa 1: Instalar dependencias
FROM node:18-alpine as dev-deps

WORKDIR /app

COPY package.json package.json

RUN npm install

# Etapa 2: Construir la aplicación
FROM node:18.16.1 as builder

WORKDIR /app

COPY --from=dev-deps /app/node_modules ./node_modules

COPY . .

RUN npm run build

# Etapa 3: Preparar el entorno de producción
FROM nginx:stable-perl as prod


EXPOSE 80



COPY --from=builder /app/dist/front-andeskar /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]





# #for dev
# FROM node:18-alpine

# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build
# CMD ["npm", "start"]

# #for prod
# #FROM node:18-alpine AS build
# #WORKDIR /app

# #COPY . .
# #RUN npm install
# #RUN npm run build
# # Serve Application using Nginx Server
# #FROM nginx:alpine
# #COPY --from=build /app/dist/project-name/ /usr/share/nginx/html
# #EXPOSE 80