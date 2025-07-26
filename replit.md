# CashReap - Credit Card Rewards Recommendation App

## Overview

CashReap is a full-stack web application that helps users find the best credit cards for specific stores and merchants. The app provides personalized credit card recommendations based on store categories, reward rates, and user preferences. It features a mobile-first design with location-based store search, card filtering, and user session management.

**Brand Identity:**
- **Logo**: Custom SVG featuring wheat stalks (representing "reaping") with an integrated dollar sign
- **Slogan**: "Harvest Your Rewards" - emphasizing the agricultural metaphor of reaping/harvesting cash back rewards
- **Color Scheme**: Amber/gold for the wheat stalks, green for the dollar sign, representing growth and money

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite for development and bundling
- **Mobile-First Design**: Responsive layout optimized for mobile devices

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Simple session-based tracking using localStorage
- **API Design**: RESTful API endpoints

### Database Schema
The application uses a relational database with the following core entities:
- **Credit Cards**: Store card information including issuer, annual fees, and base rewards
- **Merchant Categories**: Define business categories (grocery, gas, dining, etc.)
- **Card Category Rewards**: Link cards to categories with specific reward rates
- **Stores**: Physical/online store locations with geographical data
- **User Data**: Search history and saved cards (session-based)

## Key Components

### Core Features
1. **Store Search & Selection**: Users can search for stores by name or find nearby locations using geolocation
2. **Card Recommendations**: Algorithm matches stores to optimal credit cards based on category rewards
3. **Filtering System**: Users can filter recommendations by annual fee and credit score requirements
4. **Personal Card Management**: Save and manage preferred credit cards
5. **Search History**: Track previously searched stores for quick access

### UI Components
- **Bottom Navigation**: Mobile-optimized navigation with Home, My Cards, History, and Settings
- **Location Detector**: Geolocation integration for finding nearby stores
- **Card Recommendation Cards**: Display card details with reward rates and key features
- **Filter Panel**: Collapsible filtering options for card recommendations

### Data Management
- **Client-Side Caching**: TanStack Query handles API response caching and invalidation
- **Session Persistence**: User sessions stored in localStorage for cross-visit continuity
- **Optimistic Updates**: Immediate UI feedback for user actions like saving cards

## Data Flow

1. **Store Selection**: User searches or selects a store location
2. **Category Matching**: System identifies the store's merchant category
3. **Card Recommendation**: Algorithm queries cards with highest rewards for that category
4. **Filtering**: Applied user preferences filter the recommendation list
5. **Personalization**: User can save preferred cards and view search history
6. **Session Tracking**: All interactions logged for improved user experience

## External Dependencies

### Frontend Dependencies
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **Icons**: Lucide React icon library
- **Validation**: Zod for schema validation
- **Date Handling**: date-fns for date manipulation
- **Geolocation**: Browser native Geolocation API

### Backend Dependencies
- **Database**: Neon Database (PostgreSQL-compatible)
- **ORM**: Drizzle ORM for type-safe database operations
- **Session Storage**: In-memory session management (can be extended to Redis)
- **Development Tools**: tsx for TypeScript execution, esbuild for production builds

### Development Tools
- **Bundling**: Vite with React plugin
- **TypeScript**: Strict type checking across the stack
- **PostCSS**: CSS processing with Tailwind and Autoprefixer
- **Replit Integration**: Development environment optimizations for Replit

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite dev server with HMR for frontend
- **Backend Development**: tsx for running TypeScript server with auto-restart
- **Database Migrations**: Drizzle Kit for schema management and migrations

### Production Build
- **Frontend**: Vite builds static assets to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Database**: PostgreSQL connection via DATABASE_URL environment variable
- **Deployment**: Single Node.js process serving both API and static files

### Key Configuration
- **Environment Variables**: DATABASE_URL for database connection
- **Build Scripts**: Separate development and production build processes
- **Static Serving**: Express serves Vite-built frontend in production
- **API Routing**: RESTful endpoints under `/api` prefix

The application is designed to be deployed on platforms like Replit, Vercel, or traditional hosting providers with PostgreSQL database support.