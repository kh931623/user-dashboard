A simple Express App that provide user signup/login & dashboard features.

## Purpose of this project
- practice google oauth
- try out prisma ORM
- try out sendGrid email service integration
- implement some user tracking features

## Use cases
- users can sign-in/sign-up with google oauth or their own emails
- signed-in users can change their user names
- after users signing up with their own emails, the system would send them verification emails so they can verify their accounts.
- verify users can view user dashboard which shows:
  - user list
    - sign-up time
    - login count
    - last session at
  - total active users today
  - Average active users for the last 7 days

## Project Concepts
- Express Backend
- EJS front-end directly served from express
- prisma ORM
- redis based session storage

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

Run database migrations
```
npx prisma migrate dev
```

Start the server
```
npm start
```

Visit http://localhost:3000 for the App!
