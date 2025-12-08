'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, RotateCcw, FileText, Calendar, Cpu } from 'lucide-react'

interface MRIResult {
  success: boolean
  analysis: string
  timestamp: string
  metadata?: {
    model: string
    device: string
  }
}

export default function MRIResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<MRIResult | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    // Retrieve result from sessionStorage
    const storedResult = sessionStorage.getItem('mri-result')
    const storedImage = sessionStorage.getItem('mri-image')

    if (!storedResult || !storedImage) {
      router.push('/mri')
      return
    }

    setResult(JSON.parse(storedResult))
    setImagePreview(storedImage)
  }, [router])

  if (!result || !imagePreview) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
          <p className="mt-4 text-sm text-slate-600">Loading results...</p>
        </div>
      </div>
    )
  }

  const handleDownload = () => {
    const reportContent = `
MRI ANALYSIS REPORT
==================

Analysis Date: ${new Date(result.timestamp).toLocaleString()}
Model: ${result.metadata?.model || 'MRI Analysis Model'}
Processing Device: ${result.metadata?.device || 'N/A'}

ANALYSIS RESULTS:
${result.analysis}

---
Disclaimer: This AI-generated report is for educational and research purposes only.
Results should not be used as a substitute for professional medical diagnosis.
Always consult qualified healthcare providers for medical decisions.
    `.trim()

    const blob = new Blob([reportContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mri-analysis-report-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleNewAnalysis = () => {
    sessionStorage.removeItem('mri-result')
    sessionStorage.removeItem('mri-image')
    router.push('/mri')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <div className="ml-auto">
              <h1 className="text-xl font-bold text-slate-900">MRI Analysis Results</h1>
              <p className="text-xs text-slate-600">AI-Generated Report</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Success Banner */}
          <div className="rounded-lg bg-green-50 border border-green-200 p-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="rounded-full bg-green-100 p-2">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-green-900">Analysis Complete</h3>
                <p className="text-sm text-green-700">
                  Your MRI scan has been successfully analyzed by our AI model.
                </p>
              </div>
            </div>
          </div>

          {/* Main Results Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Image Preview */}
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Uploaded Image</h2>
              <div className="overflow-hidden rounded-lg border border-slate-200">
                <img
                  src={imagePreview}
                  alt="MRI Scan"
                  className="w-full"
                />
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-600">
                <Calendar className="h-4 w-4" />
                Analyzed on {new Date(result.timestamp).toLocaleString()}
              </div>
            </div>

            {/* Analysis Details */}
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Analysis Report</h2>
              
              <div className="space-y-4">
                {/* Model Info */}
                <div className="rounded-lg bg-purple-50 border border-purple-200 p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Cpu className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-purple-900">
                      {result.metadata?.model || 'MRI Analysis Model'}
                    </span>
                    <span className="ml-auto text-purple-700">
                      {result.metadata?.device || 'GPU'}
                    </span>
                  </div>
                </div>

                {/* Analysis Text */}
                <div className="rounded-lg bg-slate-50 p-4">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">Detailed Analysis:</h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed">
                      {result.analysis}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 font-semibold text-white hover:from-blue-700 hover:to-cyan-700"
            >
              <Download className="h-4 w-4" />
              Download Report
            </button>
            <button
              onClick={handleNewAnalysis}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              <RotateCcw className="h-4 w-4" />
              New Analysis
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>

          {/* Disclaimer */}
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
            <p className="text-xs text-amber-800">
              ⚠️ <strong>Important Medical Disclaimer:</strong> This AI-generated analysis is for 
              educational and research purposes only. Results should not be used as a substitute for 
              professional medical diagnosis, treatment, or advice. Always consult qualified healthcare 
              providers for medical decisions and interpretations of medical imaging.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
