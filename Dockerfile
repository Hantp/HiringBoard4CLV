FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A willdcard is used to ensure both package.json, AND package-lock.json are copied where available (npm@5+)
COPY package.json /usr/src/app/

RUN npm install
# RUN npm i bcrypt
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . /usr/src/app/

EXPOSE 3000

CMD ["npm", "start"]