FROM node:20-alpine

WORKDIR /app

# Install required tools
RUN apk update && apk add --no-cache \
    g++ gcc libstdc++ make python3 openjdk17-jdk

# Copy package files
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install

# Copy remaining files
COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
