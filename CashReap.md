# CashReap - Credit Card Rewards Recommendation App

## Overview
CashReap is a full-stack web application designed to help users identify the most beneficial credit cards for their purchases at specific stores and merchants. It offers personalized credit card recommendations based on store categories, reward rates, and user preferences. The application features a mobile-first design, location-based store search, card filtering capabilities, and secure authentication system. The project's vision is to empower users to "Harvest Your Rewards" by leveraging a robust database of credit cards and businesses.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **State Management**: TanStack Query (React Query) for server state
- **Styling**: Tailwind CSS with shadcn/ui components
- **Build Tool**: Vite
- **Design Principle**: Mobile-First, responsive layout

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Session-based tracking using localStorage (extensible for future Redis integration)
- **API Design**: RESTful API

### Database Schema
Core entities include:
- **Credit Cards**: Issuer, annual fees, base rewards.
- **Merchant Categories**: Business categories (e.g., grocery, gas, dining).
- **Card Category Rewards**: Links cards to categories with specific reward rates.
- **Stores**: Physical/online locations with geographical data.
- **User Data**: Search history and saved cards (session-based).

### Core Features
- **Store Search & Selection**: Search by name or find nearby stores using geolocation.
- **Card Recommendations**: Algorithm matches stores to optimal credit cards based on category rewards.
- **Filtering System**: Filter recommendations by annual fee and credit score requirements.
- **Personal Card Management**: Save and manage preferred credit cards.
- **Search History**: Track previously searched stores.
- **Authentication**: Comprehensive user authentication using Passport.js with email/password login and PostgreSQL for user and session management.
- **Card Browsing**: Comprehensive page with search and filtering for credit cards.
- **National Business Database**: Extensive database of 220+ major US businesses across 20 categories, including streaming services, entertainment, and retail.
- **Advanced Category Fallback System**: Users can select business categories for recommendations if a specific business is not found.
- **Professional Pages**: Includes About Us, Contact Us, Privacy Policy, Terms of Service, and FAQ for enhanced credibility.

### UI/UX Decisions
- **Brand Identity**: Custom SVG logo with wheat stalks and a dollar sign; slogan "Harvest Your Rewards."
- **Color Scheme**: Amber/gold (wheat), green (dollar sign).
- **Components**: Bottom navigation (Home, My Cards, History, Settings), Location Detector, Card Recommendation Cards, Filter Panel.
- **Design**: Clean, mobile-first design focused on core value proposition.

## External Dependencies

### Frontend Dependencies
- **UI Components**: Radix UI primitives with shadcn/ui.
- **Icons**: Lucide React.
- **Validation**: Zod.
- **Date Handling**: date-fns.
- **Geolocation**: Browser native Geolocation API.

### Backend Dependencies
- **Database**: Neon Database (PostgreSQL-compatible).
- **ORM**: Drizzle ORM.
- **Authentication**: Passport.js with local email/password strategy.

### Development Tools
- **Bundling**: Vite.
- **TypeScript**: Strict type checking.
- **CSS Processing**: PostCSS with Tailwind and Autoprefixer.
- **Backend Development**: `tsx` for TypeScript execution.
- **Database Migrations**: Drizzle Kit.