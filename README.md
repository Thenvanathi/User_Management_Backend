## Project Overview

This backend application provides secure authentication, user management, and admin-level controls for a user management system.
It supports user signup, login, profile access, and allows admins to activate or deactivate users using role-based authorization.

JWT authentication is implemented using HTTP-only cookies for better security.

# Tech Stack

- Node.js, Express.js, MongoDB, Mongoose, JWT(jsonwebtoken), bcrypt, CORS, cookie-parser, dotenv

## Setup Instructions

1. git clone <backend-repo-url>
   cd backend
   2.npm install

## .env

PORT=5000

1. PORT = 5000;
2. FRONTEND_URL
3. MONGO_URI =
4. JWT_SECRET

## Deployment Instructions

1. Platform : Render - pused backend code to GitHub , then have to create a new web service on render, set Environment variables in render , then Deploy.

## API Documentation

Link => https://.postman.co/workspace/DevTinder~5a547bd3-3a25-4d84-a87a-d7921666f8b5/collection/45857290-7f26e1b1-c4fc-4403-a8f2-e76f82359d48?action=share&creator=45857290

1. /api/auth/signup - POST
2. /api/auth/login - POST
3. /api/auth/logout - POST

4. /api/users/profile -GET
5. /api/users/profile - PUT
6. /api/users/change-password - PUT

7. /api/admin/users - GET
8. /api/admin/users/?page=1&limit=10 - GET
9. /api/admin/users/:userId/:action - PATCH
