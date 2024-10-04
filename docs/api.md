# FlowMD API Documentation 

## Versioning

Current version of the API is `v1`. All the endpoints are prefixed with `/v1`.

## End Points

These are available endpoints for the FlowMD API.

**Authentication** : 
- POST `/v1/auth/login`
- POST `/v1/auth/register`
- POST `/v1/auth/google`

**Authenticated User** :
- GET `/v1/auth/profile`
- PUT `/v1/auth/profile`

---

### GET /v1/auth/login

Get authorization token for the user.

#### Request


Body
```json
{
  "email": "string",
  "password": "string"
}
```

#### Response

Response - 200 OK
```json
{
    "message": "Login success",
    "data": {
        "access_token": "string",
        "user": {
            "username": "string",
            "email": "string",
            "avatar": "string"
        }
    }
}
```

Respones - 400 Bad Request
```json
{
    "status": 400,
    "message": "Bad Request",
    "name": "BadRequestError",
    "errors": [
        {
            "field": "email",
            "message": "Email is not valid"
        },
        {
            "field": "email",
            "message": "Email should not be empty"
        },
        {
            "field": "password",
            "message": "Password should not be empty"
        }
    ]
}
```

Response - 401 Unauthorized
```json
{
    "status": 401,
    "message": "Invalid credentials",
    "name": "UnauthorizedError"
}
```


### POST /v1/auth/register

Register a new user.

#### Request

Body
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### Response

Response - 201 Created
```json
{
    "message": "User created",
    "data": {
        "user": {
            "username": "string",
            "email": "string",
            "avatar": "string"
        }
    }
}

```
Response - 400 Bad Request
```json
{
    "status": 400,
    "message": "Bad Request",
    "name": "BadRequestError"
    "errors": [
        {
            "field": "username",
            "message": "Username already exists"
        }
    ]
}
```


### POST /v1/auth/google

Login with Google.

#### Request

Body
```json
{
  "access_token": "string"
}
```

#### Response

Response - 200 OK
```json
{
    "message": "Login success",
    "data": {
        "access_token": "string",
        "user": {
            "username": "string",
            "email": "string",
            "avatar": "string"
        }
    }
}
```

### GET /v1/auth/profile

Get user profile.

#### Request

Header
```
Authorization: Bearer <access_token>
```

#### Response

Response - 200 OK
```json
{
    "message": "User found",
    "data": {
        "user": {
            "username": "string",
            "email": "string",
            "avatar": "string"
            "createdAt": "string",
            "updatedAt": "string"
        }
    }
}
```

### PUT /v1/auth/profile

Update user profile.

#### Request

Header
```
Authorization: Bearer <access_token>
```

Body (multipart/form-data)
```json
{
  "username": "string",
  "avatar": "file"
}
```

#### Response

Response - 200 OK
```json
{
    "message": "User updated",
    "data": {
        "user": {
            "username": "string",
            "email": "string",
            "avatar": "string",
            "createdAt": "string",
            "updatedAt": "string"
        }
    }
}
```

Response - 400 Bad Request
```json
{
    "status": 400,
    "message": "Bad Request",
    "name": "BadRequestError",
    "errors": [
        {
            "field": "username",
            "message": "Username already exists"
        }
    ]
}
```

---

## Global Error Response

Response - 400 Bad Request
```json
{
    "status": 400,
    "message": "Bad Request",
    "name": "BadRequestError"
}
``` 

Response - 401 Unauthorized
```json
{
    "status": 401,
    "message": "Unauthorized",
    "name": "UnauthorizedError"
}
```

Response - 404 Not Found
```json
{
    "status": 404,
    "message": "Not Found",
    "name": "NotFoundError"
}
```

Response - 500 Internal Server Error
```json
{
    "status": 500,
    "message": "Internal Server Error",
    "name": "InternalServerError"
}
```

