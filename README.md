# Health Navigator (SymptomSense)

A React-based AI health assistant that helps users understand symptoms, get home remedies, and know when to see a doctor. Built with Vite, React, TypeScript, Tailwind CSS, Supabase, and Lovable AI Gateway.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase (PostgreSQL) |
| AI | Lovable AI Gateway + Google Gemini 3 Flash |
| Auth | Supabase Auth |
| Testing | Vitest + Playwright |

## AI API

**Provider**: Lovable AI Gateway  
**Endpoint**: `https://ai.gateway.lovable.dev/v1/chat/completions`  
**Model**: `google/gemini-3-flash-preview`  
**Environment Variable**: `LOVABLE_API_KEY` (set in Supabase Edge Function secrets)

The AI is configured as "SymptomSense" - a health guide that provides:
- Urgency level assessment (🟢 Minor / 🟡 Monitor / 🔴 Go Now)
- Most likely cause in plain language
- Home remedies with locally available ingredients
- Action steps and warnings
- Recovery timeline
- Doctor recommendations
- Multi-language support (English, Nepali, Hindi)

See: `supabase/functions/symptom-chat/index.ts`

## Authentication

**Provider**: Supabase Auth  
**Method**: Email/Password with session persistence  
**Features**:
- Auto-profile creation on signup (via database trigger)
- Persistent sessions with auto-refresh
- Row Level Security (RLS) policies protect user data

**Tables**: Uses `auth.users` (built-in) + `public.profiles` (extended user data)

See: `src/contexts/AuthContext.tsx`

## Database Schema

### Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `profiles` | Extended user data | `user_id`, `display_name`, `preferred_language` |
| `conversations` | Chat threads | `user_id`, `title`, `created_at`, `updated_at` |
| `messages` | Chat messages | `conversation_id`, `role` (user/assistant), `content` |

### Security

All tables have Row Level Security (RLS) enabled:
- Users can only access their own profile, conversations, and messages
- Messages are accessible only through their parent conversation

### Automation

- `handle_new_user()` - Auto-creates profile on signup
- `update_updated_at_column()` - Auto-updates timestamps

## Environment Variables

Create `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

Supabase Edge Function secret:
```
LOVABLE_API_KEY=your_lovable_api_key
```

## Database Changes Required

**Status**: ✅ Schema is already configured

The migration file at `supabase/migrations/20260406121939_c1b56c72-0efa-4ae5-90b2-ba1f2dc2d1e4.sql` creates:

1. **profiles** table - Extended user profiles with display name and language preference
2. **conversations** table - Chat session storage  
3. **messages** table - Individual chat messages
4. **RLS policies** - Security rules for data access
5. **Indexes** - Performance optimization
6. **Triggers** - Auto-profile creation and timestamp updates

### To Apply Migrations:

```bash
# Using Supabase CLI
supabase migration up

# Or apply via Supabase Dashboard → SQL Editor
```

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/       # UI components (shadcn/ui + custom)
├── contexts/          # Auth and Language contexts
├── hooks/             # Custom React hooks
├── integrations/      # Supabase client
├── lib/               # Utilities (i18n, chat-stream)
├── pages/             # Route components (Auth, Chat, Index)
└── test/              # Test setup

supabase/
├── functions/         # Edge Functions (symptom-chat)
└── migrations/        # Database schema
```

## Key Features

- **AI Health Chat**: Streaming responses with structured health guidance
- **Multi-language**: Supports English, Nepali, and Hindi
- **Conversation History**: Persistent chat threads per user
- **Safety First**: Clear urgency levels and doctor recommendations
- **Local Remedies**: Prioritizes locally available ingredients for Nepal context

## License

MIT
