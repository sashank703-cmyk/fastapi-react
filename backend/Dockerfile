FROM python:3.13-slim
 
WORKDIR /app
 
COPY . .
 
RUN pip install --no-cache-dir \
    fastapi \
    uvicorn
 
EXPOSE 8000
 
CMD ["python", "main.py"]
