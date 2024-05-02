FROM --platform=linux/amd64 node:18.18.2-alpine
 
WORKDIR /app
  
COPY package.json pnpm-lock.yaml ./
 
RUN npm install -g pnpm
RUN pnpm install
  
COPY . .
  
EXPOSE 8080
  
CMD ["pnpm", "dev"]
