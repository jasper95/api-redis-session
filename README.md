# Template API

Rest API server for template.

## Running the App

```
  docker-compose up
```

## Documentation

Open the API documentation on this route `/api-docs`.

## Authentication

All routes are protected by Basic Authentication. Routes that need current user session are protected by JWT Authentication (cookie-based with key `access_token`). Authorize your requests with JWT by logging in using this route `/auth/login`. CSRF Token is also implemented because this API uses Cookie-based (http only) JWT.

### Sample Credentials

```
email: bernalesjasper@gmail.com
password: test
```


### CRUD Tasks

Please Use the swagger API Docs for ease of testing

#### Get List - GET `/base/${node}`

URL
```
  GET http://localhost:5000/v1/base/country?size=10&page=0&sort=population.desc,created_date.asc
```

#### Update By Id - PUT `/base/${node}/${id}`

  URL
```
  PUT http://localhost:5000/v1/base/country/6b6f70ef-914e-4152-bbc1-d79845606b5d
```

  Request Body
  ```
    {
      "country": "World",
      "population": 7592886791
    }
  ```

#### Delete By Id - DEL `/base/${node}/${id}`
  URL
```
  DEL http://localhost:5000/v1/base/country/6b6f70ef-914e-4152-bbc1-d79845606b5d
```