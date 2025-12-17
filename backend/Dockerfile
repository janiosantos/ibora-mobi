FROM python:3.11-slim

# Evita cache e melhora logs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PATH="/app/.venv/bin:$PATH"


WORKDIR /app

# Dependências do sistema (psycopg, build de libs)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    libpq-dev \
 && rm -rf /var/lib/apt/lists/*

# Instala dependências Python primeiro (melhor cache)
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copia o resto do projeto
COPY . /app

EXPOSE 8000

# Compose pode sobrescrever com --reload quando quiser
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
