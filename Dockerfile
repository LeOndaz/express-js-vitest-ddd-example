FROM node:lts-slim
  
WORKDIR /app
  
COPY package.json pnpm-lock.yaml ./
  
RUN pnpm install
  
COPY . .
  
RUN pnpm build
  
EXPOSE 3000
  
CMD ["pnpm", "start"]
