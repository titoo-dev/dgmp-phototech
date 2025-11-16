# MarketScan - Photography Technology Platform

A modern Next.js application with comprehensive authentication using Better Auth, featuring email/password and social login options.

## Features

- 🔐 **Secure Authentication** with Better Auth
- 📧 **Email/Password** authentication
- 🌐 **Social Login** with Google and GitHub
- 🛡️ **Protected Routes** and user dashboard
- 🎨 **Modern UI** with Tailwind CSS
- ⚡ **TypeScript** for type safety
- 🗄️ **PostgreSQL** database with Prisma ORM

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: Better Auth
- **Database**: PostgreSQL with Prisma
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd phototech
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory (or copy `.env.example`):
   ```env
   # Database
   PRISMA_DATABASE_URL="postgresql://username:password@localhost:5432/marketscan"

   # Authentication
   BETTER_AUTH_SECRET="your-secret-key-here"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   DISABLE_SIGN_UP="false"
   
   # Admin Setup (set to "true" only for initial setup, then disable)
   ENABLE_ADMIN_SIGNUP="true"

   # Email (Resend)
   RESEND_API_KEY="your-resend-api-key"

   # File Storage (Vercel Blob)
   BLOB_READ_WRITE_TOKEN="your-blob-token"

   # Android App Download (optional)
   ANDROID_APP_URL="https://play.google.com/store/apps/details?id=com.dgmp.marketscan"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   pnpm prisma generate
   
   # Run database migrations
   pnpm prisma db push
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## OAuth Setup

### Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Add your redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy the Client ID and Client Secret to your `.env.local` file

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - Application name: PhotoTech
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy the Client ID and Client Secret to your `.env.local` file

## Project Structure

```
phototech/
├── src/
│   └── app/
│       ├── api/
│       │   └── auth/
│       │       └── [...better-auth]/
│       │           └── route.ts          # Auth API routes
│       ├── auth/
│       │   ├── signin/
│       │   │   └── page.tsx              # Sign in page
│       │   └── signup/
│       │       └── page.tsx              # Sign up page
│       ├── dashboard/
│       │   └── page.tsx                  # Protected dashboard
│       ├── layout.tsx                    # Root layout with AuthProvider
│       └── page.tsx                      # Home page
├── lib/
│   ├── auth.ts                           # Better Auth configuration
│   └── prisma.ts                         # Prisma client
├── prisma/
│   └── schema.prisma                     # Database schema
└── package.json
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run linting
- `pnpm format` - Format code

## Authentication Flow

1. **Home Page** (`/`) - Landing page with sign in/sign up links
2. **Sign In** (`/auth/signin`) - Email/password and social login
3. **Sign Up** (`/auth/signup`) - Create new account
4. **Admin Sign Up** (`/auth/admin-signup`) - Create admin account (U4/U5 roles) - **For initial setup only**
5. **Dashboard** (`/dashboard`) - Protected page for authenticated users

### Initial Setup - Creating the First Admin Account

For the first time setup, you need to create an admin account:

1. Set `ENABLE_ADMIN_SIGNUP="true"` in your `.env.local` file
2. Navigate to `http://localhost:3000/auth/admin-signup`
3. Create your admin account with either:
   - **U5 (Gestionnaire organisation)** - Organization manager role
   - **U4 (Administrateur système)** - System administrator role
4. After creating your admin account, set `ENABLE_ADMIN_SIGNUP="false"` to disable this route
5. Use the admin account to invite other users to organizations

**⚠️ Important**: The admin signup page should only be enabled during initial setup. Disable it after creating your first admin account for security purposes.

## Database Schema

The application uses the following Prisma schema:

- **User** - User accounts with email, name, and profile image
- **Account** - OAuth account connections
- **Session** - User sessions
- **VerificationToken** - Email verification tokens

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the development team.
