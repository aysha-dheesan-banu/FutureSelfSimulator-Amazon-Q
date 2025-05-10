# FutureStimulus

<div align="center">
  <img src="public/images/logo.svg" alt="FutureStimulus Logo" width="120">
  <br><br>
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version 1.0.0">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License MIT">
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB" alt="React">
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=flat&logo=tailwind-css&logoColor=white" alt="TailwindCSS">
</div>

<p align="center">A personal growth and development application with AI-powered future prediction.</p>

<div align="center">
  <img src="public/images/dashboard.svg" alt="FutureStimulus Dashboard" width="800">
</div>

## ✨ Features

### 🔮 FuturePredict
Our innovative AI-powered feature analyzes your goals, habits, and journal entries to predict your future trajectory across multiple life dimensions:

<div align="center">
  <img src="public/images/future-predict.svg" alt="FuturePredict Feature" width="600">
</div>

- **Career progression** - Track your professional growth and advancement
- **Health outcomes** - Monitor your physical and mental wellbeing trends
- **Relationship development** - Analyze your social connections and personal relationships
- **Financial growth** - Visualize your financial trajectory and opportunities
- **Personal development** - See your growth in skills, knowledge, and self-awareness

FuturePredict provides personalized insights and recommendations based on your data patterns, helping you make informed decisions to shape your ideal future.

### 🎯 Goal Tracking

<div align="center">
  <img src="public/images/goals.svg" alt="Goal Tracking" width="600">
</div>

Set, track, and achieve your personal and professional goals with our structured goal management system:

- Create specific, measurable goals with deadlines
- Track progress with visual indicators
- Categorize goals by life area
- Receive AI-powered suggestions for goal achievement

### 🔄 Habit Formation

<div align="center">
  <img src="public/images/habits.svg" alt="Habit Formation" width="600">
</div>

Build positive habits with our science-based habit tracking and reinforcement system:

- Track daily habit completion
- Build streaks for motivation
- Visualize consistency over time
- Get personalized habit recommendations

### 📝 Journal Entries

<div align="center">
  <img src="public/images/journal.svg" alt="Journal Entries" width="600">
</div>

Record your thoughts, experiences, and progress with sentiment analysis to track emotional patterns:

- Write daily journal entries
- Receive AI-powered sentiment analysis
- Track mood patterns over time
- Identify emotional trends and insights

### 🤖 AI Coaching

Receive personalized guidance and feedback from our AI coach to accelerate your growth:

- Get personalized advice based on your data
- Receive tailored recommendations for improvement
- Ask questions and get intelligent responses
- Benefit from data-driven insights

## 🚀 Quick Start

To run the application with mock data (no database required):

```bash
.\run-app.bat
```

Then open your browser to http://localhost:4000

### Default Login

- Username: `demo`
- Password: `password123`

## 🛠️ Development Setup

### Prerequisites

- Node.js (v16+)
- Docker (optional, for local DynamoDB)

### Environment Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following content:
   ```
   # Server configuration
   PORT=4000

   # Database configuration
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/futurestimulus

   # AWS DynamoDB configuration
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=fakeMyKeyId
   AWS_SECRET_ACCESS_KEY=fakeSecretAccessKey
   DYNAMODB_ENDPOINT=http://localhost:8000

   # Session configuration
   SESSION_SECRET=your_session_secret

   # OpenAI configuration
   OPENAI_API_KEY=your_openai_api_key

   # Environment
   NODE_ENV=development
   ```

### Starting the Development Environment

#### Option 1: Using the batch file (Windows)

Simply run:
```
.\run-app.bat
```

This will:
1. Set environment variables for mock data
2. Kill any processes using port 4000
3. Start the development server

#### Option 2: Using npm Scripts

1. Open Command Prompt, PowerShell, or VS Code terminal in your project directory
2. Run:
   ```
   set SKIP_DYNAMODB=true
   set PORT=4000
   npm run dev
   ```

#### Option 3: Using Real Data

To run with real data instead of mock data:

```
npm run dev
```

This uses the configuration from your .env file to connect to real databases.

## 📁 Project Structure

```
FutureStimulus/
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions
│   │   ├── pages/        # Page components
│   │   └── App.tsx       # Main application component
├── server/               # Backend Express server
│   ├── controllers/      # Request handlers
│   ├── db/               # Database operations
│   ├── middleware/       # Express middleware
│   ├── routes/           # API routes
│   └── services/         # Business logic
├── shared/               # Shared types and utilities
├── public/               # Static assets
└── .env                  # Environment variables
```

## 📜 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run dev:mock` - Start with mock data

## 🧰 Technology Stack

<div align="center">
  <table>
    <tr>
      <td align="center"><img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React"><br>React</td>
      <td align="center"><img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"><br>TypeScript</td>
      <td align="center"><img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS"><br>TailwindCSS</td>
    </tr>
    <tr>
      <td align="center"><img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"><br>Node.js</td>
      <td align="center"><img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" alt="Express.js"><br>Express</td>
      <td align="center"><img src="https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="AWS"><br>DynamoDB</td>
    </tr>
  </table>
</div>

## 🔧 Troubleshooting

### Port Already in Use

If you encounter a "port already in use" error:

1. Check which process is using the port:
   ```
   netstat -ano | findstr :4000
   ```

2. Kill the process:
   ```
   taskkill /F /PID <PID>
   ```

### Server Fails to Start

If the server fails to start:

1. Make sure all dependencies are installed:
   ```
   npm install
   ```

2. Check for TypeScript errors:
   ```
   npm run check
   ```

3. Try running with mock data:
   ```
   set SKIP_DYNAMODB=true
   npm run dev
   ```

## 🔮 Future Development

We're constantly improving FutureStimulus with new features:

- Enhanced prediction algorithms
- Integration with wearable devices
- Community features for accountability
- Expanded AI coaching capabilities
- Mobile application

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Express](https://expressjs.com/)
- [AWS DynamoDB](https://aws.amazon.com/dynamodb/)
- [OpenAI](https://openai.com/)