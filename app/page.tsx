import { Navbar } from "@/components/navbar"
import { Search, BookOpen, Users, Brain, Star, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black font-[family-name:var(--font-heading)] mb-6">
            <span className="bg-gradient-to-r from-[#007bcc] via-[#0088dd] to-[#0099ff] bg-clip-text text-transparent">
              Crammr
            </span>
            <span className="text-[#222222]"> - Your Study Companion</span>
          </h1>
          <p className="text-xl text-[#666666] max-w-3xl mx-auto leading-relaxed mb-8">
            Access curated, high-quality study notes specifically for your school and courses. 
            Enhanced with AI-powered learning tools including chat assistance, flashcard generation, 
            and personalized quizzes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/notes/mac2311e"
              className="px-8 py-4 bg-[#007bcc] text-white rounded-lg hover:bg-[#005a99] transition-all duration-300 hover:scale-105 hover:shadow-lg font-semibold"
            >
              Try Demo - MAC2311E
            </Link>
            <Link 
              href="/admin"
              className="px-8 py-4 bg-[#e1b839] text-[#222222] rounded-lg hover:bg-[#d4a832] transition-all duration-300 hover:scale-105 hover:shadow-lg font-semibold"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-8 border border-[#e5e5e5] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-[#007bcc]/10 rounded-lg flex items-center justify-center mb-6">
              <BookOpen className="w-8 h-8 text-[#007bcc]" />
            </div>
            <h3 className="text-xl font-bold text-[#222222] mb-4 font-[family-name:var(--font-heading)]">
              Curated Note Collection
            </h3>
            <p className="text-[#666666] leading-relaxed">
              Access high-quality study notes specifically curated for your school and course. 
              All materials are reviewed and approved by academic experts to ensure accuracy and relevance.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 border border-[#e5e5e5] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-[#007982]/10 rounded-lg flex items-center justify-center mb-6">
              <Brain className="w-8 h-8 text-[#007982]" />
            </div>
            <h3 className="text-xl font-bold text-[#222222] mb-4 font-[family-name:var(--font-heading)]">
              AI-Powered Learning Tools
            </h3>
            <p className="text-[#666666] leading-relaxed">
              Enhance your study experience with AI-generated flashcards, personalized quizzes, 
              and intelligent chat assistance that can answer questions about your course material.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 border border-[#e5e5e5] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-[#e1b839]/10 rounded-lg flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-[#e1b839]" />
            </div>
            <h3 className="text-xl font-bold text-[#222222] mb-4 font-[family-name:var(--font-heading)]">
              Community-Driven Quality
            </h3>
            <p className="text-[#666666] leading-relaxed">
              Submit your own notes for review and approval. Our AI-powered comparison system 
              ensures only the highest quality materials make it to the platform.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#222222] mb-8 font-[family-name:var(--font-heading)]">
            How Crammr Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#007bcc] text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                1
              </div>
              <h4 className="font-semibold text-[#222222] mb-2">Browse Notes</h4>
              <p className="text-sm text-[#666666]">Find notes for your specific course and school</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#007982] text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                2
              </div>
              <h4 className="font-semibold text-[#222222] mb-2">Study with AI</h4>
              <p className="text-sm text-[#666666]">Use AI chat, flashcards, and quizzes to learn</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#e1b839] text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                3
              </div>
              <h4 className="font-semibold text-[#222222] mb-2">Submit Notes</h4>
              <p className="text-sm text-[#666666]">Share your own high-quality notes</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                4
              </div>
              <h4 className="font-semibold text-[#222222] mb-2">Ace Your Exams</h4>
              <p className="text-sm text-[#666666]">Achieve better grades with quality materials</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-[#007bcc] to-[#0099ff] rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4 font-[family-name:var(--font-heading)]">
            Ready to Transform Your Study Experience?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already studying smarter with Crammr's 
            curated notes and AI-powered learning tools.
          </p>
          <Link 
            href="/notes/mac2311e"
            className="inline-flex items-center px-8 py-4 bg-white text-[#007bcc] rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-lg font-semibold"
          >
            <Zap className="w-5 h-5 mr-2" />
            Start Learning Now
          </Link>
        </div>
      </div>
    </div>
  )
}