postgresinit:
	docker run --rm --name postgres -p 1234:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -d postgres

postgres:
	docker exec -it postgres psql

createdb:
	docker exec -it postgres createdb --username=root --owner=root go-realtimechat

dropdb:
	docker exec -it postgres dropdb go-realtimechat

.PHONY: postgresinit postgresstart postgres createdb dropdb

