#!/bin/bash
export PGPASSWORD=pathless

until psql -h custom-postgres -U judge -d pathless_trails -p 5432 -c '\q';  do
	echo "Waiting for PostgresSQL"
	sleep 1
done

echo "Successfully started PostgresSQL"
cd backend
exec npm start
