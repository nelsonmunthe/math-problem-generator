# Math Problem Generator - Developer Assessment Starter Kit

## Overview

This is a starter kit for building an AI-powered math problem generator application. The goal is to create a standalone prototype that uses AI to generate math word problems suitable for Primary 5 students, saves the problems and user submissions to a database, and provides personalized feedback.

## Tech Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **AI Integration**: Google Generative AI (Gemini)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd math-problem-generator
```

### 2. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings → API to find your:
   - Project URL (starts with `https://`)
   - Anon/Public Key

### 3. Set Up Database Tables

1. In your Supabase dashboard, go to SQL Editor
2. Copy and paste the contents of `database.sql`
3. Click "Run" to create the tables and policies

### 4. Get Google API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key for Gemini

### 5. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
2. Edit `.env.local` and add your actual keys:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
   GOOGLE_API_KEY=your_actual_google_api_key
   ```

### 6. Install Dependencies

```bash
npm install
```

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Your Task

### 1. Implement Frontend Logic (`app/page.tsx`)

Complete the TODO sections in the main page component:

- **generateProblem**: Call your API route to generate a new math problem
- **submitAnswer**: Submit the user's answer and get feedback

### 2. Create Backend API Route (`app/api/math-problem/route.ts`)

Create a new API route that handles:

#### POST /api/math-problem (Generate Problem)
- Use Google's Gemini AI to generate a math word problem
- The AI should return JSON with:
  ```json
  {
    "problem_text": "A bakery sold 45 cupcakes...",
    "final_answer": 15
  }
  ```
- Save the problem to `math_problem_sessions` table
- Return the problem and session ID to the frontend

#### POST /api/math-problem/submit (Submit Answer)
- Receive the session ID and user's answer
- Check if the answer is correct
- Use AI to generate personalized feedback based on:
  - The original problem
  - The correct answer
  - The user's answer
  - Whether they got it right or wrong
- Save the submission to `math_problem_submissions` table
- Return the feedback and correctness to the frontend

### 3. Requirements Checklist

- [ ] AI generates appropriate Primary 5 level math problems
- [ ] Problems and answers are saved to Supabase
- [ ] User submissions are saved with feedback
- [ ] AI generates helpful, personalized feedback
- [ ] UI is clean and mobile-responsive
- [ ] Error handling for API failures
- [ ] Loading states during API calls

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Add your environment variables in Vercel's project settings
4. Deploy!

## Assessment Submission

When submitting your assessment, provide:

1. **GitHub Repository URL**: https://github.com/nelsonmunthe/math-problem-generator
2. **Live Demo URL**: https://vercel.com/nelson-munthes-projects/math-problem-generator
3. **Supabase Credentials**: Add these to your README for testing:
   ```
   SUPABASE_URL: https://abfqamordcqmjrqikejl.supabase.co
   SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiZnFhbW9yZGNxbWpycWlrZWpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NTQwODUsImV4cCI6MjA3NTEzMDA4NX0.4IKFkIfTqmlmKAGmzwAs9_qQFDi11UnaHmj-H8iyNBI
   ```

## Implementation Notes

*Please fill in this section with any important notes about your implementation, design decisions, challenges faced, or features you're particularly proud of.*

### My Implementation:

**Key Features Implemented:**
- **Dynamic Problem Generation**: AI generates unique, age-appropriate math word problems for Primary 5 students
- **Intelligent Answer Validation**: Server-side validation with proper error handling for invalid inputs
- **Personalized AI Feedback**: Context-aware feedback that adapts based on correctness, providing encouragement and educational guidance
- **Session Management**: Each problem gets a unique session ID for tracking submissions and maintaining state
- **Responsive UI**: Clean, mobile-friendly interface with loading states and visual feedback

**Technical Implementation Highlights:**
- **Robust Error Handling**: Comprehensive error handling for API failures, database errors, and AI response parsing
- **JSON Response Parsing**: Implemented regex-based JSON extraction from AI responses to handle potential formatting issues
- **Input Validation**: Server-side validation for numeric answers and required fields
- **Database Optimization**: Added proper indexes for performance and implemented CASCADE deletes for data integrity
- **Environment Configuration**: Proper environment variable management with validation

**Challenges Overcome:**
- **AI Response Parsing**: Gemini sometimes returns responses with extra text, so implemented regex extraction to reliably parse JSON
- **Type Safety**: Created comprehensive TypeScript interfaces for database operations and API responses
- **State Management**: Handled complex state updates in React with proper loading states and error boundaries
- **Database Relationships**: Implemented proper foreign key constraints and RLS policies for secure data access

**Code Quality & Best Practices:**
- **Clean API Design**: RESTful endpoints with proper HTTP status codes and consistent response formats
- **Separation of Concerns**: Clear separation between frontend logic, API routes, and database operations
- **Error Boundaries**: Graceful error handling with user-friendly error messages
- **Performance**: Optimized database queries with proper indexing and efficient data structures

**Notable Technical Decisions:**
- Used `axios` for HTTP requests instead of fetch for better error handling and request/response interceptors
- Implemented proper loading states to prevent multiple simultaneous requests
- Used UUIDs for session management to ensure uniqueness and security
- Implemented proper form validation with required fields and numeric input constraints

## Additional Features (Optional)

If you have time, consider adding:

- [ ] Difficulty levels (Easy/Medium/Hard)
- [ ] Problem history view
- [ ] Score tracking
- [ ] Different problem types (addition, subtraction, multiplication, division)
- [ ] Hints system
- [ ] Step-by-step solution explanations

---

Good luck with your assessment! 🎯