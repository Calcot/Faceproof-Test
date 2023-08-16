FROM node:lts as builder
WORKDIR /app
COPY . .
COPY package.json package-lock.json ./
RUN npm ci --only=production
RUN npm install --arch=x64 --platform=linuxmusl --prefer-offline esbuild

RUN npm run build:dev
# Stage 2: Serve the built app with a minimal web server
FROM node:lts as runner
WORKDIR /app
RUN npm install -g http-server
COPY --from=builder /app/dist ./dist
EXPOSE 8000
CMD ["http-server", "./dist", "-p", "8000"]
