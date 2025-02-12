FROM tensorflow/tensorflow:latest-gpu

WORKDIR /app

COPY ./app/requirements.txt ./

RUN pip3 install --no-cache-dir -r requirements.txt

COPY ./app ./

EXPOSE 9000

CMD ["uvicorn","main:app","--host","0.0.0.0","--port","9000"]