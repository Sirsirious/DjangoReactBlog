# Pull base image
FROM node:19

# Set work directory
WORKDIR /app

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Install app dependencies
COPY package.json ./
#RUN npm install --silent
#RUN npm install react-scripts@4.0.1 -g --silent

# Copy project
COPY . ./

