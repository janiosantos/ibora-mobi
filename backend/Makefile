.PHONY: up down logs shell install run

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

db-shell:
	docker-compose exec db psql -U postgres -d ibora_mobi

install:
	poetry install

run:
	poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
