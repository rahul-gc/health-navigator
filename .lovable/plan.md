

## SymptomSense — AI Health Symptom Analyzer

### Overview
A clean, health-themed AI chatbot that helps users understand symptoms, get home remedies, and know when to see a doctor. Features multi-language UI (English/Nepali/Hindi), user authentication, and persistent chat history.

### Pages & Navigation

1. **Landing/Auth Page** — Simple login/signup with email & password. Health-themed branding with green accents on a light background.

2. **Chat Page (Main)** — Full-screen chat interface with:
   - Sidebar showing past conversations (chat history list)
   - New chat button
   - Language switcher (EN/NE/HI) in the header
   - Chat input at the bottom
   - AI responses rendered with markdown formatting, emoji section headers
   - Three suggested follow-up buttons after each AI response

### Design
- Light, clean theme with white backgrounds and soft green/teal accents
- Health-themed icon/logo
- Chat bubbles: user messages on right (green), AI responses on left (white/gray)
- Responsive — works on mobile with collapsible sidebar

### Backend (Lovable Cloud)

1. **Database tables:**
   - `profiles` — user profile linked to auth
   - `conversations` — id, user_id, title, created_at
   - `messages` — id, conversation_id, role, content, created_at

2. **Edge function: `symptom-chat`**
   - Receives messages array + conversation context
   - Uses the full SymptomSense system prompt
   - Streams responses via Lovable AI Gateway (Gemini model)
   - Handles 429/402 errors gracefully

3. **Auth** — Email/password signup & login

### Key Features
- Streaming AI responses with token-by-token rendering
- Auto-detect language and respond accordingly (handled by system prompt)
- UI language switcher changes all labels/buttons
- Conversation auto-titled from first message
- Suggested follow-up prompts after each response
- Safety disclaimer appended to every AI response
- Past conversations listed in sidebar, clickable to reload

