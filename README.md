# Rails Chat Frontend

This repository contains the frontend for the Rails Chat application. The frontend is built using modern web development technologies and integrates with a Rails backend to create a real-time chat experience.

## Features

- **Real-time messaging** using WebSockets (ActionCable in Rails backend)
- **Responsive design** for desktop and mobile users
- **User-friendly UI** with support for chatrooms and direct messages

## Technologies Used

- **Frontend**: 
  - React with Vite
  - **Tailwind CSS** for styling
  - **shadcn** component library
  
- **Backend**: 
  - Rails API
  - ActionCable for WebSockets

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (>= 14.x)
- Yarn or npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/IryIndriyanto/rails-chat-fe.git
   cd rails-chat-fe
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

   or if using npm:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   yarn dev
   ```

   or:

   ```bash
   npm run dev
   ```

The application should now be running at `http://localhost:5173`.

## Usage

1. Ensure the [Rails backend](https://github.com/IryIndriyanto/rails-chat-api) is running.
2. Open the frontend in your browser and select user or create new user.
3. Create or join a chatroom and start chatting in real time.

## Project Structure

```
src/
│
├── assets/           # Public assets
├── components/       # Reusable components
├── hooks/            # Custom hooks
└── lib/              # Utility function
```