#!/bin/bash

export PGPASSWORD=pathless

until psql -h custom-postgres -U judge -d pathless_trails -p 5432 -c '\q';  do
	sleep 1
done

cd backend
exec npm start
