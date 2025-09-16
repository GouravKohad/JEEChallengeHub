# JEE Challenge App

## Overview

The JEE Challenge App is a comprehensive study management platform designed specifically for JEE (Joint Entrance Examination) aspirants. The application enables students to create personalized study challenges across Physics, Chemistry, and Mathematics with structured daily task tracking, progress analytics, and gamified streak counters. The platform combines the functionality of educational management systems with productivity features to help students maintain consistent study habits and track their preparation progress.

The application follows a client-server architecture with a React-based frontend and Express.js backend, utilizing local storage for data persistence and featuring a modern, responsive design system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design system
- **State Management**: Context API with useReducer for challenge and task state management, React Query for server state caching
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Comprehensive component library based on Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **API Design**: RESTful API structure with /api prefix for all endpoints
- **Data Layer**: Modular storage interface supporting both in-memory and database implementations
- **Development Tools**: Vite for hot module replacement and development server
- **Type System**: Shared TypeScript schemas between client and server

### Data Storage Solutions
- **Primary Storage**: Drizzle ORM configured for PostgreSQL with migration support
- **Local Storage**: Browser localStorage for client-side data persistence and offline functionality
- **Schema Design**: Comprehensive data models for challenges, daily tasks, topics, and progress tracking
- **Data Structure**: Organized around challenge-based study plans with hierarchical topic organization

### Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **User Context**: Challenge-based user identification system
- **Security**: Basic session-based authentication prepared for future enhancement

### Design System
- **Theme Support**: Light/dark mode toggle with CSS custom properties
- **Color System**: Educational-focused palette with subject-specific color coding (Physics: Blue, Chemistry: Green, Mathematics: Orange)
- **Typography**: Inter font family optimized for academic content readability
- **Responsive Design**: Mobile-first approach with adaptive layouts

## External Dependencies

### Database and ORM
- **Neon Database**: Serverless PostgreSQL database for production data storage
- **Drizzle ORM**: Type-safe database operations with schema validation
- **Drizzle Kit**: Database migration and schema management tools

### UI and Styling
- **Shadcn/UI**: Pre-built component library with Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Radix UI**: Accessible component primitives for complex UI interactions
- **Lucide React**: Icon library for consistent iconography

### State Management and Data Fetching
- **TanStack React Query**: Server state management with caching and synchronization
- **React Hook Form**: Form state management with validation
- **Hookform Resolvers**: Schema validation integration

### Development and Build Tools
- **Vite**: Fast development server and build tool with HMR
- **TSX**: TypeScript execution for development server
- **ESBuild**: Fast JavaScript bundler for production builds

### Utilities and Helpers
- **Date-fns**: Date manipulation and formatting utilities
- **Class Variance Authority**: Type-safe CSS class composition
- **Zod**: Runtime type validation and schema parsing
- **Clsx/Tailwind Merge**: Conditional CSS class management

### Animation and Interaction
- **Framer Motion**: Animation library for streak counters and interactive elements
- **Embla Carousel**: Carousel component for data visualization
- **Recharts**: Chart library for progress visualization and analytics

### Specialized JEE Features
- **Topic Management**: Hierarchical organization of JEE syllabus topics by subject and chapter
- **Challenge Templates**: Pre-configured study patterns (revision, DPP, intensive practice)
- **Progress Tracking**: Comprehensive analytics for study patterns and performance metrics
- **Streak Gamification**: Motivation system with study streaks and achievements