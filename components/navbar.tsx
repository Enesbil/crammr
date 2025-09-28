"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Rocket } from "lucide-react"

interface NavbarProps {
  isAdmin?: boolean
}

export function Navbar({ isAdmin = false }: NavbarProps) {
  const pathname = usePathname()
  const [showConfirmPopup, setShowConfirmPopup] = useState(false)
  const [showLoadingPopup, setShowLoadingPopup] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [showComingSoonPopup, setShowComingSoonPopup] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [courseCode, setCourseCode] = useState("")

  const handleSubmitNotes = () => {
    // Get course code from URL (e.g., /notes/mac2311 -> MAC2311)
    const match = pathname.match(/\/notes\/([^\/]+)/)
    const detectedCourse = match ? match[1].toUpperCase() : "this course"
    setCourseCode(detectedCourse)

    // Create file input
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/pdf'
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (file && file.type === 'application/pdf') {
        setSelectedFile(file)
        setShowConfirmPopup(true)
      } else {
        alert('Please select a valid PDF file.')
      }
    }
    input.click()
  }

  const handleConfirmSubmission = () => {
    setShowConfirmPopup(false)
    setShowLoadingPopup(true)
    
    // Show loading for 1.2 seconds, then success
    setTimeout(() => {
      setShowLoadingPopup(false)
      setShowSuccessPopup(true)
      
      // Hide success popup after 3 seconds
      setTimeout(() => {
        setShowSuccessPopup(false)
        setSelectedFile(null)
      }, 3000)
    }, 1200)
  }

  const handleCancelSubmission = () => {
    setShowConfirmPopup(false)
    setShowLoadingPopup(false)
    setSelectedFile(null)
  }

  const handleComingSoon = () => {
    setShowComingSoonPopup(true)
    setTimeout(() => setShowComingSoonPopup(false), 2500)
  }

  return (
    <>
      <nav className="bg-white border-b border-gray-200 px-4 py-4">
        <div className=" mx-auto flex items-center justify-between">
          <Link 
            href={isAdmin ? "/admin" : "/"} 
            className="text-2xl font-black font-[family-name:var(--font-heading)] pl-2"
          >
            {isAdmin ? (
              <>
                <span className="bg-gradient-to-r from-[#007bcc] via-[#0088dd] to-[#0099ff] bg-clip-text text-transparent tracking-tight">crammr </span>
                <span className="bg-gradient-to-r from-[#e1b839] to-[#edc649] bg-clip-text text-transparent">rep</span>
              </>
            ) : (
              <span className="bg-gradient-to-r from-[#007bcc] via-[#0088dd] to-[#0099ff] bg-clip-text text-transparent tracking-tight">crammr</span>
            )}
          </Link>

          <div className="flex items-center space-x-8 pr-4">
            {isAdmin ? (
              <>
                <button 
                  onClick={handleComingSoon}
                  className="text-[#222222] hover:text-[#007bcc] transition-colors cursor-pointer"
                >
                  UF Team
                </button>
                <Link href="/admin" className="text-[#222222] hover:text-[#007bcc] transition-colors">
                  Submissions Dashboard
                </Link>
              </>
            ) : (
              <>
                <button 
                  onClick={handleComingSoon}
                  className="text-[#222222] hover:text-[#007bcc] transition-colors cursor-pointer"
                >
                  Our Contributors
                </button>
                <button 
                  onClick={handleComingSoon}
                  className="text-[#222222] hover:text-[#007bcc] transition-colors cursor-pointer"
                >
                  Donate
                </button>
                <button 
                  onClick={handleSubmitNotes}
                  className="text-[#222222] hover:text-[#007bcc] transition-colors cursor-pointer"
                >
                  Submit your notes
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Confirmation Popup */}
      {showConfirmPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 pointer-events-none animate-in fade-in duration-200">
          <div className="bg-white rounded-lg p-8 shadow-2xl max-w-md mx-4 border border-[#e5e5e5] pointer-events-auto transform animate-in slide-in-from-top-4 duration-300 ease-out">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#007bcc]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-[#007bcc] text-2xl">📄</div>
              </div>
              <h3 className="text-xl font-semibold text-[#222222] mb-3 font-[family-name:var(--font-heading)]">
                Confirm Submission
              </h3>
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-500 mb-1">Selected file:</p>
                <p className="text-sm font-medium text-[#222222] truncate">{selectedFile?.name}</p>
              </div>
              <p className="text-[#222222] mb-6 leading-relaxed">
                Are you sure you would like to submit your notes for <span className="font-semibold text-[#007bcc]">{courseCode}</span>?
              </p>
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={handleCancelSubmission}
                  className="px-6 py-2.5 bg-gray-100 text-[#222222] rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium border border-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSubmission}
                  className="px-6 py-2.5 bg-[#007bcc] text-white rounded-lg hover:bg-[#005a99] transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:scale-105"
                >
                  Submit Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Popup */}
      {showLoadingPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 pointer-events-none animate-in fade-in duration-200">
          <div className="bg-white rounded-lg p-8 shadow-2xl max-w-sm mx-4 border border-[#e5e5e5] pointer-events-auto transform animate-in slide-in-from-bottom-4 duration-300 ease-out">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#007bcc]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 border-3 border-[#007bcc] border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-lg font-semibold text-[#222222] mb-2 font-[family-name:var(--font-heading)]">
                Submitting...
              </h3>
              <p className="text-[#222222] text-sm">
                Processing your notes
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 pointer-events-none animate-in fade-in duration-200">
          <div className="bg-white rounded-lg p-8 shadow-2xl max-w-sm mx-4 border border-[#e5e5e5] pointer-events-auto transform animate-in slide-in-from-bottom-4 duration-400 ease-out">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-600 delay-100">
                <div className="text-green-600 text-3xl animate-in zoom-in duration-300 delay-300">✓</div>
              </div>
              <h3 className="text-xl font-semibold text-[#222222] mb-3 font-[family-name:var(--font-heading)]">
                Submitted Successfully!
              </h3>
              <p className="text-[#222222] leading-relaxed">
                Your notes have been submitted and will be reviewed by our team.
              </p>
              <div className="mt-4 text-xs text-gray-500">
                This popup will close automatically
              </div>
            </div>
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
    </>
  )
}