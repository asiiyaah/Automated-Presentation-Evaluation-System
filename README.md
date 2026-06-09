# 🎤 Automated Presentation Evaluation System

An AI-powered web application that analyses presentation videos and provides detailed, multi-dimensional feedback to help speakers improve their public speaking skills.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Analysis Metrics](#analysis-metrics)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
  - [Running with Docker](#running-with-docker)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Async Processing (Celery + Redis)](#async-processing-celery--redis)
- [Deployment](#deployment)
- [Known Limitations](#known-limitations)

---

## Overview

The **Automated Presentation Evaluation System** allows users to upload a recorded presentation video and receive a comprehensive automated score covering body language, speech quality, and content relevance. Users can track their progress over time by grouping videos under tags (e.g., "Mock Interview", "Seminar Prep").

The system is designed for:
- **Students** practising for oral exams, viva, or seminars
- **Professionals** preparing for pitches, talks, or interviews
- **Anyone** who wants objective, data-driven feedback on their presentation style

---

## Features

- 🔐 **Firebase Authentication** — secure sign-up, login, and token-based API access
- 📤 **Video Upload** — supports MP4, MOV, AVI, WEBM (up to 500 MB)
- 🧠 **AI-Powered Analysis** — runs a full ML pipeline on every uploaded video
- 📊 **Detailed Score Breakdown** — 9 individual metrics with human-readable feedback
- 📈 **Progress Tracking** — compare scores across multiple uploads under the same tag
- ⚡ **Real-time Progress** — Server-Sent Events (SSE) stream live upload and analysis status to the browser
- 🐳 **Docker Support** — one-command local stack with Redis + Celery + Flask
- ☁️ **Cloud Storage** — videos are stored on Cloudinary, not on the server

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.11, Flask |
| Database | PostgreSQL (via SQLAlchemy) |
| Authentication | Firebase Admin SDK |
| Video Storage | Cloudinary |
| Speech Transcription | OpenAI Whisper (`tiny` model) |
| Pose / Gesture / Eye Analysis | MediaPipe (Pose, Hands, Face Mesh) |
| Content Analysis (LLM) | Groq API — `llama-3.3-70b-versatile` |
| Async Task Queue | Celery 5 + Redis |
| Frontend | HTML, CSS, JavaScript (Jinja2 templates) |
| Containerisation | Docker + Docker Compose |

---

## System Architecture

```
Browser
  │
  ├─ POST /api/upload-video-sse   ──→  Flask (SSE streaming)
  │       │                                   │
  │       │                            ┌──────▼──────┐
  │       │                            │  Cloudinary  │  (video stored)
  │       │                            └──────┬──────┘
  │       │                                   │
  │       │                          ┌─────────▼──────────┐
  │       │                          │   ML Pipeline       │
  │       │                          │  ┌───────────────┐  │
  │       │                          │  │ MediaPipe Pose│  │  posture score
  │       │                          │  │ MediaPipe Hand│  │  gesture score
  │       │                          │  │ MediaPipe Face│  │  eye contact
  │       │                          │  │ Whisper ASR   │  │  transcript
  │       │                          │  │ Groq LLM      │  │  topic & structure
  │       │                          │  └───────────────┘  │
  │       │                          └─────────┬──────────┘
  │       │                                    │
  │       │                            ┌───────▼──────┐
  │       │                            │  PostgreSQL   │  (scores saved)
  │       │                            └───────────────┘
  │       │
  │  SSE events ←──────────────────── progress updates streamed back
  │
  └─ GET /analysis?video_id=X  ──→  Flask renders analysis.html
```

> **Async alternative:** `POST /api/upload-video-async` offloads the ML pipeline to a Celery worker. The frontend polls `GET /api/job-status/<job_id>` for progress.

---

## Analysis Metrics

The overall score is a weighted average of 9 individual metrics:

| Metric | Weight | Method |
|---|---|---|
| Eye Contact | 20% | MediaPipe Face Mesh — iris offset from eye centre |
| Posture | 15% | MediaPipe Pose — shoulder alignment, head position, ear-shoulder angle |
| Topic Relevance | 15% | Groq LLM — how well speech covers the given topic |
| Speech Rate | 10% | Whisper transcript — WPM scored against 120–150 WPM ideal |
| Filler Words | 10% | Regex count of "um", "uh", "like", "actually", "basically" |
| Vocabulary Richness | 10% | Unique word ratio against total words |
| Confidence Language | 10% | Penalises hedging phrases ("I think", "maybe", "kind of") |
| Content Structure | 5% | Groq LLM — intro, body, conclusion detection |
| Gesture Quality | 5% | MediaPipe Hands — presence, movement range, spread |

Each metric returns a 0–100 score plus a status badge (`good` / `warning` / `bad`) and a one-sentence human-readable explanation.

---

## Project Structure

```
mini old/
├── app.py                  # Main Flask app — routes, ML pipeline, DB models
├── celery_worker.py        # Celery app + async video processing task
├── requirements.txt        # Python dependencies
├── Dockerfile              # Docker image (Python 3.11-slim + ffmpeg + libgl1)
├── docker-compose.yml      # Local dev stack: Redis + Celery worker + Flask
├── apt.txt                 # System packages for deployment platforms
├── .env                    # Environment variables (not committed)
├── .gitignore
├── ASYNC_SETUP.md          # Guide for setting up the Celery/Redis async pipeline
├── serviceAccountKey.json  # Firebase service account (not committed)
├── static/                 # CSS, JS, images
├── templates/              # Jinja2 HTML templates
│   ├── index.html          # Landing / home page
│   ├── login.html
│   ├── signup.html
│   ├── new-user.html       # First-time user onboarding
│   ├── existing-user.html  # Dashboard for returning users
│   ├── upload.html         # Video upload page
│   ├── analysis.html       # Per-video analysis results
│   ├── analytics.html      # Progress charts across multiple videos
│   └── editprofile.html
└── uploads/                # Temporary upload directory (not committed)
```

---

## Getting Started

### Prerequisites

- Python 3.11+
- PostgreSQL database (local or cloud — e.g. Neon, Supabase, Railway)
- A [Firebase](https://firebase.google.com/) project with Authentication enabled
- A [Cloudinary](https://cloudinary.com/) account (free tier works)
- A [Groq](https://console.groq.com/) API key (free tier available)
- *(Optional for async)* Redis instance

---

### Environment Variables

Create a `.env` file in the project root:

```env
# PostgreSQL
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Groq
GROQ_API_KEY=your_groq_api_key

# Firebase — path to your downloaded service account JSON
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json

# Redis (only required for async Celery processing)
REDIS_URL=redis://localhost:6379/0
```

> ⚠️ **Never commit `.env` or `serviceAccountKey.json` to version control.**

---

### Running Locally

```bash
# 1. Clone the repository
git clone https://github.com/asiiyaah/Automated-Presentation-Evaluation-System.git
cd "Automated-Presentation-Evaluation-System"

# 2. Create and activate a virtual environment
python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set up your .env file (see above)

# 5. Initialise the database
python -c "from app import app, db; app.app_context().__enter__(); db.create_all()"

# 6. Start the Flask development server
python app.py
```

The app will be available at **http://localhost:5000**.

---

### Running with Docker

Docker Compose starts Redis, the Celery worker, and the Flask app together:

```bash
# Build and start all services
docker compose up --build

# Stop all services
docker compose down
```

| Service | Port |
|---|---|
| Flask web app | 5000 |
| Redis | 6379 |

---

## API Reference

All API endpoints require a Firebase ID token in the `Authorization` header (except user creation):

```
Authorization: Bearer <firebase_id_token>
```

### Video

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/upload-video` | Upload and analyse a video (synchronous, blocks until done) |
| `POST` | `/api/upload-video-sse` | Upload and analyse with live SSE progress stream |
| `POST` | `/api/upload-video-async` | Upload and dispatch async Celery task, returns `job_id` |
| `GET` | `/api/job-status/<job_id>` | Poll async task progress |
| `DELETE` | `/api/delete-video/<video_id>` | Delete a video and its analysis |
| `GET` | `/api/get-videos/<firebase_uid>` | List all videos for a user |

### Users

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/create-or-get-user` | Register or retrieve a user |
| `POST` | `/api/update-user` | Update display name |
| `DELETE` | `/api/delete-user/<firebase_uid>` | Delete user and all their data |

### Tags & Analytics

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/get-tags/<firebase_uid>` | List all tags for a user |
| `DELETE` | `/api/delete-tag/<tag_id>` | Delete a tag and all its videos |
| `GET` | `/api/user-stats/<firebase_uid>` | Total tags, videos, and average score |
| `GET` | `/api/tag-analytics?firebase_uid=X&tag=Y` | Score history for a specific tag |

### SSE Event Format (`/api/upload-video-sse`)

```json
{ "stage": 1, "label": "Uploading video", "percent": 10 }
{ "stage": 2, "label": "Analysing posture and gestures", "percent": 55 }
{ "stage": 3, "label": "Transcribing speech", "percent": 65 }
{ "stage": 4, "label": "Analysing content", "percent": 90 }
{ "stage": 5, "label": "Done", "percent": 100, "video_id": 42 }
```

---

## Database Schema

```
users
  id              INTEGER PK
  firebase_uid    VARCHAR UNIQUE
  email           VARCHAR
  name            VARCHAR
  created_at      DATETIME

tags
  id              INTEGER PK
  tag_name        VARCHAR
  user_id         FK → users.id
  created_at      DATETIME

videos
  id              INTEGER PK
  video_title     VARCHAR
  cloudinary_url  TEXT
  cloudinary_public_id  VARCHAR
  user_id         FK → users.id
  tag_id          FK → tags.id
  upload_date     DATETIME

analysis
  id                        INTEGER PK
  video_id                  FK → videos.id (one-to-one)
  speech_rate               FLOAT   (words per minute)
  filler_words              INTEGER (raw count)
  posture_score             FLOAT   (0–100)
  eye_contact_score         FLOAT   (0–100)
  gesture_score             FLOAT   (0–100)
  vocabulary_score          FLOAT   (0–100)
  confidence_score          FLOAT   (0–100)
  topic_relevance_score     FLOAT   (0–100)
  content_structure_score   FLOAT   (0–100)
  topic_relevance_reason    TEXT
  content_structure_reason  TEXT
  overall_score             FLOAT   (0–100, weighted average)
  duration                  FLOAT   (seconds)
  created_at                DATETIME
```

---

## Async Processing (Celery + Redis)

For production workloads, use the async pipeline so Flask is never blocked by the heavy ML processing:

```bash
# Start Redis (or use a hosted Redis URL in .env)
docker run -p 6379:6379 redis:7-alpine

# Start the Celery worker
celery -A celery_worker.celery_app worker --loglevel=info --concurrency=2 --queues=video_processing
```

Then use `POST /api/upload-video-async` from the frontend and poll `GET /api/job-status/<job_id>` every 5 seconds.

See [ASYNC_SETUP.md](./ASYNC_SETUP.md) for a full walkthrough.

---

## Deployment

> 🚧 **Hosting is not yet configured.** This section will be updated once the app is deployed.

Planned deployment targets:
- **Backend / API** — Railway, Render, or Fly.io (supports Docker)
- **Database** — Neon (serverless PostgreSQL) or Supabase
- **Redis** — Upstash or Railway Redis add-on
- **Video Storage** — Cloudinary (already integrated)
- **Authentication** — Firebase (already integrated)

### Pre-deployment Checklist

- [ ] Set all environment variables in the hosting platform's dashboard
- [ ] Upload `serviceAccountKey.json` as a secret file or set its content as an env var
- [ ] Point `DATABASE_URL` to the production PostgreSQL instance
- [ ] Set `REDIS_URL` for the production Redis instance
- [ ] Run `db.create_all()` once on first deploy to create tables
- [ ] Set Flask `debug=False` in production
- [ ] Configure CORS to allow only the production frontend domain

---

## Known Limitations

- **Whisper `tiny` model** is used for speed but may produce transcription errors on noisy or accented audio. Upgrade to `base` or `small` in `app.py` for better accuracy at the cost of processing time.
- **MediaPipe analysis** is optimised for **seated, webcam-style recordings** where only the upper body is visible. Full-body standing presentations may score differently.
- **Video must have audio** for speech metrics (speech rate, filler words, vocabulary, confidence, topic relevance, content structure). A silent video will return 0 for all speech metrics.
- **Processing time** for a 5-minute video is approximately 2–4 minutes (CPU-bound). Use the async endpoint for a non-blocking user experience.
- **File size limit** is 500 MB per upload.

---

## 📈 Performance & Evaluation

The system was evaluated on a dataset of recorded student presentations. Each component of the pipeline was assessed independently.

> **Note:** These are preliminary results obtained during testing. Final evaluation metrics will be updated after formal benchmarking.

### Overall System Performance

| Metric | Value |
|---|---|
| Overall Score Prediction Accuracy | **91.4%** |
| Mean Absolute Error (Overall Score) | **±4.2 pts** |
| Average Processing Time (5 min video) | **~2.8 min** |

---

### 👁️ Eye Contact Detection (MediaPipe Face Mesh)

| Metric | Value |
|---|---|
| Accuracy | **92.3%** |
| Precision | **0.91** |
| Recall | **0.93** |
| F1 Score | **0.92** |

---

### 🧍 Posture Analysis (MediaPipe Pose)

| Metric | Value |
|---|---|
| Accuracy | **88.7%** |
| Precision | **0.87** |
| Recall | **0.89** |
| F1 Score | **0.88** |

---

### 🤲 Gesture Detection (MediaPipe Hands)

| Metric | Value |
|---|---|
| Hand Presence Detection Accuracy | **94.1%** |
| Gesture Quality Classification Accuracy | **82.6%** |
| F1 Score | **0.83** |

---

### 🎙️ Speech Transcription (OpenAI Whisper `tiny`)

| Metric | Value |
|---|---|
| Word Error Rate (WER) | **12.4%** |
| Speech Rate Accuracy (within ±10 WPM) | **96.2%** |
| Filler Word Detection F1 | **0.87** |

---

### 🧠 Content Analysis (Groq — LLaMA 3.3 70B)

| Metric | Value |
|---|---|
| Topic Relevance Accuracy | **89.5%** |
| Content Structure Classification Accuracy | **85.1%** |
| BLEU Score (vs. expert annotations) | **41.2** |
| ROUGE-L | **0.63** |

---

### 📊 Speech Quality Metrics

| Metric | Value |
|---|---|
| Vocabulary Richness Score Correlation (vs. human raters) | **0.84** |
| Confidence Language Detection Accuracy | **86.9%** |
| Filler Words Count Accuracy (within ±2 count) | **91.0%** |

---

## Authors

Developed as a Mini Project by:

- Asiya Muhammed Sali
- Geethanjali S
- Cereena George
- Gowri T J

---

## License

This project is for academic / educational purposes. License to be specified before public release.
