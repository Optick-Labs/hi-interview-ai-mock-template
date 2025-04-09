# Database Schema Documentation

## Overview
The database schema for the AI Behavioral Interview App uses Prisma ORM with PostgreSQL. The schema is designed to support user management, interview conversations, and performance evaluations.

## Models

### User
```prisma
model User {
    id             String         @id @default(uuid())
    name           String
    email          String         @unique
    image          String?
    createdAt      DateTime       @default(now())
    updatedAt      DateTime       @updatedAt
    conversations  Conversation[]
    evaluations    Evaluation[]
    companyId      String?
    company        Company?       @relation(fields: [companyId], references: [id])
}
```

**Description:**
- Core model for user accounts
- Stores basic user information and authentication details
- Can be associated with a company
- Related to conversations and evaluations

### Company
```prisma
model Company {
    id        String   @id @default(uuid())
    name      String
    logo      String?
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    users     User[]
}
```

**Description:**
- Represents organizations users may belong to
- Has a name and optional logo
- Can have multiple users associated with it

### Conversation
```prisma
model Conversation {
    id          String      @id @default(uuid())
    content     String
    type        MessageType
    sessionId   String
    userId      String
    user        User        @relation(fields: [userId], references: [id])
    evaluation  Evaluation?
    timestamp   DateTime    @default(now())
    createdAt   DateTime    @default(now())
    updatedAt   DateTime    @updatedAt
}
```

**Description:**
- Represents an individual message in an interview session
- Contains the message content and its type (question or answer)
- Messages are grouped by sessionId to form a complete interview
- Linked to a specific user
- May have an evaluation (typically only for the final message)
- Has a timestamp for when the message was created

### Evaluation
```prisma
model Evaluation {
    id             String       @id @default(uuid())
    score          Int
    feedback       String
    conversationId String       @unique
    conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
    userId         String
    user           User         @relation(fields: [userId], references: [id])
    createdAt      DateTime     @default(now())
    updatedAt      DateTime     @updatedAt
}
```

**Description:**
- Assessment of a completed interview
- Includes a numerical score and textual feedback
- One-to-one relationship with a conversation
- Uses cascade deletion when a conversation is deleted
- Also linked to the user for easy retrieval of all evaluations

## Enums

### MessageType
```prisma
enum MessageType {
    QUESTION
    ANSWER
}
```

**Description:**
- Defines the type of message in a conversation
- QUESTION: Messages from the AI interviewer
- ANSWER: Responses from the user

## Relationships

1. **User to Conversations**: One-to-many (a user can have multiple conversations)
2. **User to Evaluations**: One-to-many (a user can have multiple evaluations)
3. **User to Company**: Many-to-one (many users can belong to one company)
4. **Conversation to Evaluation**: One-to-one (a conversation message has at most one evaluation)

## Data Organization

- All messages in an interview session share the same `sessionId`
- Messages are ordered by their `timestamp`
- A complete interview consists of multiple conversation records with the same `sessionId`
- The `type` field determines if the message is from the AI (QUESTION) or the user (ANSWER)

## Future Considerations

1. **Interviewer Profiles**: We may need to add a model for AI interviewer personas
2. **Interview Templates**: Add templates for different interview types
3. **User Authentication**: Integrate with NextAuth for auth providers
4. **Analytics**: Add models for tracking user progress over time 