# API Documentation

## Endpoint: `/users/register`

### Method: POST

### Description:

This endpoint is used to register a new user by providing their details.

### Request Body:

The request body must be a JSON object with the following structure:

```json
{
  "fullname": {
    "firstname": "string (min: 3 characters, required)",
    "lastname": "string (min: 3 characters, optional)"
  },
  "email": "string (valid email format, required)",
  "password": "string (min: 6 characters, required)"
}
```

### Response:

#### Success (201 Created):

- **Description**: User successfully registered.
- **Response Body**:
  ```json
  {
    "token": "string (JWT token)",
    "user": {
      "_id": "string",
      "fullname": {
        "firstname": "string",
        "lastname": "string"
      },
      "email": "string"
    }
  }
  ```

#### Error (400 Bad Request):

- **Description**: Validation error or missing required fields.
- **Response Body**:
  ```json
  {
    "errors": [
      {
        "msg": "string (error message)",
        "param": "string (field name)",
        "location": "string (body)"
      }
    ]
  }
  ```

### Notes:

- The `password` field is hashed before being stored in the database.
- A JWT token is returned upon successful registration for authentication purposes.

## Endpoint: `/users/login`

### Method: POST

### Description:

This endpoint is used to authenticate a user and log them in.

### Request Body:

The request body must be a JSON object with the following structure:

```json
{
  "email": "string (valid email format, required)",
  "password": "string (min: 6 characters, required)"
}
```

### Response:

#### Success (200 OK):

- **Description**: User successfully logged in.
- **Response Body**:
  ```json
  {
    "token": "string (JWT token)",
    "user": {
      "_id": "string",
      "fullname": {
        "firstname": "string",
        "lastname": "string"
      },
      "email": "string"
    }
  }
  ```

#### Error (400 Bad Request):

- **Description**: Validation error or incorrect credentials.
- **Response Body**:
  ```json
  {
    "errors": [
      {
        "msg": "string (error message)",
        "param": "string (field name)",
        "location": "string (body)"
      }
    ]
  }
  ```

---

## Endpoint: `/users/profile`

### Method: GET

### Description:

This endpoint is used to retrieve the profile of the currently authenticated user.

### Headers:

- **Authorization**: `Bearer <JWT token>` (required)

### Response:

#### Success (200 OK):

- **Description**: User profile retrieved successfully.
- **Response Body**:
  ```json
  {
    "_id": "string",
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string"
  }
  ```

#### Error (401 Unauthorized):

- **Description**: Missing or invalid authentication token.
- **Response Body**:
  ```json
  {
    "error": "string (error message)"
  }
  ```

---

## Endpoint: `/users/logout`

### Method: GET

### Description:

This endpoint is used to log out the currently authenticated user. The logout process involves clearing the authentication token from the user's cookies and blacklisting the token to prevent further use.

### How Logout Works:

1. The server clears the `token` cookie from the user's browser.
2. The token (retrieved from the cookie or the `Authorization` header) is added to a blacklist in the database.
3. Any subsequent requests using the blacklisted token will be rejected, ensuring the user is fully logged out.

### Headers:

- **Authorization**: `Bearer <JWT token>` (required)

### Response:

#### Success (200 OK):

- **Description**: User successfully logged out.
- **Response Body**:
  ```json
  {
    "message": "User logged out successfully"
  }
  ```

#### Error (401 Unauthorized):

- **Description**: Missing or invalid authentication token.
- **Response Body**:
  ```json
  {
    "error": "string (error message)"
  }
  ```
