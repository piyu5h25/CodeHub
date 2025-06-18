# 🧠 Online Judge System – High Level Design

## 📌 System Overview

A scalable **Online Judge System** for code submission and evaluation, featuring:

- User registration & authentication  
- Code execution & verdict handling  
- Problem management (CRUD)  
- Optional live contests & leaderboard ranking  

---

## ✨ Features

### 👤 User Registration & Authentication

- Signup with: `name`, `email`, `password`  
- **JWT-based authentication**  
- Passwords encrypted using **bcrypt**  

### 🧾 Profile Management

- View user profile:
  - Solved problems  
  - Total submissions  
  - Contests participated  

### 💻 Code Submission & Evaluation

- Submit solution via inbuilt editor/compiler  
- Matches solution with test case outputs  
- Verdict: **Accepted** / **Rejected**  

---

## 📚 Problem Management

- **Problem Storage**: Problem statements & test cases  
- **Difficulty Levels**:
  - Beginner (5 pts)  
  - Easy (10 pts)  
  - Medium (15 pts)  
  - Hard (20 pts)  
- **Topic-wise Categories**  

---

## 🏆 Contest Mode (Optional)

- Live contest participation  
- Compete with other users in real-time  

---

## 📊 Ranking System

- Points scored from accepted submissions  
- Tie-breaker: Earlier submission time gets better rank  

---

## ⚠️ Challenges & Mitigations

| Challenge                            | Solution                                                     |
|-------------------------------------|--------------------------------------------------------------|
| Malicious Code Execution            | Use **Docker** sandboxing                                    |
| Concurrent Submissions              | Implement **rate-limiting** and **message queue**            |
| Verdict Fluctuation (post-malicious code) | Queue-based controlled execution                            |

---

## 🖼️ System Screens (Frontend)

### 1. Login / Signup Screen

- View-only access to problems without login  
- Authenticated via JWT  

### 2. Problem List

- Filter by tags (Beginner, Easy, Medium, Hard) and topic  
- Select preferred language for code submission  
- View submission logs (Accepted / Rejected)  

### 3. Individual Problem Page

- View problem details and test cases  
- Submit solution from this screen  
- Show result in a table (Accepted / Error)  

### 4. Leaderboard (Optional)

- Top problem solvers based on:
  - Total points  
  - Submission time (tie-breaker)  

---

## 🔁 Code Submission Workflow

1. Frontend submits code via UI  
2. Backend flow:
   - Fetch problem & test cases  
   - Run submitted code in Docker container  
   - Match output with expected results  
   - Return verdict (Accepted / Rejected)  
   - Save submission data to DB  

---

## 🛠️ Technical Stack

### 🔙 Backend

- **Node.js / Express.js**  
- **MongoDB**: For storing users, problems, submissions  
- **Docker**: Containerized code execution  
- **Message Queue**: Handles submission execution queue  

---

## 🗃️ Database Design

### 🧩 Problem

```json
{
  "_id": "string",
  "name": "string",
  "topic": ["array", "of", "tags"],
  "difficulty": "beginner | easy | medium | hard"
}
