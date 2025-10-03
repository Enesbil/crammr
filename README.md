# Crammr: An AI-Powered Study Platform

Crammr is a free, non-profit platform that provides students with access to high-quality, university-specific study notes, enhanced with a suite of intelligent, AI-powered learning tools. This project was developed by a single student in 36 hours at the Shellhacks hackathon.

**[Live Demo](https://crammr-mvp.onrender.com/)** | **[Video Walkthrough](https://www.youtube.com/watch?v=gQo1GUCX5eo)**

## The Problem

For many university students, finding reliable and relevant study material is a significant challenge. The available options are often limited to searching for a classmate with high-quality notes, paying for expensive tutoring services, or navigating a vast amount of irrelevant, often paywalled, online content.

## The Solution

Crammr addresses this by creating a centralized, free-to-use hub for the best study resources, curated specifically for each course at a given university. The platform is built on two core pillars:

1.  **AI-Powered Note Curation**: Crammr collects notes submitted by students who have successfully completed a course. An advanced AI algorithm, powered by the Google Gemini API, analyzes these submissions against the course syllabus and approved reference materials to score them based on syllabus coverage, organization, and exam effectiveness. A human volunteer then performs a final review to ensure only the highest quality notes are published.

2.  **Intelligent Study Suite**: To enhance the learning experience, Crammr provides a set of AI tools that work with the curated notes:

      * **Smart Chatbot**: A contextual assistant that can answer questions about the course material by referencing the provided notes and syllabus.
      * **Dynamic Quiz Generation**: Creates personalized quizzes to help students test their knowledge on specific topics.
      * **Podcast Summaries**: Generates audio summaries of the material for on-the-go learning.

## Key Features

  * **University-Specific Content**: Notes are organized by university and course, ensuring all content is relevant to the student's specific curriculum.
  * **AI Quality Analysis**: A multi-criteria algorithm evaluates and ranks submitted notes, combining AI analysis with human oversight to maintain high standards.
  * **Context-Aware AI Tools**: The chatbot, quiz generator, and other tools are designed to work directly with the content of the notes a student is viewing.
  * **Student-Centric and Non-Profit**: The platform is built by students, for students, and is committed to being a free resource.
  * **Admin Dashboard**: A dedicated interface for volunteers to review AI analysis, manage submissions, and approve content.

## Tech Stack

  * **Framework**: Next.js 14 (App Router)
  * **Language**: TypeScript
  * **AI Engine**: Google Gemini API for note analysis, chat functionality, and content generation.
  * **Styling**: Tailwind CSS
  * **UI Components**: shadcn/ui

## Setup and Installation

### Prerequisites

  * Node.js version 18.0.0 or higher
  * A package manager such as `npm` or `pnpm`
  * A Google Gemini API key

### Installation Steps

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/crammr.git
    cd crammr
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root directory and add your Google Gemini API key:

    ```env
    GEMINI_API_KEY="your_google_gemini_api_key_here"
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:3000`.

## Future Work

As a functional MVP, the next steps for Crammr include:

  * **Full-Scale Deployment**: Building out a dedicated development team to prepare the platform for a production environment.
  * **University Rollout**: Launching the platform at Florida universities, starting with Florida International University (FIU) and the University of Florida (UF), with the help of student volunteers.
- **Landing Page** (`/`): Hero section with animated text and clear call-to-action
- **Classes Browser** (`/classes`): Course selection with UF-specific catalog
- **Notes Viewer** (`/notes/[classCode]`): Main study interface with PDF viewer, AI chat, and revision tools
- **Admin Dashboard** (`/admin`): Submission management and AI-powered note comparison

### 🧠 **AI Integration**
```typescript
// Example: Flashcard Generation
const generateFlashcards = async () => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  
  // Validate topic relevance first
  const validation = await ai.validateTopic(userTopic, pdfContent)
  if (!validation.isValid) {
    throw new Error(validation.suggestion)
  }
  
  // Generate structured content
  const flashcards = await ai.generateContent({
    model: "gemini-2.5-flash",
    prompt: `Generate ${count} flashcards about ${topic}...`,
    format: "JSON"
  })
  
  return flashcards
}
```

### 📊 **Comparison Algorithm**
```typescript
// Weighted scoring system
const calculateScore = (metrics) => {
  return (
    metrics.syllabusCloseness * 0.4 +
    metrics.organization * 0.2 +
    metrics.examEffectiveness * 0.4
  )
}
```

## 🎯 **Target Impact**

### 📈 **For Students**
- **Better Grades**: Access to proven successful study materials
- **Time Savings**: AI tools reduce time spent creating study materials
- **Confidence**: Study with materials that have helped others succeed
- **Accessibility**: Free access removes financial barriers to quality study resources

### 🏫 **For Universities**
- **Quality Assurance**: AI ensures only high-quality materials are shared
- **Course Alignment**: Notes are guaranteed to match current syllabi and learning objectives
- **Student Success**: Better study materials lead to improved academic outcomes
- **Resource Optimization**: Reduces redundant study material creation

### 🌟 **Long-term Vision**
- **Network Effects**: As more students contribute, quality standards continuously improve
- **Scalability**: System designed to expand to multiple universities and hundreds of courses
- **AI Evolution**: Continuous learning improves recommendations and content generation
- **Community Building**: Foster collaborative learning environments

## 🛠️ **Setup Instructions**

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/crammr.git
   cd crammr
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   # Create .env.local file
   echo "GEMINI_API_KEY=your_api_key_here" > .env.local
   ```

4. **Run development server**
   ```bash
   npm run dev
   # or  
   pnpm dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

### Environment Variables
```env
GEMINI_API_KEY=your_google_gemini_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📁 **Project Structure**

```
crammr/
├── app/                     # Next.js 14 App Router
│   ├── page.tsx            # Landing page
│   ├── classes/            # Course browser
│   ├── notes/[classCode]/  # Main study interface
│   ├── admin/              # Admin dashboard
│   └── layout.tsx          # Root layout
├── components/             # Reusable UI components
│   ├── navbar.tsx          # Navigation
│   ├── footer.tsx          # Footer
│   ├── custom-pdf-viewer.tsx # PDF display
│   └── animated-text.tsx   # Hero animations
├── lib/                    # Utility functions
├── public/                 # Static assets (PDFs, images)
└── styles/                 # Global styles
```
