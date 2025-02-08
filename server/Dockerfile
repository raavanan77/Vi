FROM python:3.13.1-slim

WORKDIR /app

COPY . /app

RUN pip install -r requirements.txt

ENTRYPOINT [ "python" ] 

EXPOSE 8000

CMD [ "manage.py", "runserver", "0.0.0.0:8000" ]