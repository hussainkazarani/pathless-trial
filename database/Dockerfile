# base image
FROM ubuntu:22.04

# envs
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Kolkata
ENV PGPASSWORD=pathless

# installin postgres
RUN apt update && \
	apt install -y postgresql && \
	apt clean

# add postgres password, add judge and pathless_trail db
RUN service postgresql start && \
	su postgres -c "psql -c \"ALTER USER postgres PASSWORD 'space';\"" && \
	su postgres -c "psql -c \"CREATE USER judge WITH PASSWORD 'pathless';\"" && \
	su postgres -c "psql -c \"CREATE DATABASE pathless_trails OWNER judge;\"" && \
	su postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE pathless_trails TO judge;\""

# change to pasword auth
# configure postgres to accept external connections
RUN VERSION=$(ls /etc/postgresql/) && \
	sed -i 's/peer/md5/g' /etc/postgresql/$VERSION/main/pg_hba.conf && \
	sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/$VERSION/main/postgresql.conf && \
	echo "host all all 0.0.0.0/0 md5" >> /etc/postgresql/$VERSION/main/pg_hba.conf

# copy the sql to the environment
COPY init.sql /tmp/init.sql
RUN service postgresql start && \
	sleep 2 && \
	psql -U judge -d pathless_trails -f /tmp/init.sql && \
	rm /tmp/init.sql

# expose port
EXPOSE 5432

# run on startup
CMD ["bash","-c","service postgresql start && sleep infinity"]
