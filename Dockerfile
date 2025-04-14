FROM node:20.11.0-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN touch .env
RUN npm install -D postcss autoprefixer
RUN echo "module.exports = { plugins: { autoprefixer: {} } }" > postcss.config.js
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]