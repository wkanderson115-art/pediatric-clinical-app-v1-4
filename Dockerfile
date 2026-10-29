FROM python:3.12-slim
WORKDIR /srv
COPY requirements.txt .
RUN apt-get update && apt-get install -y --no-install-recommends tesseract-ocr tesseract-ocr-chi-sim tesseract-ocr-eng && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir -r requirements.txt
COPY app app
COPY data data
COPY docs docs
COPY web web
RUN mkdir -p /srv/private && chmod 700 /srv/private
VOLUME ["/srv/private"]
ENV PYTHONUNBUFFERED=1
# Only trust X-Forwarded-* headers from the reverse proxy's known address or
# CIDR. Override this value in the deployment environment when applicable.
ENV FORWARDED_ALLOW_IPS=127.0.0.1
EXPOSE 8000
CMD ["sh", "-c", "exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --proxy-headers --forwarded-allow-ips \"${FORWARDED_ALLOW_IPS}\""]
