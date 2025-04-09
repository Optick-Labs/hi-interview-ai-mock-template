# AI Behavioral Interview App

## Project Overview
This project is a behavioral interview application built on the T3 stack. It enables users to practice for job interviews by conversing with AI-powered mock interviewers. Users can select different interview types, receive feedback, and track their performance over time.

## Tech Stack
- **Frontend:** Next.js with App Router, React, Tailwind CSS, Shadcn UI, Radix UI
- **Backend:** Node.js, tRPC
- **Database:** PostgreSQL with Prisma ORM
- **AI Integration:** OpenAI for conversation generation

## Data Models

### User
- Represents application users (interviewees)
- Can be associated with a company
- Maintains conversations and evaluations

### Company
- Organization that users may belong to
- Has a name and optional logo

### Conversation
- Represents individual messages in an interview session
- Messages can be either questions (from AI) or answers (from user)
- Contains the message content and type
- Messages are grouped by sessionId to form complete interviews

### Evaluation
- Assessment of a completed interview
- Includes numerical score and textual feedback
- Associated with a conversation and user

## Current Status
- Initial database schema defined using Prisma

## Implementation Plan

### Phase 1: Setup & Authentication
- [x] Define database schema
- [ ] Setup NextAuth authentication with email/password and social providers
- [ ] Create user profile management pages

### Phase 2: Interview Setup
- [ ] Create interviewer profiles (AI personas)
- [ ] Build interview type selection interface
- [ ] Implement interview configuration page
- [ ] Setup tRPC routes for interview management

### Phase 3: Conversation Interface
- [ ] Design and implement chat interface
- [ ] Setup OpenAI integration for AI responses
- [ ] Implement real-time interaction with streaming responses
- [ ] Create conversation history and management

### Phase 4: Evaluation System
- [ ] Implement algorithm for analyzing user responses
- [ ] Create detailed feedback generation system
- [ ] Build evaluation results display
- [ ] Setup progress tracking over time

### Phase 5: Dashboard & Analytics
- [ ] Create user dashboard with interview history
- [ ] Implement analytics for performance trends
- [ ] Build admin dashboard for oversight
- [ ] Add export functionality for reports

## App Features

### For Users
- Authentication and profile management
- Selection of interview types and AI personas
- Real-time conversation interface with AI interviewers
- Detailed feedback and evaluation after interviews
- Performance tracking and improvement suggestions

### For Administrators
- User management
- Analytics dashboard
- Interview template configuration
- System configuration and monitoring

## Next Steps
1. Implement authentication system
2. Create basic user interface components
3. Setup OpenAI integration for conversations 