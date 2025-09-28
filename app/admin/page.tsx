"use client"

import { useState } from "react"
import { Upload, Eye, CheckCircle, XCircle, FileText, Users, BookOpen, Sparkles } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { GoogleGenAI } from '@google/genai'

interface NotesSubmission {
  id: number
  className: string
  classCode: string
  studentName: string
  studentEmail: string
  dateSubmitted: string
  fileName: string
  status: 'pending' | 'approved' | 'rejected'
  fileUrl?: string
}

interface ComparisonData {
  submittedNotes: {
    syllabusCoverage: number
    organization: number
    examEffectiveness: number
    overallScore: number
    strengths: string[]
    weaknesses: string[]
  }
  approvedNotes: {
    syllabusCoverage: number
    organization: number
    examEffectiveness: number
    overallScore: number
    strengths: string[]
    weaknesses: string[]
  }
  recommendation: string
  detailedAnalysis: string
  finalScore: number
}

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<NotesSubmission[]>([
    {
      id: 1,
      className: "Calculus I - Derivatives & Applications",
      classCode: "MAC2311E",
      studentName: "Alex Johnson",
      studentEmail: "alex.johnson@student.fiu.edu",
      dateSubmitted: "2024-11-15",
      fileName: "alex_calculus_notes.pdf",
      status: "pending",
      fileUrl: "/Enes1.pdf"
    },
    {
      id: 2,
      className: "Linear Algebra",
      classCode: "MAS3105",
      studentName: "Sarah Chen",
      studentEmail: "sarah.chen@student.fiu.edu", 
      dateSubmitted: "2024-11-14",
      fileName: "sarah_linalg_notes.pdf",
      status: "approved"
    },
    {
      id: 3,
      className: "Organic Chemistry I",
      classCode: "CHM2210",
      studentName: "Michael Rodriguez",
      studentEmail: "m.rodriguez@student.fiu.edu",
      dateSubmitted: "2024-11-13",
      fileName: "michael_ochem_notes.pdf",
      status: "rejected"
    }
  ])

  const [selectedSubmission, setSelectedSubmission] = useState<NotesSubmission | null>(null)
  const [showComparisonModal, setShowComparisonModal] = useState(false)
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null)
  const [isGeneratingComparison, setIsGeneratingComparison] = useState(false)

  const stats = {
    totalSubmissions: submissions.length,
    pendingReview: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length
  }

  const generateComparisonReport = async (submission: NotesSubmission) => {
    setIsGeneratingComparison(true)
    setShowComparisonModal(true)
    setComparisonData(null)

    try {
      console.log('🤖 Starting AI comparison for submission:', submission.fileName)
      
      // Initialize AI with server-side environment variable  
      // Note: In production, this should be handled via API routes to keep the key secure
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' })

      // Fetch PDFs
      console.log('📄 Fetching submitted notes:', submission.fileUrl)
      const submittedPdfResponse = await fetch(submission.fileUrl || '/Enes1.pdf')
      const submittedPdfBuffer = await submittedPdfResponse.arrayBuffer()
      const submittedPdfBase64 = btoa(new Uint8Array(submittedPdfBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''))

      console.log('📄 Fetching approved notes')
      const approvedPdfResponse = await fetch('/NimratNotes.pdf')
      const approvedPdfBuffer = await approvedPdfResponse.arrayBuffer()
      const approvedPdfBase64 = btoa(new Uint8Array(approvedPdfBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''))

      console.log('📄 Fetching syllabus')
      const syllabusResponse = await fetch('/york1.pdf')
      const syllabusBuffer = await syllabusResponse.arrayBuffer()
      const syllabusBase64 = btoa(new Uint8Array(syllabusBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''))

      const prompt = `You are an expert academic evaluator. Compare these educational materials and provide a detailed analysis.

MATERIALS:
1. SUBMITTED NOTES: Student-submitted notes for review
2. APPROVED NOTES: High-quality approved reference notes  
3. SYLLABUS: Official course syllabus and requirements

EVALUATION CRITERIA:
- Syllabus Coverage (0-100): How well notes align with syllabus topics
- Organization (0-100): Structure, clarity, logical flow
- Exam Effectiveness (0-100): Usefulness for exam preparation

WEIGHTED SCORING FORMULA:
Final Score = (Syllabus Coverage × 0.4) + (Organization × 0.2) + (Exam Effectiveness × 0.4)

Return response as JSON only:
{
  "submittedNotes": {
    "syllabusCoverage": number,
    "organization": number, 
    "examEffectiveness": number,
    "overallScore": number,
    "strengths": ["strength1", "strength2"],
    "weaknesses": ["weakness1", "weakness2"]
  },
  "approvedNotes": {
    "syllabusCoverage": number,
    "organization": number,
    "examEffectiveness": number, 
    "overallScore": number,
    "strengths": ["strength1", "strength2"],
    "weaknesses": ["weakness1", "weakness2"]
  },
  "recommendation": "APPROVE/REJECT with brief reason",
  "detailedAnalysis": "Comprehensive comparison analysis",
  "finalScore": number
}`

      console.log('🚀 Sending comparison request to Gemini')

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{
          parts: [
            { inlineData: { data: submittedPdfBase64, mimeType: "application/pdf" } },
            { inlineData: { data: approvedPdfBase64, mimeType: "application/pdf" } },
            { inlineData: { data: syllabusBase64, mimeType: "application/pdf" } },
            { text: prompt }
          ]
        }],
      })

      console.log('✅ Received comparison response')

      let responseText = response.text || ""
      
      // Clean and parse JSON response
      responseText = responseText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim()

      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const comparisonResult = JSON.parse(jsonMatch[0])
        setComparisonData(comparisonResult)
        console.log('✨ Comparison complete:', comparisonResult)
      } else {
        throw new Error('Invalid response format from AI')
      }

    } catch (error) {
      console.error('❌ Error generating comparison:', error)
      
      // Fallback mock data for demo purposes
      setComparisonData({
        submittedNotes: {
          syllabusCoverage: 75,
          organization: 68,
          examEffectiveness: 82,
          overallScore: 76,
          strengths: ["Good coverage of derivatives", "Clear examples"],
          weaknesses: ["Missing integration topics", "Could improve organization"]
        },
        approvedNotes: {
          syllabusCoverage: 95,
          organization: 90,
          examEffectiveness: 88,
          overallScore: 92,
          strengths: ["Comprehensive coverage", "Excellent organization", "Great examples"],
          weaknesses: ["Could add more practice problems"]
        },
        recommendation: "Please configure your Gemini API key in environment variables to use this feature",
        detailedAnalysis: "API key required for detailed AI analysis. The comparison system uses advanced AI to evaluate note quality against syllabus requirements and approved reference materials.",
        finalScore: 76
      })
    } finally {
      setIsGeneratingComparison(false)
    }
  }

  const handleViewSubmission = (submission: NotesSubmission) => {
    setSelectedSubmission(submission)
  }

  const handleApprove = (submissionId: number) => {
    setSubmissions(prev => 
      prev.map(sub => 
        sub.id === submissionId 
          ? { ...sub, status: 'approved' as const }
          : sub
      )
    )
    setShowComparisonModal(false)
  }

  const handleReject = (submissionId: number) => {
    setSubmissions(prev => 
      prev.map(sub => 
        sub.id === submissionId 
          ? { ...sub, status: 'rejected' as const }
          : sub
      )
    )
    setShowComparisonModal(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <FileText className="w-5 h-5 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#222222] mb-2 font-[family-name:var(--font-heading)]">
            Admin Dashboard
          </h1>
          <p className="text-[#666666]">
            Review and manage student note submissions with AI-powered quality analysis
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-[#e5e5e5]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#666666] mb-1">Total Submissions</p>
                <p className="text-2xl font-bold text-[#222222]">{stats.totalSubmissions}</p>
              </div>
              <FileText className="w-8 h-8 text-[#007bcc]" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-[#e5e5e5]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#666666] mb-1">Pending Review</p>
                <p className="text-2xl font-bold text-[#222222]">{stats.pendingReview}</p>
              </div>
              <Upload className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-[#e5e5e5]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#666666] mb-1">Approved</p>
                <p className="text-2xl font-bold text-[#222222]">{stats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-[#e5e5e5]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#666666] mb-1">Rejected</p>
                <p className="text-2xl font-bold text-[#222222]">{stats.rejected}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-lg border border-[#e5e5e5] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e5e5e5]">
            <h2 className="text-xl font-semibold text-[#222222] font-[family-name:var(--font-heading)]">
              Note Submissions
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class & Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-[#222222]">
                              {submission.classCode} - {submission.className}
                            </div>
                            <div className="text-sm text-[#666666]">
                              {submission.studentName} ({submission.studentEmail})
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#222222]">{submission.fileName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#222222]">
                        {new Date(submission.dateSubmitted).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                        {getStatusIcon(submission.status)}
                        <span className="ml-1 capitalize">{submission.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleViewSubmission(submission)}
                        className="text-[#007bcc] hover:text-[#005a99] transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {submission.status === 'pending' && (
                        <button
                          onClick={() => generateComparisonReport(submission)}
                          className="bg-[#007bcc] text-white px-3 py-1.5 rounded-lg hover:bg-[#005a99] transition-colors flex items-center gap-1"
                        >
                          <Sparkles className="w-4 h-4" />
                          AI Review
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      {showComparisonModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-[#222222] font-[family-name:var(--font-heading)]">
                AI-Powered Quality Analysis
              </h2>
              {selectedSubmission && (
                <p className="text-[#666666] mt-1">
                  {selectedSubmission.classCode} - {selectedSubmission.studentName}
                </p>
              )}
            </div>

            <div className="p-6">
              {isGeneratingComparison ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 border-4 border-[#007bcc] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold mb-2">Analyzing with AI...</h3>
                  <p className="text-[#666666]">
                    Comparing submitted notes against approved materials and syllabus requirements
                  </p>
                </div>
              ) : comparisonData ? (
                <div className="space-y-6">
                  {/* Scores Comparison */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-[#222222] mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Submitted Notes
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#666666]">Syllabus Coverage</span>
                          <span className="font-semibold">{comparisonData.submittedNotes.syllabusCoverage}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#666666]">Organization</span>
                          <span className="font-semibold">{comparisonData.submittedNotes.organization}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#666666]">Exam Effectiveness</span>
                          <span className="font-semibold">{comparisonData.submittedNotes.examEffectiveness}%</span>
                        </div>
                        <div className="pt-2 border-t border-blue-200">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Overall Score</span>
                            <span className="text-lg font-bold text-[#007bcc]">
                              {comparisonData.submittedNotes.overallScore}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-[#222222] mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Approved Reference
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#666666]">Syllabus Coverage</span>
                          <span className="font-semibold">{comparisonData.approvedNotes.syllabusCoverage}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#666666]">Organization</span>
                          <span className="font-semibold">{comparisonData.approvedNotes.organization}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#666666]">Exam Effectiveness</span>
                          <span className="font-semibold">{comparisonData.approvedNotes.examEffectiveness}%</span>
                        </div>
                        <div className="pt-2 border-t border-green-200">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Overall Score</span>
                            <span className="text-lg font-bold text-green-600">
                              {comparisonData.approvedNotes.overallScore}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Final Score */}
                  <div className="bg-yellow-50 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold text-[#222222] mb-2">Final Weighted Score</h3>
                    <div className="text-3xl font-bold text-[#e1b839] mb-2">
                      {comparisonData.finalScore}%
                    </div>
                    <p className="text-sm text-[#666666]">
                      Weighted Formula: (Syllabus × 0.4) + (Organization × 0.2) + (Exam Effectiveness × 0.4)
                    </p>
                  </div>

                  {/* Analysis */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-[#222222] mb-4">Detailed Analysis</h3>
                    <p className="text-[#666666] whitespace-pre-wrap">
                      {comparisonData.detailedAnalysis}
                    </p>
                  </div>

                  {/* Recommendation */}
                  <div className="bg-white border-2 border-[#007bcc] rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-[#222222] mb-2">AI Recommendation</h3>
                    <p className="text-[#666666] mb-4">{comparisonData.recommendation}</p>
                    
                    {selectedSubmission?.status === 'pending' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => selectedSubmission && handleReject(selectedSubmission.id)}
                          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Reject Submission
                        </button>
                        <button
                          onClick={() => selectedSubmission && handleApprove(selectedSubmission.id)}
                          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Approve Submission
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-[#666666]">No comparison data available</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowComparisonModal(false)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}