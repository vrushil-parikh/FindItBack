# FindItBack

A lost and found management system that helps people report and find lost items within their community.

## Problem Statement

People frequently lose personal belongings like electronics, documents, keys, and other valuables. Currently, there's no centralized platform where individuals can easily report lost items or help others by posting found items. This leads to permanent loss of valuable items and missed opportunities for reuniting people with their belongings.

## Scope

FindItBack serves as a digital platform where users can:
- Report lost items with detailed descriptions and images
- Post found items to help others recover their belongings
- Search through reported items using various criteria
- Manage their posts and track item recovery status

## Main Functionalities

### Core Features
- **User Management**: Registration, authentication, and profile management.
- **Post Management**: Create, read, update, and delete posts for lost/found items
- **Item Categorization**: Organize items by categories (electronics, clothing, accessories, documents, keys, bags, books, pets, other)
- **Image Upload**: Support for multiple images per post.
- **Search & Filter**: Advanced search functionality to find specific items
- **Status Tracking**: Track post status (open, closed, resolved)

### User Capabilities
- Report lost items with descriptions and photos
- Post found items to help others
- Browse and search through existing posts
- Update post status when items are recovered
- Manage personal posts and claims

## Tech Stack

### Frontend
- **React.js** - User interface framework
- **Vite** - Build tool and development server
- **Tailwind CSS** - Styling framework
- **React Router** - Client-side routing

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - Database for storing posts and user data
- **Mongoose** - MongoDB object modeling
- **Cloudinary** - Image storage and management

### Deployment & Tools
- **dotenv** - Environment variable management

## Project Structure

```
FindItBack/
├── client/          # React frontend application
├── server/          # Express.js backend API
└── docs/           # Project documentation and diagrams
```

The system follows a modern full-stack architecture with a clear separation between frontend and backend components, ensuring scalability and maintainability.