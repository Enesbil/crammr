"use client"

import { useState, useEffect } from "react"
import { Send, Underline, Rocket, BookOpen, HelpCircle, Brain, Headphones } from "lucide-react"
import { Navbar } from "@/components/navbar"
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { GoogleGenAI } from '@google/genai'

// Dynamically import the custom PDF viewer to avoid SSR issues
const CustomPDFViewer = dynamic(() => import('@/components/custom-pdf-viewer'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full bg-white"><div className="text-gray-600">Loading PDF viewer...</div></div>
})

interface NoteViewProps {
  params: {
    classCode: string
  }
}

export default function NoteView({ params }: NoteViewProps) {
  const router = useRouter()
  const [isOwnNotes, setIsOwnNotes] = useState(false)
  const [uploadedPdfUrl, setUploadedPdfUrl] = useState<string | null>(null)
  const [showComingSoonPopup, setShowComingSoonPopup] = useState(false)
  const [activeRevisionTool, setActiveRevisionTool] = useState<'main' | 'flashcards' | 'quiz'>('main')
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0)
  const [showFlashcardAnswer, setShowFlashcardAnswer] = useState(false)
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<number[]>([])
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  
  // Generation options state
  const [showGenerationOptions, setShowGenerationOptions] = useState(false)
  const [generationType, setGenerationType] = useState<'flashcards' | 'quiz'>('flashcards')
  const [questionCount, setQuestionCount] = useState(5)
  const [sectionFocus, setSectionFocus] = useState('derivatives')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedFlashcards, setGeneratedFlashcards] = useState<Array<{question: string, answer: string}>>([])
  const [generatedQuizQuestions, setGeneratedQuizQuestions] = useState<Array<{question: string, options: string[], correctAnswer: number}>>([])

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm here to help you understand your course material. Ask me anything about the notes and I'll search through the content to give you detailed explanations.",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Example flashcards data - would be replaced with generated content
  const flashcards = [
    {
      question: "What is the power rule for derivatives?",
      answer: "d/dx(xⁿ) = nx^(n-1)"
    },
    {
      question: "What is the derivative of a constant?",
      answer: "The derivative of any constant is 0"
    },
    // ... more flashcards
  ]

  // Example quiz data - would be replaced with generated content  
  const quizQuestions = [
    {
      question: "What is the derivative of 5x?",
      options: ["5", "5x", "0", "x"],
      correctAnswer: 0
    },
    {
      question: "What is the derivative of x⁴?",
      options: ["x³", "4x³", "4x⁴", "x⁴/4"],
      correctAnswer: 1
    },
    // ... more questions
  ]

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = inputMessage.trim()
    setInputMessage("")
    setIsLoading(true)

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])

    try {
      console.log('🚀 Attempting to call Gemini API with PDF context...')
      
      // Initialize AI with server-side environment variable
      // Note: In production, this should be handled via API routes to keep the key secure
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' })

      // Get the current PDF being viewed
      const pdfUrl = isOwnNotes && uploadedPdfUrl ? uploadedPdfUrl : "/NimratNotes.pdf"
      
      console.log('📄 Fetching PDF:', pdfUrl)
      
      // Fetch and convert PDF to base64
      const pdfResponse = await fetch(pdfUrl)
      const pdfBuffer = await pdfResponse.arrayBuffer()
      const pdfBase64 = btoa(
        new Uint8Array(pdfBuffer)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      )
      
      console.log('✅ PDF converted to base64, size:', pdfBase64.length)

      // Create prompt for AI
      const prompt = `You are a calculus tutor. Answer in PLAIN TEXT ONLY - no markdown, no formatting, no bullet points, no special characters.

Keep your answer SHORT and CONCISE (2-3 sentences max).

Student question: "${userMessage}"

Based on the PDF notes attached, give a brief, direct answer. If the topic isn't in the PDF, give a short general calculus explanation.`

      console.log('🤖 Sending to Gemini with PDF + prompt')

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{
          parts: [
            {
              inlineData: {
                data: pdfBase64,
                mimeType: "application/pdf"
              }
            },
            {
              text: prompt
            }
          ]
        }],
      })

      console.log('✨ Received response:', response)

      // Clean up response - remove any markdown/formatting
      let cleanResponse = response.text || "Sorry, I couldn't generate a response."
      
      cleanResponse = cleanResponse
        .replace(/\*\*/g, '') // Remove bold
        .replace(/\*/g, '')   // Remove italics
        .replace(/`/g, '')    // Remove code formatting
        .replace(/#{1,6}\s/g, '') // Remove headers
        .replace(/\n\s*[-*+]\s/g, '\n') // Remove bullet points
        .replace(/\n{3,}/g, '\n\n') // Limit line breaks
        .trim()

      // Add AI response
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: cleanResponse,
        },
      ])
    } catch (error) {
      console.error('❌ Error calling Gemini API:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Please configure your Gemini API key in the environment variables to use this feature.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const generateFlashcards = async () => {
    setIsGenerating(true)
    try {
      console.log('🃏 Generating flashcards...')
      // Note: In production, this should be handled via API routes to keep the key secure
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' })

      // Get only the PDF being viewed
      const pdfUrl = isOwnNotes && uploadedPdfUrl ? uploadedPdfUrl : "/NimratNotes.pdf"
      
      // Fetch and convert PDF
      const pdfResponse = await fetch(pdfUrl)
      const pdfBuffer = await pdfResponse.arrayBuffer()
      const pdfBase64 = btoa(new Uint8Array(pdfBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''))

      // First, validate the topic relevance
      const validationPrompt = `You are analyzing a calculus PDF. The user wants to generate content about: "${sectionFocus}".

Is this topic relevant to calculus/mathematics content that would likely be in this PDF? Respond with only "VALID" or "INVALID: suggest a more relevant topic like [suggestion]".

If the topic is too vague (like "all" or "everything"), respond "INVALID: be more specific about a calculus topic like derivatives, limits, integrals, etc."`

      const validationResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{
          parts: [
            { inlineData: { data: pdfBase64, mimeType: "application/pdf" } },
            { text: validationPrompt }
          ]
        }],
      })

      const validationResult = validationResponse.text || ""
      
      if (validationResult.startsWith("INVALID")) {
        throw new Error(validationResult.replace("INVALID: ", ""))
      }

      const sectionPrompt = sectionFocus === 'all' ? 'the entire document' : `content specifically related to: ${sectionFocus}`
      
      const prompt = `Generate exactly ${questionCount} flashcards from ${sectionPrompt}. 

Return ONLY a JSON array with this exact format:
[
  {"question": "Question text here", "answer": "Answer text here"},
  {"question": "Question text here", "answer": "Answer text here"}
]

Focus on key concepts, definitions, formulas, and important facts from the PDF. Make questions clear and answers concise.`

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{
          parts: [
            { inlineData: { data: pdfBase64, mimeType: "application/pdf" } },
            { text: prompt }
          ]
        }],
      })

      let responseText = response.text || ""
      
      // Extract JSON from response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        const flashcardsData = JSON.parse(jsonMatch[0])
        setGeneratedFlashcards(flashcardsData)
        console.log('✅ Generated flashcards:', flashcardsData)
      } else {
        throw new Error('Invalid response format')
      }
      
    } catch (error) {
      console.error('❌ Error generating flashcards:', error)
      alert(error instanceof Error ? error.message : "Please configure your Gemini API key to use this feature.")
      setGeneratedFlashcards([])
    } finally {
      setIsGenerating(false)
    }
  }

  // Similar quiz generation function...
  const generateQuiz = async () => {
    // Implementation similar to generateFlashcards but for quiz format
    // This would be a full implementation in the actual codebase
    setIsGenerating(true)
    try {
      // Quiz generation logic here...
      // For demo purposes, showing the structure
      console.log('Generating quiz questions...')
      // Would implement full quiz generation similar to flashcards
    } catch (error) {
      console.error('Error generating quiz:', error)
      alert("Please configure your Gemini API key to use this feature.")
    } finally {
      setIsGenerating(false)
    }
  }

  // Event handlers for UI interactions
  const handleStartFlashcards = () => {
    setGenerationType('flashcards')
    setShowGenerationOptions(true)
  }

  const handleStartQuiz = () => {
    setGenerationType('quiz')
    setShowGenerationOptions(true)
  }

  const handleGenerate = async () => {
    try {
      if (generationType === 'flashcards') {
        await generateFlashcards()
        setShowGenerationOptions(false)
        setActiveRevisionTool('flashcards')
        setCurrentFlashcardIndex(0)
        setShowFlashcardAnswer(false)
      } else {
        await generateQuiz()
        setShowGenerationOptions(false)
        setActiveRevisionTool('quiz')
        setCurrentQuizQuestion(0)
        setQuizAnswers([])
        setQuizCompleted(false)
        setQuizScore(0)
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Generation failed. Please try a different topic.")
    }
  }

  // Additional UI interaction handlers...
  const handleComingSoon = () => {
    setShowComingSoonPopup(true)
    setTimeout(() => setShowComingSoonPopup(false), 2500)
  }

  const handleBackToMain = () => {
    setActiveRevisionTool('main')
  }

  // File upload handler
  const handleSwitchNotes = () => {
    if (!isOwnNotes) {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'application/pdf'
      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0]
        if (file && file.type === 'application/pdf') {
          const url = URL.createObjectURL(file)
          setUploadedPdfUrl(url)
          setIsOwnNotes(true)
        } else {
          alert('Please select a valid PDF file.')
        }
      }
      input.click()
    } else {
      setIsOwnNotes(false)
      if (uploadedPdfUrl) {
        URL.revokeObjectURL(uploadedPdfUrl)
      }
      setUploadedPdfUrl(null)
    }
  }

  return (
    <div className="bg-[#FAFAFA]">
      <Navbar />

      <div className="flex h-[calc(100vh-68px)] gap-3 p-3">
        {/* Left Chat Panel */}
        <div className="w-80 bg-white rounded-lg border border-[#e5e5e5] flex flex-col">
          <div className="p-3 border-b border-[#e5e5e5] h-[56px] flex items-center">
            <h2 className="text-base font-semibold text-[#222222] font-[family-name:var(--font-heading)]">
              Chat with Gemini
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message, index) => (
              <div key={index} className={`${message.role === "user" ? "ml-4" : "mr-4"}`}>
                <div
                  className={`p-3 rounded-lg ${
                    message.role === "user" ? "bg-[#007bcc] text-white ml-auto" : "bg-gray-100 text-[#222222]"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="mr-4">
                <div className="p-3 rounded-lg bg-gray-100 text-[#222222]">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-sm text-gray-500">Gemini is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-[#e5e5e5]">
            <div className="relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
                placeholder={isLoading ? "Please wait..." : "Ask about the notes..."}
                disabled={isLoading}
                className="w-full px-3 py-2 pr-12 border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#007bcc] disabled:bg-gray-50 disabled:text-gray-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-[#007bcc] hover:text-[#005a99] transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Center Note Content */}
        <div className="flex-1 bg-white rounded-lg border border-[#e5e5e5] flex flex-col overflow-hidden">
          <div className="p-3 border-b border-[#e5e5e5] h-[56px] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-base font-semibold text-[#222222] font-[family-name:var(--font-heading)]">
                {params.classCode.toUpperCase()} - Calculus 1
              </h1>
              {!isOwnNotes && (
                <span className="text-xs text-gray-500">
                  (Sample Notes)
                </span>
              )}
            </div>

            <button
              onClick={handleSwitchNotes}
              className="px-3 py-2 bg-[#e1b839] text-[#222222] rounded-lg hover:bg-[#d4a832] transition-colors text-sm font-medium"
            >
              {isOwnNotes ? "Switch to sample notes" : "Upload your own notes"}
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            {isOwnNotes && uploadedPdfUrl ? (
              <CustomPDFViewer pdfUrl={uploadedPdfUrl} />
            ) : !isOwnNotes ? (
              <CustomPDFViewer pdfUrl="/NimratNotes.pdf" />
            ) : (
              <div className="flex items-center justify-center h-full bg-white">
                <div className="text-center">
                  <p className="text-gray-600 mb-4">No PDF uploaded yet</p>
                  <button 
                    onClick={handleSwitchNotes}
                    className="px-4 py-2 bg-[#007bcc] text-white rounded hover:bg-[#005a99]"
                  >
                    Upload PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Revision Tools Panel */}
        <div className="w-80 bg-white rounded-lg border border-[#e5e5e5] flex flex-col">
          <div className="p-3 border-b border-[#e5e5e5] h-[56px] flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#222222] font-[family-name:var(--font-heading)]">
              {activeRevisionTool === 'main' && 'AI-Powered Revision Tools'}
              {activeRevisionTool === 'flashcards' && 'Flashcards'}
              {activeRevisionTool === 'quiz' && 'Quiz'}
            </h2>
            {activeRevisionTool !== 'main' && (
              <button 
                onClick={handleBackToMain}
                className="text-sm text-[#007bcc] hover:text-[#005a99] transition-colors"
              >
                ← Back
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeRevisionTool === 'main' && (
              <div className="p-4 space-y-3">
                <button 
                  onClick={handleStartFlashcards}
                  className="w-full p-4 bg-[#007bcc] text-white rounded-lg hover:bg-[#005a99] transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <BookOpen size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold">Flashcards</h3>
                      <p className="text-sm opacity-75">Review key concepts</p>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={handleStartQuiz}
                  className="w-full p-4 bg-[#007982] text-white rounded-lg hover:bg-[#005a66] transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <HelpCircle size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold">Quiz</h3>
                      <p className="text-sm opacity-75">Test your knowledge</p>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={handleComingSoon}
                  className="w-full p-4 bg-[#e1b839] text-[#222222] rounded-lg hover:bg-[#d4a832] transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-black/10 rounded-lg flex items-center justify-center">
                      <Brain size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold">Mind Map</h3>
                      <p className="text-sm opacity-75">Visualize concepts</p>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={handleComingSoon}
                  className="w-full p-4 bg-gray-100 text-[#222222] rounded-lg hover:bg-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-black/10 rounded-lg flex items-center justify-center">
                      <Headphones size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold">Podcast</h3>
                      <p className="text-sm opacity-75">Audio summary</p>
                    </div>
                  </div>
                </button>
              </div>
            )}

            {/* Flashcard and Quiz interfaces would be implemented here */}
            {/* For brevity, showing the structure but not the full implementation */}

          </div>

          {activeRevisionTool === 'main' && (
            <div className="p-3 border-t border-[#e5e5e5]">
              <p className="text-xs text-[#666666] text-center">All revision tools powered by AI</p>
            </div>
          )}
        </div>
      </div>

      {/* Generation Options Modal */}
      {showGenerationOptions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 mx-4">
            {isGenerating ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 border-4 border-[#007bcc] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold mb-2">
                  Generating {generationType === 'flashcards' ? 'Flashcards' : 'Quiz'}...
                </h3>
                <p className="text-gray-600 text-sm">
                  AI is analyzing your PDF and creating {questionCount} {generationType === 'flashcards' ? 'flashcards' : 'questions'} about "{sectionFocus}"
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-4">
                  Generate {generationType === 'flashcards' ? 'Flashcards' : 'Quiz'}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Number of {generationType === 'flashcards' ? 'flashcards' : 'questions'} (1-10):
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={questionCount}
                      onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-center text-sm text-gray-600 mt-1">
                      {questionCount} {generationType === 'flashcards' ? 'flashcards' : 'questions'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Topic focus (30 chars max):
                    </label>
                    <input
                      type="text"
                      value={sectionFocus}
                      onChange={(e) => setSectionFocus(e.target.value.slice(0, 30))}
                      placeholder="e.g., derivatives, limits, chain rule..."
                      className="w-full p-2 border rounded-lg"
                      maxLength={30}
                    />
                    <div className="text-right text-xs text-gray-500 mt-1">
                      {sectionFocus.length}/30
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowGenerationOptions(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={!sectionFocus.trim()}
                    className="flex-1 px-4 py-2 bg-[#007bcc] text-white rounded-lg hover:bg-[#005a99] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Generate
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Coming Soon Popup */}
      {showComingSoonPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 pointer-events-none animate-in fade-in duration-200">
          <div className="bg-white rounded-lg p-6 shadow-2xl max-w-sm mx-4 border border-[#e5e5e5] pointer-events-auto transform animate-in slide-in-from-top-4 duration-300 ease-out">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#007bcc]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Rocket className="w-6 h-6 text-[#007bcc]" />
              </div>
              <h3 className="text-lg font-semibold text-[#222222] mb-2 font-[family-name:var(--font-heading)]">
                Coming Soon!
              </h3>
              <p className="text-[#222222] text-sm">
                This feature is under development and will be available soon.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}