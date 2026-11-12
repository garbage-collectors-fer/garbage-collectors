# Gradi frontend i backend u jednu aplikaciju: backend posluzuje izgradeni React.

FROM node:22-alpine AS frontend
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
# Kljuc za Google Maps dolazi iz Render varijable okruzenja, ne iz repozitorija
ARG VITE_GOOGLE_MAPS_API_KEY
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY
RUN npm run build

FROM eclipse-temurin:21-jdk AS backend
WORKDIR /app
COPY backend/ ./
COPY --from=frontend /app/dist src/main/resources/static
RUN sh mvnw -q -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=backend /app/target/ecosentry-0.0.1-SNAPSHOT.jar app.jar
CMD ["java", "-jar", "app.jar"]
