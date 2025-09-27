# Fitness Timer like a Social Network

That's example fitness application for sharing your workouts with others and going through a workout.

# Functionality

- User registration and authentication
- Create, read, update, and delete workouts
- Create/update/delete their own exercises or use predefined ones
- Start and track workout sessions
- View and manage user profiles
- See feed with workouts from other users
- Like and comment on workouts

# API endpoints

## Core Endpoints

- **GET /api/docs** - Swagger Documentation

## Authentication

- **POST /auth/register** - Register a new user
- **POST /auth/login** - Login and receive a JWT token
- **POST /auth/refresh** - Refresh JWT token
- **POST /auth/logout** - Logout (invalidate token)
- **GET /auth/me** - Get current user profile

## Users

- **GET /users/:id** - Get a specific user by ID
- **PUT /users/:id** - Update a specific user by ID
- **DELETE /users/:id** - Delete a specific user by ID

## Workouts (Trainings)

### CRUD Operations

- **POST /workouts** - Create a new workout
- **GET /workouts/:id** - Get a specific workout by ID
- **PUT /workouts/:id** - Update a specific workout by ID
- **DELETE /workouts/:id** - Delete a specific workout by ID

### Workout Collections

- **GET /workouts** - Get workouts with filters:
  - `?type=created` - Workouts you created
  - `?type=saved` - Workouts you saved
  - `?type=completed` - Workouts you've completed sessions for
- **GET /workouts/feed** - Get public workouts feed for discovery
- **GET /workouts/search** - Search for public workouts
  - `?q=searchTerm` - Search by name/description
  - `?muscle=CHEST` - Filter by muscle group
  - `?level=BEGINNER` - Filter by difficulty level

### Workout Interactions

- **POST /workouts/:id/save** - Save a workout to your collection
- **DELETE /workouts/:id/save** - Remove from saved workouts
- **POST /workouts/:id/like** - Like a workout
- **DELETE /workouts/:id/like** - Unlike a workout

## Workout Sessions

- **POST /workouts/:id/start** - Start a workout session
- **GET /workouts/:id/sessions** - Get all sessions for a workout
- **GET /sessions/:id** - Get specific session details
- **PUT /sessions/:id** - Update session (pause/resume/add notes)
- **POST /sessions/:id/complete** - Mark session as completed
- **DELETE /sessions/:id** - Cancel/delete a session

## Comments

- **GET /workouts/:id/comments** - Get comments for a workout
- **POST /workouts/:id/comments** - Create a comment on a workout
- **PUT /comments/:id** - Update a comment
- **DELETE /comments/:id** - Delete a comment

## Exercise Definitions

- **GET /exercises** - Get all exercise definitions
- **POST /exercises** - Create a new exercise definition
- **GET /exercises/:id** - Get specific exercise definition
- **PUT /exercises/:id** - Update exercise definition
- **DELETE /exercises/:id** - Delete exercise definition
