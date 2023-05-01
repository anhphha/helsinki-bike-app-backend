# Introduction

The apps purpose is to display information about Helsinki city bike stations and show data about journeys made with the bikes.

# ToDo

- Setup containers with docker-compose: MongoDB, API, Application
- Setup MongoDB
- Setup API
- Setup a CI/CD pipe
- [Backend implementation] Setup mongoDB
- Testing

# Data
- Import data from the CSV files to a database
- Validate data before importing

# Instructions to run locally

Create .env file and add your MONGO_URI there and also the port you want to run the server on.

```
## Install dependencies for server
npm install
## Install dependencies for client
npm run client-install
## Run the client & server with concurrently
npm run dev
# Run the Express server only
npm run server
## Run the React client only
npm run client
```
# Datasets

https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv

https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv

https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv

https://opendata.arcgis.com/datasets/726277c507ef4914b0aec3cbcfcbfafc_0.csv

License and information: https://www.avoindata.fi/data/en/dataset/hsl-n-kaupunkipyoraasemat/resource/a23eef3a-cc40-4608-8aa2-c730d17e8902