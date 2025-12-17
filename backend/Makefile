SHELL := /bin/bash

VENV := .venv
PY := $(VENV)/bin/python
PIP := $(VENV)/bin/pip

APP_MODULE := app.main:app
HOST := 0.0.0.0
PORT := 8000

.PHONY: venv install run run-local test lint

venv:
	python3 -m venv $(VENV)
	$(PIP) install -U pip

install: venv
	$(PIP) install -r requirements.txt

# roda SEM depender do PYTHONPATH (usa "python -m uvicorn")
run:
	cd $(CURDIR) && \
	$(VENV)/bin/python -m uvicorn $(APP_MODULE) --host $(HOST) --port $(PORT) --reload

# Se você rodar fora do backend por engano, use isso:
run-local:
	cd $(CURDIR) && \
	PYTHONPATH="$(CURDIR)" $(VENV)/bin/python -m uvicorn $(APP_MODULE) --host $(HOST) --port $(PORT) --reload

test:
	cd $(CURDIR) && $(VENV)/bin/python -m pytest -q
