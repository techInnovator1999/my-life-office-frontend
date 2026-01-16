# MyLifeOffice - Next.js Client

## Quick Start

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Set up environment variables** (optional):
   Create a `.env.local` file in the root directory:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3002/api/v1
   ```
   If not set, it defaults to `http://localhost:3002/api/v1`

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:3000`

## Available Routes

- `/login` - Login page
- `/signup` - Registration page
- `/dashboard` - Dashboard (requires authentication)
- `/contacts` - Contacts management
- `/pipeline` - Pipeline/Kanban board
- `/profile` - User profile/onboarding
- `/settings` - Settings
- `/admin/agents` - Agents management (admin only)
- `/admin/agents/pending` - Pending agents (admin only)
- `/opportunities/individuals` - Individual opportunities
- `/opportunities/businesses` - Business opportunities
- `/opportunities/employees` - Employee opportunities

## Build for Production

```bash
npm run build
npm start
```

## Notes

- The app uses React Query for data fetching
- Authentication tokens are stored in localStorage or sessionStorage
- Theme switching (light/dark) is supported
- All pages are protected with authentication except login, signup, forgot-password, and reset-password
