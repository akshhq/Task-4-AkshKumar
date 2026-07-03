# 🎓 Student Dashboard Full Stack Integration

## DecodeLabs Full Stack Development Internship – Project 4

A complete Full Stack Application built by integrating:

- Frontend (HTML, CSS, JavaScript)
- Backend API (Node.js + Express.js)
- Database (MongoDB Atlas)

This project extends Project 1, Project 2, and Project 3 by connecting all layers into a single working application.

---

# 📖 Project Overview

Project 4 focuses on Full Stack Integration.

Previous projects were developed independently:

### Project 1

Frontend Dashboard

```text
HTML
CSS
JavaScript
```

### Project 2

REST API

```text
Node.js
Express.js
```

### Project 3

Database Layer

```text
MongoDB Atlas
Mongoose
```

### Project 4

Connect Everything

```text
Frontend
   ↓
Fetch API
   ↓
Express Backend
   ↓
MongoDB Atlas
```

The frontend now communicates directly with the backend API, which retrieves and stores data in MongoDB.

---

# 🎯 Learning Objectives

By completing this project, you will learn:

- Full Stack Architecture
- API Integration
- Fetch API
- Async/Await
- Dynamic DOM Manipulation
- Error Handling
- CORS
- CRUD Operations
- Frontend ↔ Backend Communication

---

# 🛠️ Tech Stack

| Technology | Purpose |
|------------|----------|
| HTML5 | Structure |
| CSS3 | Styling |
| JavaScript | Frontend Logic |
| Node.js | Backend Runtime |
| Express.js | API Development |
| MongoDB Atlas | Database |
| Mongoose | ODM |
| Fetch API | API Communication |
| CORS | Cross-Origin Requests |

---

# 📂 Project Structure

```text
student-dashboard/

│
├── frontend/
│
│   ├── index.html
│   ├── students.html
│   ├── assignments.html
│   ├── notices.html
│
│   ├── css/
│   │   └── style.css
│
│   └── js/
│       ├── dashboard.js
│       ├── students.js
│       ├── assignments.js
│       └── notices.js
│
│
├── backend/
│
│   ├── server.js
│
│   ├── package.json
│
│   ├── config/
│   │   └── db.js
│
│   ├── models/
│   │   ├── Student.js
│   │   ├── Assignment.js
│   │   └── Notice.js
│
│   ├── routes/
│   │   ├── students.js
│   │   ├── assignments.js
│   │   └── notices.js
│
│   └── .env
```

---

# 📦 Installation

## Backend

Install packages

```bash
npm install express mongoose dotenv cors
```

---

# 🔓 Enable CORS

## server.js

```js
const cors = require("cors");

app.use(cors());
```

Without CORS, the browser blocks frontend requests.

---

# 🚀 Start Backend

```bash
node server.js
```

Output

```bash
MongoDB Connected
Server running at http://localhost:3000
```

---

# 🌐 Fetch API Basics

## GET Request

```js
const response = await fetch(
  "http://localhost:3000/students"
);

const data = await response.json();
```

---

## POST Request

```js
const response = await fetch(
  "http://localhost:3000/students",
  {
    method: "POST",
    headers: {
      "Content-Type":
        "application/json"
    },
    body: JSON.stringify({
      name: "Aksh Kumar",
      rollNo: "23BCS001",
      semester: 3
    })
  }
);
```

---

## DELETE Request

```js
await fetch(
  `http://localhost:3000/students/${id}`,
  {
    method: "DELETE"
  }
);
```

---

## PUT Request

```js
await fetch(
  `http://localhost:3000/students/${id}`,
  {
    method: "PUT",

    headers: {
      "Content-Type":
        "application/json"
    },

    body: JSON.stringify({
      semester: 4
    })
  }
);
```

---

# 🏠 Dashboard Page

## Dashboard HTML

```html
<div class="stats">

  <div class="card">
    <h3>Total Students</h3>
    <p id="studentCount">0</p>
  </div>

  <div class="card">
    <h3>Assignments</h3>
    <p id="assignmentCount">0</p>
  </div>

  <div class="card">
    <h3>Latest Notice</h3>
    <p id="latestNotice">
      Loading...
    </p>
  </div>

</div>
```

---

## Dashboard JS

```js
async function loadDashboard() {

  try {

    const studentsRes =
      await fetch(
        "http://localhost:3000/students/count"
      );

    const assignmentsRes =
      await fetch(
        "http://localhost:3000/assignments"
      );

    const noticeRes =
      await fetch(
        "http://localhost:3000/notices/latest"
      );

    const students =
      await studentsRes.json();

    const assignments =
      await assignmentsRes.json();

    const notice =
      await noticeRes.json();

    document.getElementById(
      "studentCount"
    ).textContent =
      students.totalStudents;

    document.getElementById(
      "assignmentCount"
    ).textContent =
      assignments.length;

    document.getElementById(
      "latestNotice"
    ).textContent =
      notice.title;

  } catch (error) {

    console.error(error);

  }
}

loadDashboard();
```

---

# 👨‍🎓 Students Page

## HTML

```html
<h1>Students</h1>

<form id="studentForm">

  <input
    type="text"
    id="name"
    placeholder="Name"
    required
  >

  <input
    type="text"
    id="rollNo"
    placeholder="Roll Number"
    required
  >

  <input
    type="number"
    id="semester"
    placeholder="Semester"
    required
  >

  <button type="submit">
    Add Student
  </button>

</form>

<div id="students"></div>
```

---

## Load Students

```js
async function loadStudents() {

  const response =
    await fetch(
      "http://localhost:3000/students"
    );

  const students =
    await response.json();

  const container =
    document.getElementById(
      "students"
    );

  container.innerHTML = "";

  students.forEach((student) => {

    const card =
      document.createElement("div");

    card.classList.add("card");

    card.innerHTML = `
      <h3>${student.name}</h3>
      <p>${student.rollNo}</p>
      <p>Semester ${student.semester}</p>

      <button
        onclick="deleteStudent('${student._id}')"
      >
        Delete
      </button>
    `;

    container.appendChild(card);
  });
}

loadStudents();
```

---

## Add Student

```js
document
.getElementById("studentForm")
.addEventListener(
  "submit",
  async (e) => {

    e.preventDefault();

    const name =
      document.getElementById("name")
      .value;

    const rollNo =
      document.getElementById("rollNo")
      .value;

    const semester =
      document.getElementById("semester")
      .value;

    await fetch(
      "http://localhost:3000/students",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          name,
          rollNo,
          semester
        })
      }
    );

    loadStudents();
  }
);
```

---

## Delete Student

```js
async function deleteStudent(id)
{
  await fetch(
    `http://localhost:3000/students/${id}`,
    {
      method: "DELETE"
    }
  );

  loadStudents();
}
```

---

# 📝 Assignments Page

## Load Assignments

```js
async function loadAssignments()
{
  const response =
    await fetch(
      "http://localhost:3000/assignments"
    );

  const assignments =
    await response.json();

  console.log(assignments);
}
```

---

# 🔔 Notices Page

## Load Notices

```js
async function loadNotices()
{
  const response =
    await fetch(
      "http://localhost:3000/notices"
    );

  const notices =
    await response.json();

  console.log(notices);
}
```

---

# 🛡️ Error Handling

```js
async function getStudents()
{
  try
  {
    const response =
      await fetch(
        "http://localhost:3000/students"
      );

    if (!response.ok)
    {
      throw new Error(
        "Request Failed"
      );
    }

    const data =
      await response.json();

    console.log(data);
  }
  catch(error)
  {
    alert(error.message);
  }
}
```

---

# 🔄 Full Application Flow

```text
User Clicks Button
        ↓
Frontend JavaScript
        ↓
fetch()
        ↓
Express Route
        ↓
MongoDB Query
        ↓
Data Returned
        ↓
JSON Response
        ↓
DOM Updated
        ↓
User Sees Changes
```

---

# 📡 API Endpoints Used

## Students

```http
GET /students
GET /students/count
GET /students/:id

POST /students

PUT /students/:id

DELETE /students/:id
```

---

## Assignments

```http
GET /assignments
GET /assignments/upcoming

POST /assignments

PUT /assignments/:id

DELETE /assignments/:id
```

---

## Notices

```http
GET /notices
GET /notices/latest

POST /notices

PUT /notices/:id

DELETE /notices/:id
```

---

# 📋 Skills Learned

- HTML5
- CSS3
- JavaScript
- Fetch API
- Async/Await
- DOM Manipulation
- Express.js
- MongoDB Atlas
- Mongoose
- REST APIs
- CRUD Operations
- Full Stack Development
- Error Handling
- CORS

---

# 🔮 Future Improvements

- Authentication
- JWT
- Login System
- Registration System
- Protected Routes
- Role-Based Access
- Deployment
- React Frontend
- Admin Dashboard

---

# 👨‍💻 Author

Aksh Kumar

B.Sc. (Hons.) Computer Science  
University of Delhi

---

# 📜 Internship Information

DecodeLabs Full Stack Development Internship

Project 4 – Frontend & Backend Integration

Successfully integrated a frontend dashboard with a MongoDB-powered backend API using Fetch API, asynchronous JavaScript, CRUD operations, and dynamic DOM rendering.# Task-4-AkshKumar

# Task-4-AkshKumar

