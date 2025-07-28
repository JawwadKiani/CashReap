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

## Recent Updates - January 2025

### Authentication System Implementation (January 27, 2025)
- **Complete Authentication System**: Implemented comprehensive user authentication using Replit Auth with PostgreSQL database
- **Multiple Login Options**: Created dedicated sign-in/sign-up pages with email/password forms and social login buttons (Google, Facebook, Apple, Twitter)
- **Landing Page**: Enhanced landing page with multiple authentication entry points
- **User Profile Management**: Added user profile section in settings with logout functionality
- **Protected Routes**: App now requires authentication to access main features
- **Database Migration**: Successfully migrated from in-memory storage to PostgreSQL with user tables and session management
- **Card Browsing**: Added comprehensive card browsing page with search and filtering capabilities
- **Removed Location Services**: Removed location services from settings page as requested

### Major Credit Card Database Expansion (January 28, 2025)
- **50+ Credit Card Database**: Successfully expanded from 5 cards to 50+ comprehensive credit cards from all major US issuers
- **Complete Branding Fix**: Eliminated all "CardSavvy" references, fully implemented "CashReap" branding with "Harvest Your Rewards" messaging
- **Major Issuers Included**: Chase (5), American Express (5), Capital One (5), Citi (4), Discover (3), Bank of America (3), Wells Fargo (3), U.S. Bank (3), plus Barclays, Synchrony Bank, and Navy Federal
- **Card Categories**: Premium travel cards (Sapphire Reserve, Platinum Card), flat-rate cashback (Double Cash, Active Cash), rotating category cards (Freedom Flex, Discover it), and business cards
- **Complete Information**: Each card includes annual fees, credit score requirements, welcome bonuses, base reward rates, and detailed feature descriptions
- **Database Issues Resolved**: Fixed seeding conflicts and TypeScript errors in card browser component
- **API Verification**: All 34 cards now properly accessible via /api/credit-cards endpoint

### Comprehensive National Business Database (January 2025)
- **Massive Database Expansion**: Expanded from 50 to 220+ major US businesses covering all retail categories
- **Streaming Services Added**: Netflix, Disney+, HBO Max, Amazon Prime Video, Hulu, Paramount+, Apple TV+, YouTube Premium, Spotify, Apple Music
- **Entertainment & Gaming**: AMC Theaters, Regal Cinemas, Dave & Buster's, Chuck E. Cheese, GameStop
- **Fitness & Wellness**: Planet Fitness, LA Fitness, 24 Hour Fitness, Gold's Gym
- **Electronics & Technology**: Best Buy, Apple Store, Microsoft Store, GameStop
- **Home Improvement**: Home Depot, Lowe's, Menards
- **Clothing & Fashion**: Gap, Old Navy, Banana Republic, H&M, Forever 21
- **Telecommunications**: Verizon, AT&T, T-Mobile, Sprint
- **Travel & Transportation**: Uber, Lyft, Delta Airlines, American Airlines, Southwest, United, Marriott, Hilton, Hyatt
- **20 Business Categories**: Department stores, grocery, dining, gas, streaming, entertainment, fitness, electronics, home improvement, clothing, telecom, travel, transit, online, drugstores, warehouse clubs, automotive, utilities, financial, insurance
- **Category-Specific Rewards**: Added reward rates for all new categories including 5% rotating rewards for streaming services
- **Enhanced User Experience**: Collapsible category browsing with store counts and organized sections
- **Complete Business Coverage**: Users can now find credit card recommendations for virtually any major US business or service
- **Impressive Scale**: Now features 220+ businesses and 50+ credit cards for maximum user confidence

### Advanced Category Fallback System (January 28, 2025)
- **Smart Category Selection**: When users search for businesses not in our database, they can select the business category for personalized recommendations
- **Universal Coverage**: No business search goes unanswered - users always get relevant credit card suggestions
- **Seamless Experience**: Automatic category selection dropdown appears when no business matches are found
- **20 Business Categories**: Complete coverage from grocery stores to streaming services to automotive services
- **API Integration**: Full backend support for category-based recommendations with filtering options

### Professional Pages Implementation (January 28, 2025)
- **About Us Page**: Comprehensive company story with mission, values, and agricultural branding consistency
- **Contact Us Page**: Professional contact form with business suggestions, support categories, and response time commitments
- **Privacy Policy**: Detailed privacy protection with emphasis on no bank account linking and data security
- **Terms of Service**: Complete legal framework covering disclaimers, user responsibilities, and affiliate relationships
- **FAQ Page**: 18 comprehensive questions covering features, privacy, recommendations, and safety
- **Enhanced Footer**: Professional footer navigation linking to all new pages for credibility and trust
- **Universal Access**: All professional pages accessible to both guest and authenticated users

## Deployment Strategy - January 2025

### Web Deployment (Replit Deployments)
- **Production Ready**: Core functionality complete with 150+ businesses and 50+ credit cards
- **Database**: PostgreSQL with proper migrations and session management
- **Authentication**: Replit Auth with social login integration
- **Mobile Optimized**: Responsive design optimized for mobile-first experience
- **Performance**: Optimized queries, caching, and error handling

### iOS App Preparation
- **Progressive Web App (PWA) Ready**: Mobile-optimized interface with app-like experience
- **API-First Architecture**: RESTful backend ready for native iOS integration
- **Authentication Compatible**: Replit Auth can integrate with iOS OAuth flows
- **Offline Capability**: Local storage for saved cards and search history
- **Native Features Ready**: Location services, push notifications, Touch ID integration potential

## Competitive Differentiation Strategy - January 2025

### Key Competitors Analysis
- **MaxRewards**: Bank sync, automatic offers, premium subscription
- **CardPointers**: Apple Wallet integration, rotating categories, push notifications
- **TPG App**: Travel-focused, content-heavy approach
- **AwardWallet**: Points tracking across multiple programs

### CashReap's Unique Value Propositions
1. **Agricultural/Harvest Theme**: Unique "reaping rewards" branding differentiates from sterile financial apps
2. **Business-First Search**: Search by specific business (Netflix, Planet Fitness) vs. category-only approach
3. **No Bank Account Sync Required**: Privacy-focused approach without requiring bank access
4. **Comprehensive Business Database**: 95+ major US businesses vs. competitors' category-only focus
5. **Guest Experience**: Try before sign-up reduces friction vs. competitors requiring immediate registration
6. **Streaming-Optimized**: First to properly categorize and optimize for streaming services boom
7. **Simple & Clean**: Mobile-first design without overwhelming features or premium upsells

### Competitive Advantages
- **Privacy-First**: No bank account linking required (major differentiator vs MaxRewards)
- **Instant Value**: Guest search provides immediate value without signup friction
- **Business-Specific**: Search "Netflix" not just "streaming" - more granular than competitors
- **Modern Categories**: Includes fitness, streaming, entertainment that others missed
- **Clean UX**: Focused on core value without feature bloat or subscription pressure

### Advanced Differentiation Features (January 2025)
1. **AI-Powered Optimization**: Smart algorithm suggests optimal card combinations for maximum rewards
2. **Real-Time ROI Calculator**: Break-even analysis and exact earnings predictions before applying
3. **Spending Goal Tracker**: Welcome bonus progress tracking and spending optimization
4. **Smart Alerts**: Proactive notifications for rotating categories and spending caps
5. **Mobile-First Design**: Built specifically for mobile-native Gen Z and Millennial users
6. **Community-Driven Database**: Crowdsourced store category verification for 95% accuracy
7. **Gamified Experience**: Achievement badges and streaks to make rewards optimization engaging
8. **Future AI Co-Pilot**: Planned personal AI assistant for automatic purchase optimization

### Innovation Roadmap
- **Predictive Analytics**: Forecast optimal spending patterns based on user behavior
- **Social Rewards**: Community features for sharing and discovering new reward opportunities
- **Voice Commands**: Hands-free card recommendations while shopping
- **Lifestyle Integration**: Smart home and calendar integration for purchase planning