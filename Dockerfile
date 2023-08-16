# Use an official Node.js runtime as the base image
FROM node:lts

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the app's files to the container
COPY . .

# Build the app
RUN npm run build

# Set environment variables if needed (optional)
# ENV REACT_APP_API_URL=http://api.example.com

# Expose the port your app runs on
EXPOSE 8000

# Command to start the app when the container is run
CMD ["npm", "start"]
