# Utilizar la imagen específica de Node.js 20.17.0
FROM node:20.17.0

# Crear y establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de la aplicación
COPY . .

# Instalar las dependencias de la aplicación
RUN npm install 

# Compilar la aplicación Angular
RUN npm run build -- --configuration production

# Usar una imagen de Nginx para servir la aplicación
FROM nginx:1.19

# Copiar los archivos compilados a Nginx
COPY --from=0 /app/dist/angular-front /usr/share/nginx/html

# Copiar el archivo de configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Comando para ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]
