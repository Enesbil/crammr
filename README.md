# 🎓 Crammr - AI-Powered Study Notes Platform

**Transforming the way students learn through curated notes, AI-powered tools, and collaborative knowledge sharing.**

## 🏆 What Makes Crammr Special

### 🎯 **Curated Notes Catalog - University & Course Specific**
- **School-Specific Content**: Notes are organized by university (currently featuring University of Florida)
- **Course-Specific Organization**: Each course (MAC2311, PHY2048, etc.) has its own dedicated section
- **Quality Curated**: Only the best student notes make it to the platform through our AI-powered review system
- **Proven Success**: Notes come from students who successfully completed and excelled in these specific courses

### 🤖 **AI-Powered Study Tools**
- **Smart Chat Assistant**: Ask questions about your notes and get instant, contextual answers
- **Dynamic Flashcard Generation**: AI creates custom flashcards from your PDF content (1-10 cards, topic-focused)
- **Intelligent Quiz Creation**: Generate multiple-choice quizzes tailored to specific topics within your notes
- **Plain Text Responses**: Clean, formatted answers optimized for student comprehension

### 📊 **Revolutionary Notes Comparison System**
- **AI-Powered Evaluation**: Compare new note submissions against approved standards using advanced AI analysis
- **Multi-Criteria Assessment**:
  - **Syllabus Closeness** (40%): How well notes align with official course objectives
  - **Organization** (20%): Structure, clarity, and logical flow of content  
  - **Exam Effectiveness** (40%): How well notes prepare students for actual exams
- **Human-in-the-Loop**: AI recommendations combined with human oversight ensures quality
- **Continuous Improvement**: As more high-quality notes are added, the standard continuously improves

## 🚀 Key Features

### 📚 **Student-Centric Design**
- **Free to Use**: All features available at no cost to students
- **By Students, For Students**: Built with real student needs in mind
- **University of Florida Focus**: Tailored specifically for UF courses and curriculum

### 🔧 **Technical Excellence**
- **Next.js 14** with React and TypeScript
- **Google Gemini AI** integration for all AI features
- **Custom PDF Processing** with base64 conversion and chunked processing
- **Responsive Design** with Tailwind CSS
- **Real-time Processing** with loading states and error handling

### 🎨 **User Experience**
- **Clean Interface**: Minimal, focused design that doesn't distract from studying
- **Interactive Tools**: Click-to-reveal flashcards, progress tracking, animated feedback
- **Mobile Responsive**: Study anywhere, on any device
- **Seamless Navigation**: Intuitive flow between notes, tools, and admin features

## 🏗️ **System Architecture**

### 📱 **Frontend Pages**
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
