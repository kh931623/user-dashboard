A simple Express App that provide user signup/login & dashboard features.

## Prerequisite
- node v20.x
- docker/docker-compose

## Run in local 
First install deps
```
npm i
```

Create `.env` file and fill out the missing vars
```
cp .env.example .env
```

Setup docker services
```
docker-compose up -d
```

Start the server
```
npm start
```

Visit http://localhost:3000 for the App!
