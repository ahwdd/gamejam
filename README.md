# Student Hub - Game Jam Event Management Platform

A Next.js 16 application for managing game jam events with comprehensive features including user registration, team management, game submissions, judging, and more.

## Features

- 🔐 **Authentication System**
  - Email OTP registration & login
  - WhatsApp OTP registration & login
  - Session management with HTTP-only cookies
  - Redux state management for auth

- 📋 **Event Management**
  - Event creation and scheduling
  - Registration management
  - Team formation and matching
  - Equipment tracking

- 🎮 **Game Submissions**
  - Game file uploads
  - Video submissions
  - Judging system
  - Awards and winners

- 👥 **User Management**
  - Guardian support for minors
  - Profile management
  - Activity tracking
  - Notifications

## Tech Stack

- **Framework**: Next.js 16.0.3
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS v4
- **Validation**: Zod
- **Authentication**: Custom OTP system with Laravel backend

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Laravel backend API (for OTP services)

## Getting Started

### 1. Clone and Install

\`\`\`bash
git clone <repository-url>
cd student-hub
npm install
\`\`\`

### 2. Environment Setup

Create a \`.env\` file in the root directory:

\`\`\`env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/student_hub?schema=public"

# External API Base URL (Laravel backend)
NEXT_PUBLIC_HUB_BASE_URL="http://localhost:8000"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Session Secret (generate a random string)
SESSION_SECRET="your-super-secret-session-key-here"
\`\`\`

### 3. Database Setup

\`\`\`bash
# Generate Prisma Client
npx prisma generate

# Create database migration
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view/edit data
npx prisma studio
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Database Schema

The application uses a comprehensive database schema including:

- **Users & Guardians**: User management with guardian support for minors
- **Events**: Event creation and management
- **Registrations**: Event registration tracking
- **Teams**: Team formation and management
- **Game Submissions**: Game and video submissions
- **Judging**: Judge management and scoring
- **Awards & Winners**: Prize distribution
- **Equipment, Catering, Giveaways**: Event logistics
- **Marketing, Media, Content**: Promotional materials
- **Notifications**: User notification system

See `prisma/schema.prisma` for the complete schema.

## API Routes

### Authentication

- `POST /api/auth/register/email/send-otp` - Send email OTP for registration
- `POST /api/auth/register/email/verify-otp` - Verify email OTP for registration
- `POST /api/auth/register/whatsapp/send-otp` - Send WhatsApp OTP for registration
- `POST /api/auth/register/whatsapp/verify-otp` - Verify WhatsApp OTP for registration
- `POST /api/auth/login/email/send-otp` - Send email OTP for login
- `POST /api/auth/login/email/verify-otp` - Verify email OTP for login
- `POST /api/auth/login/whatsapp/send-otp` - Send WhatsApp OTP for login
- `POST /api/auth/login/whatsapp/verify-otp` - Verify WhatsApp OTP for login
- `POST /api/auth/logout` - Logout from current device
- `POST /api/auth/logout-all` - Logout from all devices

### Users

- `GET /api/users/user` - Get current user information

## Redux State Management

The application uses Redux Toolkit for state management with the following features:

- **Auth Slice**: Manages authentication state, user information, and loading states
- **Typed Hooks**: Type-safe useAppDispatch and useAppSelector hooks
- **Async Thunks**: Handle API calls for authentication flows

## Authentication Flow

### Registration

1. User enters name and email/phone
2. System sends OTP via email or WhatsApp
3. User enters OTP code
4. System verifies OTP and creates account
5. Access and refresh tokens are stored in HTTP-only cookies
6. User is redirected to dashboard

### Login

1. User enters email/phone
2. System sends OTP
3. User enters OTP code
4. System verifies OTP and authenticates
5. Tokens are stored in cookies
6. User is redirected to dashboard

## Custom Hooks

### useAuth

Provides authentication functionality:

\`\`\`typescript
const {
  user,
  loading,
  error,
  isAuthenticated,
  initializationComplete,
  sendWhatsAppRegisterOTP,
  verifyWhatsAppRegisterOTP,
  sendEmailRegisterOTP,
  verifyEmailRegisterOTP,
  sendWhatsAppLoginOTP,
  verifyWhatsAppLoginOTP,
  sendEmailLoginOTP,
  verifyEmailLoginOTP,
  logout,
  logoutAll,
  refreshUser,
  clearAuthError,
} = useAuth();
\`\`\`

### withAuth HOC

Protects routes requiring authentication:

\`\`\`typescript
export default withAuth(DashboardPage);
\`\`\`

## Development

### Useful Commands

\`\`\`bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Prisma commands
npx prisma generate      # Generate Prisma Client
npx prisma migrate dev   # Create and apply migrations
npx prisma studio        # Open Prisma Studio
npx prisma db push       # Push schema changes without migrations
\`\`\`

## Deployment

### Environment Variables

Ensure all environment variables are set in your production environment:

- `DATABASE_URL`: PostgreSQL connection string
- `NEXT_PUBLIC_HUB_BASE_URL`: Laravel backend API URL
- `NEXT_PUBLIC_APP_URL`: Your application URL
- `SESSION_SECRET`: Secure random string

### Build

\`\`\`bash
npm run build
npm start
\`\`\`

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

[Your License Here]

## Support

For issues or questions, please open an issue on GitHub or contact the development team.