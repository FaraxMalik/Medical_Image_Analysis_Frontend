'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react'

interface PredictionResult {
  success: boolean
  prediction: string
  confidence: number
  all_scores: Record<string, number>
  metadata?: {
    model: string
    device: string
  }
}

export default function ResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    // Retrieve result from sessionStorage
    const storedResult = sessionStorage.getItem('ct-scan-result')
    const storedImage = sessionStorage.getItem('ct-scan-image')

    if (!storedResult || !storedImage) {
      router.push('/ct-scan')
      return
    }

    setResult(JSON.parse(storedResult))
    setImagePreview(storedImage)
  }, [router])

  if (!result || !imagePreview) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-4 text-sm text-slate-600">Loading results...</p>
        </div>
      </div>
    )
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-amber-600'
    return 'text-red-600'
  }

  const getConfidenceBg = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100'
    if (confidence >= 0.6) return 'bg-amber-100'
    return 'bg-red-100'
  }

  const handleDownloadReport = () => {
    // Simple text report download
    const report = `
CT SCAN ANALYSIS REPORT
Generated: ${new Date().toLocaleString()}

PREDICTION: ${result.prediction}
CONFIDENCE: ${(result.confidence * 100).toFixed(2)}%

DETAILED SCORES:
${Object.entries(result.all_scores)
  .map(([name, score]) => `  ${name}: ${(score * 100).toFixed(2)}%`)
  .join('\n')}

Model: ${result.metadata?.model || 'DenseNet121'}
Device: ${result.metadata?.device || 'CPU'}

DISCLAIMER: This is an AI-assisted analysis tool. 
Always consult qualified medical professionals for diagnosis and treatment.
    `.trim()

    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ct-scan-report-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <div className="text-right">
              <h1 className="text-xl font-bold text-slate-900">Analysis Complete</h1>
              <p className="text-xs text-slate-600">CT Scan Results</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Success Banner */}
          <div className="flex items-center gap-3 rounded-lg bg-green-50 border border-green-200 p-4">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <p className="text-sm font-medium text-green-900">
              Analysis completed successfully
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Image Preview */}
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-lg font-bold text-slate-900">Uploaded Image</h2>
              <img
                src={imagePreview}
                alt="CT Scan"
                className="w-full rounded-lg border border-slate-200"
              />
            </div>

            {/* Prediction Result */}
            <div className="space-y-6">
              <div className="rounded-2xl bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-lg font-bold text-slate-900">🎯 Prediction</h2>
                
                <div className={`rounded-lg ${getConfidenceBg(result.confidence)} p-6`}>
                  <p className="text-sm font-medium text-slate-600">Detected Condition</p>
                  <h3 className="mt-1 text-3xl font-bold text-slate-900">
                    {result.prediction}
                  </h3>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-sm font-medium text-slate-600">Confidence:</span>
                    <span className={`text-2xl font-bold ${getConfidenceColor(result.confidence)}`}>
                      {(result.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Confidence Warning */}
                {result.confidence < 0.7 && (
                  <div className="mt-4 flex items-start gap-3 rounded-lg bg-amber-50 border border-amber-200 p-4">
                    <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">
                      <strong>Low confidence detected.</strong> Additional imaging or 
                      professional consultation is strongly recommended.
                    </p>
                  </div>
                )}
              </div>

              {/* Detailed Breakdown */}
              <div className="rounded-2xl bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-lg font-bold text-slate-900">📊 Detailed Breakdown</h2>
                
                <div className="space-y-3">
                  {Object.entries(result.all_scores)
                    .sort(([, a], [, b]) => b - a)
                    .map(([className, score]) => (
                      <div key={className}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-700">{className}</span>
                          <span className="font-semibold text-slate-900">
                            {(score * 100).toFixed(2)}%
                          </span>
                        </div>
                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full bg-gradient-to-r from-blue-600 to-cyan-600 transition-all"
                            style={{ width: `${score * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
            >
              <Download className="h-4 w-4" />
              Download Report
            </button>
            <Link
              href="/ct-scan"
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 font-semibold text-white hover:from-blue-700 hover:to-cyan-700"
            >
              <RotateCcw className="h-4 w-4" />
              Analyze Another
            </Link>
          </div>

          {/* Disclaimer */}
          <div className="rounded-lg bg-slate-100 p-6">
            <h3 className="font-semibold text-slate-900">⚠️ Important Disclaimer</h3>
            <p className="mt-2 text-sm text-slate-700">
              This AI analysis is for educational and research purposes only. It should not be 
              used as a substitute for professional medical diagnosis, treatment, or advice. 
              Always consult with qualified healthcare providers for proper medical evaluation 
              and care. The accuracy of AI predictions can vary and should be validated by 
              medical professionals.
            </p>
          </div>

          {/* Model Info */}
          {result.metadata && (
            <div className="text-center text-xs text-slate-500">
              Model: {result.metadata.model} | Device: {result.metadata.device}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
