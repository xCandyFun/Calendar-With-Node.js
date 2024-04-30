# Use an official Node.js runtime as the base image
FROM node:slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code to the working directory
COPY . .

# Expose the port your application runs on
EXPOSE 8081

# Define the command to run your Node.js application
CMD ["node", "app.js"]