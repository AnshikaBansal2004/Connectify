# use latest (version) image as the base
FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Copy all files from the current directory to the /app directory in the container
COPY . /app

# Ignore the node_modules folder
COPY .dockerignore /app/.dockerignore

# Install dependencies (assuming package.json and package-lock.json are present)
RUN npm install

RUN npm run build

# Run the command to start the application
CMD ["npm", "run", "start"]