FROM bitnami/pytorch

WORKDIR /app

# Create cache directory and set permissions
RUN mkdir -p /app/.cache && chmod -R 777 /app/.cache

COPY ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

COPY ./server/models.py /app/server/models.py

# Set environment variables for cache
ENV TRANSFORMERS_CACHE=/app/.cache
ENV HF_HOME=/app/.cache

# Download the model with proper permissions
RUN python /app/server/models.py

COPY ./server/ /app/server/

CMD ["uvicorn", "server.main:app", "--host", "0.0.0.0", "--port", "7000"]