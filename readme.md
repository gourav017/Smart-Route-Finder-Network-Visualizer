# Smart Route Finder & Network Visualizer

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for managing delivery hubs and finding optimal routes between them using Dijkstra's shortest path algorithm.

## Features

- **Hub Management**: Create, update, and delete delivery hubs
- **Connection Management**: Connect hubs bidirectionally
- **Pathfinding**: Find shortest paths between any two hubs
- **Network Visualization**: Visual representation of the entire network
- **Real-time Statistics**: Network analytics and connectivity status
- **Sample Data**: Pre-loaded example network for testing

## Tech Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **CORS** for cross-origin requests
- Custom Dijkstra's algorithm implementation

### Frontend  
- **React.js** with Hooks (useState, useEffect)
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API communication

## Project Structure

```
smart-route-finder/
├── backend/
│   ├── controllers/
│   │   ├── hubController.js
│   │   └── networkController.js
│   ├── models/
│   │   └── Hub.js
│   ├── routes/
│   │   ├── hubRoutes.js
│   │   └── networkRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── HubForm.jsx
│   │   │   ├── ConnectionForm.jsx
│   │   │   ├── Pathfinder.jsx
│   │   │   ├── NetworkVisualization.jsx
│   │   │   └── Notification.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Step 1: Clone the Repository
```bash
git clone <your-repo-url>
cd smart-route-finder
```

### Step 2: Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/smart-route-finder
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Start the backend server:
```bash
npm run dev
```
The backend will run on `http://localhost:5000`

### Step 3: Frontend Setup
```bash
cd ../frontend
npm install
```

Start the frontend development server:
```bash
npm start
```
The frontend will run on `http://localhost:3000`

### Step 4: Database Setup
Make sure MongoDB is running locally or update the `MONGODB_URI` in your `.env` file to point to your MongoDB Atlas cluster.

## API Endpoints

### Hub Management
- `GET /api/hubs` - Get all hubs
- `GET /api/hubs/:hubId` - Get hub by ID
- `POST /api/hubs` - Create new hub
- `PUT /api/hubs/:hubId` - Update hub
- `DELETE /api/hubs/:hubId` - Delete hub
- `POST /api/hubs/connect` - Connect two hubs
- `POST /api/hubs/disconnect` - Disconnect two hubs

### Network Analysis
- `GET /api/network/path/:sourceId/:destinationId` - Find shortest path
- `GET /api/network/paths/:sourceId/:destinationId` - Find all paths
- `GET /api/network/stats` - Get network statistics
- `GET /api/network/connectivity` - Check network connectivity

### Health Check
- `GET /api/health` - Server health status
# Smart-Route-Finder-Network-Visualizer
