FROM node:lts-alpine
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies inside the container
RUN npm install

# Copy the rest of the application
COPY . .

CMD ["npm", "run", "dev"]

EXPOSE 5050