# Overview

This is a Sarcastic AI Calculator - a full-stack web application that combines a functional calculator with an AI assistant that provides witty, sarcastic commentary on user calculations. The app features a React frontend with a calculator interface, character display, and AI comment system, backed by an Express.js server that integrates with Google's Gemini AI for generating personality-driven responses.

The application stores calculation history and AI responses in a database, allowing the AI to provide contextual commentary based on recent calculation patterns. The frontend includes visual elements like character animations, environment backgrounds, and speech bubbles to create an engaging user experience.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS styling
- **State Management**: React hooks for local state, TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with CSS variables for theming support

## Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **API Design**: RESTful endpoints with structured JSON responses
- **Error Handling**: Centralized error middleware with status code mapping
- **Request Logging**: Custom middleware for API request/response logging
- **Development Server**: Vite integration for hot module replacement in development

## Data Storage Solutions
- **ORM**: Drizzle ORM for type-safe database interactions
- **Database**: PostgreSQL with Neon serverless hosting
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Fallback Storage**: In-memory storage implementation for development/testing

## Database Schema
- **Users Table**: Basic user authentication with username/password
- **Calculations Table**: Stores math expressions, results, and timestamps
- **AI Responses Table**: Links to calculations with AI commentary, emotions, and timestamps

## Authentication and Authorization
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple
- **User Storage**: Encrypted password storage with username-based lookup
- **Development Mode**: Memory-based user storage for local development

## Component Architecture
- **Calculator Component**: Self-contained calculator logic with operation handling
- **AI Comment Box**: Displays conversation history with typing indicators
- **Character Display**: Shows AI character with mood-based animations and environments
- **Custom Hooks**: Reusable logic for calculator operations and mobile detection

# External Dependencies

## AI Integration
- **Google Gemini AI**: Primary AI service for generating sarcastic responses
- **API Configuration**: Supports both GEMINI_API_KEY and GOOGLE_AI_API_KEY environment variables
- **Response Structure**: JSON-formatted responses with emotion, mood, and activity fields
- **Context Awareness**: Sends recent calculation history for contextual commentary

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting via @neondatabase/serverless
- **Connection Management**: Environment-based DATABASE_URL configuration
- **Migration System**: Drizzle Kit for schema updates and version control

## Development Tools
- **Replit Integration**: Vite plugins for runtime error overlays and cartographer
- **TypeScript Configuration**: Strict type checking with path mapping for clean imports
- **Build Process**: ESBuild for server bundling, Vite for client bundling

## UI Dependencies
- **Radix UI**: Comprehensive primitive components for accessibility
- **Lucide Icons**: Icon library for consistent visual elements
- **Class Variance Authority**: Type-safe variant management for component styling
- **React Hook Form**: Form validation and management with Zod schemas

## Utility Libraries
- **Date-fns**: Date manipulation and formatting
- **Nanoid**: Unique ID generation for entities
- **Clsx & Tailwind Merge**: Conditional class name composition