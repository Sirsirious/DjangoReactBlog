# Use an official Python runtime as a parent image
FROM python:3.11-slim-buster

# Set the working directory in the container to /app
WORKDIR /app

# Install the required system dependencies
RUN apt-get update && apt-get install -y \
    make \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry using official method
RUN pip install "poetry==1.5.1"

# Set Environmet variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Copy the current directory contents into the container at /app
COPY . /app

# Set poetry to not create virtual envs
RUN poetry config virtualenvs.create false \
  && poetry install --no-interaction --no-ansi

# Make port 8000 available to the world outside this container
EXPOSE 8000

