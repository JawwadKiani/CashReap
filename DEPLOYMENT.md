# Deployment Guide for CashReap

This guide covers deploying CashReap to various platforms after removing all Replit dependencies.

## 🚀 Platform Options

### 1. Vercel (Recommended for Frontend + Serverless)

**Prerequisites:**
- GitHub repository
- Vercel account
- PostgreSQL database (Neon, Supabase, or Railway)

**Steps:**
1. Push code to GitHub
2. Connect Vercel to your GitHub repo
3. Set environment variables in Vercel dashboard:
   ```
   DATABASE_URL=your_postgresql_url
   SESSION_SECRET=your_secret_key
   NODE_ENV=production
   ```
4. Deploy with these build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 2. Railway (Full-Stack with Database)

**Steps:**
1. Connect GitHub repo to Railway
2. Add PostgreSQL service
3. Set environment variables:
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   SESSION_SECRET=your_secret_key
   NODE_ENV=production
   ```
4. Railway will auto-deploy on git push

### 3. Render (Free Tier Available)

**Steps:**
1. Connect GitHub repo
2. Create Web Service with:
   - Build Command: `npm run build`
   - Start Command: `npm start`
3. Add PostgreSQL database service
4. Set environment variables

### 4. DigitalOcean App Platform

**Steps:**
1. Connect GitHub repository
2. Configure app spec:
   ```yaml
   name: cashreap
   services:
   - name: web
     source_dir: /
     github:
       repo: your-username/cashreap
       branch: main
     run_command: npm start
     build_command: npm run build
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
   databases:
   - name: db
     engine: PG
     version: "13"
   ```

### 5. Heroku

**Steps:**
1. Install Heroku CLI
2. Create app: `heroku create cashreap-app`
3. Add PostgreSQL: `heroku addons:create heroku-postgresql:hobby-dev`
4. Set environment variables:
   ```bash
   heroku config:set SESSION_SECRET=your_secret_key
   heroku config:set NODE_ENV=production
   ```
5. Deploy: `git push heroku main`

## 🗄 Database Setup

### Option 1: Neon (Recommended)
1. Create account at neon.tech
2. Create new project and database
3. Copy connection string
4. Run migrations: `npm run db:push`

### Option 2: Supabase
1. Create project at supabase.com
2. Get PostgreSQL connection details
3. Use connection string format: `postgresql://postgres:[password]@[host]:5432/postgres`

### Option 3: Railway PostgreSQL
1. Add PostgreSQL service in Railway
2. Use the provided DATABASE_URL
3. Automatic connection handling

### Option 4: Self-hosted PostgreSQL
1. Install PostgreSQL on your server
2. Create database and user
3. Configure connection string

## 🔧 Environment Variables

**Required:**
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Random string for session encryption (use: `openssl rand -base64 32`)
- `NODE_ENV`: Set to `production`

**Optional:**
- `OPENAI_API_KEY`: For future AI features
- `PORT`: Server port (defaults to 5000)

## 📦 Build Process

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the application:**
   ```bash
   npm run build
   ```

3. **Run database migrations:**
   ```bash
   npm run db:push
   ```

4. **Start production server:**
   ```bash
   npm start
   ```

## 🔒 Security Checklist

- [ ] Set strong `SESSION_SECRET` (32+ random characters)
- [ ] Use HTTPS in production
- [ ] Set `NODE_ENV=production`
- [ ] Enable database SSL (most hosting platforms do this automatically)
- [ ] Review and update CORS settings if needed
- [ ] Ensure environment variables are not committed to git

## 🔧 Troubleshooting

### Common Issues:

1. **Database Connection Errors:**
   - Verify DATABASE_URL format
   - Check if database allows external connections
   - Ensure SSL is properly configured

2. **Build Failures:**
   - Check Node.js version (requires 18+)
   - Verify all dependencies are installed
   - Review build logs for specific errors

3. **Session Issues:**
   - Ensure SESSION_SECRET is set
   - Check if cookies are working (HTTPS required in production)
   - Verify session store configuration

4. **Missing Features:**
   - Run `npm run db:push` to update database schema
   - Check if all environment variables are set
   - Verify API routes are accessible

## 📊 Performance Optimization

1. **Enable gzip compression** (most platforms enable by default)
2. **Use CDN** for static assets (Vercel/Railway provide this)
3. **Database indexing** (already optimized in schema)
4. **Connection pooling** (built into Drizzle ORM)

## 🔄 CI/CD Setup

**GitHub Actions Example:**
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run check
      # Add deployment steps for your platform
```

## 📈 Monitoring

Consider adding:
- **Error tracking**: Sentry, LogRocket
- **Analytics**: Google Analytics, Plausible
- **Uptime monitoring**: UptimeRobot, Pingdom
- **Performance monitoring**: New Relic, DataDog

---

**Need help?** Open an issue on GitHub or contact support@cashreap.com