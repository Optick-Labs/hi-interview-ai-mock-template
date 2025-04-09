# API Routes Documentation

## Overview
The API for the Behavioral Interview App is built with tRPC, providing end-to-end type safety. Below are the routes available in the application.

## Base URL
All API routes are accessible via `/api/trpc/[route]`.

## Routes Structure

### Companies (`/api/companies`)
Manages company information.

| Route | Method | Description | Parameters |
|------|--------|-------------|-----------|
| `getAll` | GET | Retrieve all companies | None |
| `getById` | GET | Get a company by ID | `id: string` |
| `create` | POST | Create a new company | `name: string, logo?: string` |
| `update` | PUT | Update an existing company | `id: string, name?: string, logo?: string` |
| `delete` | DELETE | Delete a company | `id: string` |

### Interviews (`/api/interviews`)
Manages interview sessions.

| Route | Method | Description | Parameters |
|------|--------|-------------|-----------|
| `getAll` | GET | Retrieve interviews with optional filtering | `userId?: string, status?: string, limit?: number, cursor?: string` |
| `getById` | GET | Get an interview by ID | `id: string` |
| `create` | POST | Create a new interview | `title: string, description?: string, userId: string, scheduledFor?: Date, status?: string` |
| `update` | PUT | Update an existing interview | `id: string, title?: string, description?: string, status?: string, scheduledFor?: Date, endedAt?: Date` |
| `delete` | DELETE | Delete an interview | `id: string` |

### Conversations (`/api/conversations`)
Manages conversation messages within interviews.

| Route | Method | Description | Parameters |
|------|--------|-------------|-----------|
| `getByInterviewId` | GET | Get messages for an interview | `interviewId: string, limit?: number, cursor?: string` |
| `create` | POST | Create a new message | `content: string, type: "QUESTION" or "ANSWER", interviewId: string, userId: string` |
| `generate` | POST | Generate an AI response | `interviewId: string, userId: string, previousMessages?: array, prompt?: string` |

### Evaluations (`/api/evaluations`)
Manages interview evaluations.

| Route | Method | Description | Parameters |
|------|--------|-------------|-----------|
| `getByUserId` | GET | Get evaluations for a user | `userId: string` |
| `getById` | GET | Get an evaluation by ID | `id: string` |
| `create` | POST | Create a manual evaluation | `score: number, feedback: string, interviewId: string, userId: string` |
| `generateEvaluation` | POST | Generate an AI-powered evaluation | `interviewId: string, userId: string` |

## Authentication
Currently, all routes are public procedures. Authentication will be implemented in a future update.

## Data Types

### MessageType
- `QUESTION` - Message from the AI interviewer
- `ANSWER` - Response from the user

### InterviewStatus
- `SCHEDULED` - Interview is scheduled for future
- `IN_PROGRESS` - Interview is currently in progress
- `COMPLETED` - Interview has been completed
- `CANCELLED` - Interview was cancelled

## Error Handling
All routes return standardized error responses:

- `NOT_FOUND` - Resource not found
- `BAD_REQUEST` - Invalid request parameters
- `INTERNAL_SERVER_ERROR` - Server-side error

## Future Enhancements
- Authentication and authorization
- Pagination for large result sets
- WebSocket for real-time conversations
- File uploads for user profiles 