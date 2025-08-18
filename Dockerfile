# get image
FROM ubuntu:22.04

# download node
RUN apt update
RUN apt install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
RUN	apt-get install -y postgresql-client
RUN apt install -y nodejs
RUN apt clean


# WORKDIR /home/pathless-trails

# copy package.json and install node module
WORKDIR /home/app/backend
COPY backend/package*.json ./
RUN npm install

# set working directory
WORKDIR /home/app

# copy all files
COPY . .

# expose port
EXPOSE 1000

# home directory
RUN chmod +x entry.sh

# run server
CMD ["./entry.sh"]
