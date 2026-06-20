# Project Management Portal

A simple web application where users can manage project tasks with a modern, responsive interface.

## Features

- 📋 View all tasks with filter by status
- ➕ Create new tasks with validation
- ✅ Mark tasks as completed
- 🗑️ Delete tasks
- 🔄 Real-time task updates
- ⚠️ Error handling and loading states
- 📱 Mobile-responsive design
- 🎨 Bootstrap UI styling

## Tech Stack

**Frontend:**
- React.js 18
- React Router v6
- Axios for API calls
- Bootstrap 5 CSS

**Backend:**
- Node.js + Express
- MongoDB
- Mongoose ODM

## Project Structure

```
project-root/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   └── AddTask.jsx
│   │   ├── services/
│   │   │   └── taskService.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── README.md
│
└── backend/
    ├── controllers/
    │   └── taskController.js
    ├── models/
    │   └── Task.js
    ├── routes/
    │   └── taskRoutes.js
    ├── config/
    │   └── db.js
    ├── server.js
    ├── package.json
    └── .env
```

## Setup Steps

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd ProjectManagementPortal

# Backend setup
cd backend
npm install

# Frontend setup
cd ../frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/projectdb
NODE_ENV=development
```

### 3. Start MongoDB

Ensure MongoDB is running on your system:

```bash
# Windows
mongod

# macOS/Linux
brew services start mongodb-community
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# or
node server.js
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at: `http://localhost:5173`

## API Endpoints

### GET /api/tasks
Fetch all tasks

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Build Login Page",
    "description": "Create a responsive login page with validation",
    "status": "Pending",
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

### POST /api/tasks
Create a new task

**Request Body:**
```json
{
  "title": "Build Login Page",
  "description": "Create a responsive login page with validation",
  "status": "Pending"
}
```

**Response:** Created task object with `_id`

### PUT /api/tasks/:id
Update task status

**Request Body:**
```json
{
  "status": "Completed"
}
```

**Response:** Updated task object

### DELETE /api/tasks/:id
Delete a task

**Response:**
```json
{
  "message": "Task deleted successfully"
}
```

## Database Design

### Task Collection

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | MongoDB unique identifier |
| `title` | String | Task title (required) |
| `description` | Text | Task description |
| `status` | String | Pending / In Progress / Completed |
| `created_at` | Timestamp | Creation timestamp (auto) |

## Validation Rules

**Frontend Validation:**
- Title: Required
- Description: Minimum 20 characters
- Status: Pending / In Progress

**Backend Validation:**
- Title: Required
- All fields validated before saving to database

## Error Handling

The application includes comprehensive error handling:

- ✅ API request failures with user-friendly messages
- ✅ Network error handling
- ✅ Form validation with error display
- ✅ Loading states for all async operations
- ✅ Console error logging for debugging

## Usage Guide

### Create a Task
1. Click the blue "+ Add Task" button
2. Enter task title and description (min 20 chars)
3. Select status (Pending / In Progress)
4. Click "Add Task"
5. You'll be redirected to dashboard

### Complete a Task
1. Click the green "Complete" button on any task
2. Task status will update to "Completed"

### Delete a Task
1. Click the red "Delete" button on any task
2. Task will be removed immediately

### Filter Tasks
1. Use the dropdown on the dashboard
2. Select: All / Pending / In Progress / Completed

## Assumptions

1. MongoDB is running locally on `127.0.0.1:27017`
2. Backend runs on port `5000`
3. Frontend runs on port `5173` (Vite default)
4. No user authentication required for this version
5. Single user (shared task list)
6. Tasks are not deleted permanently (soft delete can be added)
7. Description field supports plain text only

## Git Workflow

```bash
# Initial setup
git add .
git commit -m "Initial project setup"

# Feature implementation
git commit -m "Implemented task APIs"
git commit -m "Added React Dashboard"
git commit -m "Integrated frontend with backend"

# Final
git commit -m "Updated README documentation"
git push origin main
```

## Testing the APIs

### Using cURL

```bash
# Get all tasks
curl http://localhost:5000/api/tasks

# Create task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task","description":"This is a test task description","status":"Pending"}'

# Update task
curl -X PUT http://localhost:5000/api/tasks/<TASK_ID> \
  -H "Content-Type: application/json" \
  -d '{"status":"Completed"}'

# Delete task
curl -X DELETE http://localhost:5000/api/tasks/<TASK_ID>
```

### Using Postman

1. Open Postman
2. Import requests from the API documentation
3. Test each endpoint with sample data

## Future Enhancements

- [ ] User authentication (JWT)
- [ ] Task search and advanced filtering
- [ ] Pagination (10 tasks per page)
- [ ] Sort by creation date / status
- [ ] Dashboard statistics (total, pending, completed)
- [ ] Dark mode toggle
- [ ] Task categories/tags
- [ ] Task priority levels
- [ ] Due dates
- [ ] Unit tests with Jest

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify PORT 5000 is not in use
- Check `.env` file configuration

### Frontend can't connect to API
- Ensure backend is running on port 5000
- Check network tab in browser dev tools
- Verify API base URL in `taskService.js`

### Tasks not loading
- Check browser console for errors
- Verify MongoDB connection in backend logs
- Check network requests in browser dev tools

## License

MIT License - Feel free to use for educational purposes.

## Author

Created as part of a hiring assessment for Full Stack Development.
