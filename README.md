# 🎓 Alumni Tracking System

## 📖 Project Overview

This repository holds a semester-long project for the **Web Programming** course: an Alumni Tracking System that keeps graduates connected with their school or university — letting them stay in touch, follow community updates, and find out about upcoming events.

The project grows week by week, following the course structure — starting with basic routing, then moving into CRUD operations, database integration, authentication, and eventually deployment — with every step reflected in this repo's commit history.

## ✨ Features

- **Alumni Profiles** — create and view alumni profiles.
- **Contact Directory** — search and view contact information of other alumni.
- **Event Announcements** — see upcoming alumni events and announcements.

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Backend | Node.js (JavaScript) | Fast to build with, large ecosystem, works well with async I/O for a CRUD-style API. |
| Database | PostgreSQL | Reliable relational database with strong support for structured, related data (users, profile information, events, contact information). |
| Frontend | JavaScript, HTML/CSS | Simple, dependency-light way to build the interface while the project is early-stage. |
| DevOps | Docker & Docker Compose | Ensures the project runs the same way on any machine, avoids "works on my machine" issues. |
| Version Control | Git & GitHub | Required by the course; weekly commit history is part of the grading. |

## 📂 Project Structure

```text
alumni/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers and business logic
│   │   ├── models/           # Database models/queries
│   │   ├── routes/           # API route definitions
│   │   └── index.js          # Application entrypoint
│   └── package.json
├── frontend/
│   └── public/                # Static UI files (to be built out)
├── .env.example                # Template for environment variables
├── .dockerignore
├── docker-compose.yml          # Orchestration for app + PostgreSQL
├── Dockerfile
└── README.md
```

> This structure reflects the target layout for the project. Folders not yet populated are placeholders for upcoming weeks.

## 🚀 Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/)

### Running with Docker Compose

1. Clone the repository and move into the project folder:
   ```bash
   git clone https://github.com/emely022/alumni.git
   cd alumni
   ```

2. Build and start all containers with a single command:
   ```bash
   docker compose up
   ```

   A few other useful variants:
   ```bash
   docker compose up -d        # start containers in the background
   docker compose up --build   # force a rebuild before starting
   docker compose down         # stop containers and remove them
   ```
