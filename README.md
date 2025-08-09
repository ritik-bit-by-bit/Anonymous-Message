# Anonymous Message

An application that allows users to send and receive anonymous messages. It provides a simple yet effective way to send messages without revealing the sender's identity.

## Features

- **Anonymous Messaging**: Users can send messages anonymously without revealing their identity.
- **Message Storage**: Messages are stored in a database (e.g., MongoDB) for persistent access.
- **User Authentication**: Optional user authentication to track and manage messages.
- **Real-time Messaging**: Users can interact with the platform in real-time, receiving messages instantly.

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Prisma ORM)
- **Authentication**: JSON Web Token (JWT) or any other authentication mechanism
- **Real-time Communication**: Socket.IO or WebSockets for real-time messaging
- **State Management**: Zustand or Redux
- **Deployment**: Deployed on Vercel

## Installation

## 1. Clone the repository:

    git clone https://github.com/ritik-bit-by-bit/Anonymous-Message.git
   
## 2.Navigate to the project directory:

    cd Anonymous-Message
   
## 3.Install the dependencies:

    npm install

## 4.Set up environment variables:

    Create a .env file and configure the necessary environment variables (e.g., database URL, authentication secrets).

## 5.Start the development server:

    npm run dev

## 6.Visit http://localhost:3000 to access the app locally.

## Usage
 Send a Message: Navigate to the message input area and type your message. Once submitted, it will be sent anonymously.

 View Messages: View all received anonymous messages in your inbox or main dashboard.

The project is deployed on Vercel for easy access and scalability.

### Live Demo
    https://anonymous-message-m0e3.onrender.com/
