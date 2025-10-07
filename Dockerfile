FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build


FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --only=production

COPY --from=builder /app/build ./build

COPY --from=builder /app/prisma ./prisma

EXPOSE 3333

CMD ["node", "build/infra/server.cjs"]