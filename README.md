# Dad-a-base Jokes API

Mainly just a place to dump of the awful jokes I've collected over the years and I encourage other people to add to them :D

Following along to the <https://remix.run/docs/en/v1/tutorials/jokes> tutorial to get to grips with the Remix.js indie stack and deploying my app with a mariadb instance through Docker.

## Local development

1. `cp .env.example .env`
2. Populate `.env` with your values - be sure the environment is set to something other than `production`, `MYSQL_HOST` is set to `localhost` and the `DATABASE_URL` uses the `MYSQL_LOCAL_PORT`
3. `docker-compose build db` to build the database container
4. `docker-compose up -d db` to spin up the database container
5. Outside your container, run `npm install`
6. Outside your container, run `npm run dev`
7. Access your app via <http://localhost:3001/> - beware that the port sometimes changes to 300x if 3001 is already in use.

* On first installation, you may get a DB error when trying to seed. If this occurs, try running our flush script in the container like so: `npm run prisma:flush`

## Production deployment

1. `cp .env.example .env`
2. Populate `.env` with your values - be sure the environment is set to production, `MYSQL_HOST` is set to your db container name and the `DATABASE_URL` uses the `MYSQL_DOCKER_PORT`
3. `docker-compose build` to build the containers
4. `docker-compose up -d` to spin up the containers
5. Access your app via <http://localhost:6868/> or use a reverse proxy to point your domain at port 6868.

- On first deployment, you may get a DB error when trying to seed. If this occurs, try running our flush script in the container like so:
  - `docker-compose exec app bash`
  - `npm run prisma:flush`

## Implementation details

### API endpoints

#### `/api/jokes/?showNsfw=<boolean>`

This will give you the JSON for a random joke.

Optional param `showNsfw` will filter jokes accordingly based on whether they contain content that is "safe for work" or not.

An example request to grab a random joke may look like this:

```javascript
const response = await fetch(
  'https://jokes.timbryan.dev/api/jokes?showNsfw=true',
)
if (response.status === 200) {
  const data = await response.json()
  const { content } = data.randomJoke
  console.log(content)
}
```

Where the JSON data being returned may look like:

```json
{
  "randomJoke": {
    "id": "<uuidv4 string>",
    "jokesterId": "<uuidv4 string>",
    "createdAt": "<DateTime as ISO string>",
    "updatedAt": "<DateTime as ISO string>",
    "name": "Banana",
    "content": "Why did Billy get fired from the banana factory? He kept throwing away the bent ones.",
    "nsfw": false
  },
  "jokester": "TimBryan"
}
```

#### `/api/jokes/:id`

This will give you the JSON for a specific joke matching the provided ID.

An example of a request to grab a specific joke may look like this:

```javascript
const response = await fetch(
  'https://jokes.timbryan.dev/api/jokes/37df94f6-0ed2-4ea0-8ec6-3834af011e11',
)
if (response.status === 200) {
  const data = await response.json()
  const { content } = data.joke
  console.log(content)
}
```

Where the JSON data being returned may look like:

```json
{
  "joke": {
    "id": "<uuidv4 string>",
    "jokesterId": "<uuidv4 string>",
    "createdAt": "<DateTime as ISO string>",
    "updatedAt": "<DateTime as ISO string>",
    "name": "Banana",
    "content": "Why did Billy get fired from the banana factory? He kept throwing away the bent ones.",
    "nsfw": false
  },
  "jokester": "TimBryan",
  "isJokeOwner": false
}
```

### Auth flow

- On the `/login` route.
- User submits login form.
- Form data is validated.
  - If the form data is invalid, return the form with the errors.
- Login type is "register"
  - Check whether the username is available
    - If the username is not available, return the form with an error.
  - Hash the password
  - Create a new user
- Login type is "login"
  - Check whether the user exists
    - If the user doesn't exist, return the form with an error.
  - Check whether the password hash matches
    - If the password hash doesn't match, return the form with an error.
- Create a new session
- Redirect to the `/jokes` route with the `Set-Cookie` header.
