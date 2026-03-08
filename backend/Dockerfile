# Usa uma imagem leve do Node.js
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências (serão criados pelo seu colega depois)
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código da API
COPY . .

# Expõe a porta que o back-end vai usar (geralmente 3000 ou 5000)
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]