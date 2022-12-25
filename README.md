# Dad-a-base Jokes API

Following along to the <https://remix.run/docs/en/v1/tutorials/jokes> tutorial to get to grips with the Remix.js indie stack and deploying my app with a mariadb instance through Docker.

## Development

From your terminal:

```sh
cp .env.example .env
```

This will give you the template .env file that you'll need to fill in with your own values

```sh
npm install
```

This installs the Remix.js et all app dependencies.

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes. It'll also tell you what address and port to access the local build of your app on.

## Docker local setup / production deployment

I have used Docker to create a local mariadb instance for local development. We use the same docker configuration for production deployments.

For local development, rather than upping the app and mariadb, you can just up mariadb for your local database.

1. `docker-compose build` to build the containers
2. `docker-compose up -d app mariadb` to spin up the containers
3. Access your app via <http://localhost:6868/>

- On first installation, you may get a DB error when trying to seed. If this occurs, try running our flush script in the container like so:
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
