# CashReap - Credit Card Rewards Recommendation App

![CashReap Logo](./client/src/assets/favicon.png)

## 🌾 Harvest Your Rewards with Smart Credit Card Recommendations

CashReap is a comprehensive web application that helps users find the best credit cards for maximum rewards at any major US business. With an agricultural harvest theme, CashReap makes it easy to "reap" the best cash back rewards from your everyday purchases.

## ✨ Features

### Core Functionality
- **🏪 Business Search**: Search from 220+ major US businesses including national chains and regional favorites
- **💳 Smart Recommendations**: AI-powered credit card recommendations based on merchant categories
- **🔍 Advanced Filtering**: Filter by annual fees, credit score requirements, and reward rates
- **📊 Category Fallback**: Get recommendations even for unlisted businesses by selecting categories
- **📱 Mobile-First Design**: Responsive design optimized for mobile and desktop

### Professional Pages
- **About Us**: Company mission and values with agricultural branding
- **Contact Us**: Professional contact form with business suggestions
- **Privacy Policy**: Comprehensive privacy protection details
- **Terms of Service**: Complete legal framework
- **FAQ**: 18+ detailed questions covering all features

### User Features
- **🔐 Secure Authentication**: Email/password login with encrypted storage
- **💾 Save Favorite Cards**: Personal card management and tracking
- **📈 Search History**: Track previously searched businesses
- **🎯 Reward Calculator**: Calculate potential earnings from different cards

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Wouter** for routing
- **TanStack Query** for server state management
- **Tailwind CSS** with shadcn/ui components
- **Vite** for build tooling

### Backend
- **Node.js** with Express.js
- **TypeScript** with ES modules
- **Drizzle ORM** with PostgreSQL
- **Passport.js** for authentication
- **bcrypt** for password hashing

### Database
- **PostgreSQL** (compatible with Neon, Supabase, Railway, etc.)
- **Drizzle Kit** for migrations
- **Session storage** for secure user sessions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cashreap.git
   cd cashreap
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/cashreap
   SESSION_SECRET=your-super-secret-session-key-here
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5000`

### Production Build

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 📊 Database Schema

### Core Tables
- **users**: User accounts with encrypted passwords
- **credit_cards**: Credit card information and features  
- **merchant_categories**: Business categories (grocery, gas, dining, etc.)
- **card_category_rewards**: Reward rates for card/category combinations
- **stores**: 220+ US businesses with location data
- **user_search_history**: Track user searches
- **user_saved_cards**: User's favorite cards
- **sessions**: Secure session storage

### Advanced Features
- **user_spending_profiles**: Monthly spending by category
- **purchase_plans**: Planned purchases with reward projections
- **welcome_bonus_tracking**: Track signup bonus progress
- **user_preferences**: Personalized settings
- **card_comparisons**: Side-by-side card comparisons

## 🗄 Business Database

CashReap includes a comprehensive database of 220+ major US businesses across 20 categories:

- **Grocery Stores**: Walmart, Target, Kroger, Safeway, H-E-B, Wegmans, Publix
- **Restaurants**: McDonald's, Starbucks, Chipotle, Subway, Taco Bell, Chick-fil-A
- **Gas Stations**: Shell, BP, Exxon, Chevron, Mobil, Speedway, Wawa
- **Department Stores**: Macy's, Nordstrom, Kohl's, JCPenney, Dillard's
- **Online Shopping**: Amazon, eBay, Etsy, Wayfair, Overstock
- **Streaming Services**: Netflix, Disney+, Hulu, HBO Max, Spotify, Apple Music
- **And many more!**

## 🎨 Design Philosophy

### Agricultural Theme
- **🌾 Wheat Icon**: Represents the harvest/farming theme
- **💰 Dollar Sign**: Symbolizes financial rewards and savings
- **🎨 Color Palette**: Amber/gold (wheat) and green (money) 
- **✨ Slogan**: "Harvest Your Rewards"

### User Experience
- **Guest-First**: Full functionality without account creation
- **Privacy-Focused**: No bank account linking required
- **Mobile-Optimized**: Touch-friendly interface
- **Fast Performance**: Optimized queries and caching

## 🔒 Security Features

- **Password Encryption**: bcrypt hashing with salt rounds
- **Session Security**: Secure HTTP-only cookies
- **SQL Injection Protection**: Parameterized queries with Drizzle ORM
- **Input Validation**: Zod schemas for all user inputs
- **CSRF Protection**: Built-in Express.js security

## 📈 Performance

- **Optimized Database**: Indexed queries for fast search
- **Efficient Caching**: TanStack Query for client-side caching
- **Bundle Optimization**: Vite for optimized production builds
- **Lazy Loading**: Components loaded on demand

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for beautiful UI components
- **Lucide React** for consistent iconography
- **Drizzle ORM** for type-safe database operations
- **TanStack Query** for powerful data fetching

## 📞 Support

For support, email support@cashreap.com or create an issue on GitHub.

---

**Happy Harvesting! 🌾💰**