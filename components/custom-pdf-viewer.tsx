"use client"

import { useEffect, useRef } from 'react'

interface CustomPDFViewerProps {
  pdfUrl: string
}

export default function CustomPDFViewer({ pdfUrl }: CustomPDFViewerProps) {
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadPDF = async () => {
      if (!canvasRef.current) return

      // Load PDF.js from CDN
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
      script.async = true
      
      script.onload = async () => {
        try {
          // @ts-ignore
          const pdfjsLib = window.pdfjsLib
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'

          const pdf = await pdfjsLib.getDocument(pdfUrl).promise
          const container = canvasRef.current!
          container.innerHTML = '' // Clear previous content

          // Get container width to calculate appropriate scale
          const containerWidth = container.clientWidth - 32 // Account for padding

          // Render all pages
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum)
            
            // Calculate scale to fit container width
            const viewport = page.getViewport({ scale: 1 })
            const scale = Math.min(containerWidth / viewport.width, 1.3) // Max scale of 1.3
            const scaledViewport = page.getViewport({ scale })

            // Create canvas for this page
            const canvas = document.createElement('canvas')
            const context = canvas.getContext('2d')!
            canvas.height = scaledViewport.height
            canvas.width = scaledViewport.width
            canvas.style.display = 'block'
            canvas.style.margin = '8px auto'
            canvas.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'
            canvas.style.backgroundColor = 'white'
            canvas.style.maxWidth = '100%'

            // Render page
            await page.render({
              canvasContext: context,
              viewport: scaledViewport,
              background: 'white'
            }).promise

            container.appendChild(canvas)
          }
        } catch (error) {
          console.error('Error loading PDF:', error)
          if (canvasRef.current) {
            canvasRef.current.innerHTML = `
              <div class="flex items-center justify-center h-full">
                <div class="text-center">
                  <p class="text-gray-600 mb-4">Failed to load PDF</p>
                  <a href="${pdfUrl}" target="_blank" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Open PDF in new tab
                  </a>
                </div>
              </div>
            `
          }
        }
      }

      document.head.appendChild(script)
    }

    loadPDF()
  }, [pdfUrl])

  return (
    <div className="h-full w-full bg-white overflow-hidden max-w-full">
      <div ref={canvasRef} className="h-full overflow-y-auto p-4 bg-white max-w-full">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-600">Loading PDF...</div>
        </div>
      </div>
    </div>
  )
}