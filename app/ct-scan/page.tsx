'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useDropzone } from 'react-dropzone'
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react'

export default function CTScanPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0]
    
    if (!uploadedFile) return

    // Validate file type
    if (!uploadedFile.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPEG, PNG)')
      return
    }

    // Validate file size (max 16MB)
    if (uploadedFile.size > 16 * 1024 * 1024) {
      setError('File size must be less than 16MB')
      return
    }

    setFile(uploadedFile)
    setError(null)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(uploadedFile)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.dicom']
    },
    maxFiles: 1,
  })

  const handleAnalyze = async () => {
    if (!file) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_CT_SCAN_API || 'http://localhost:7860'
      
      // Convert file to base64 data URL (Gradio accepts base64)
      const reader = new FileReader()
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.readAsDataURL(file)
      })
      const base64Image = await base64Promise

      // Gradio API endpoint: /run/{api_name}
      const response = await fetch(`${apiUrl}/run/predict_image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [base64Image]
        }),
      })

      if (!response.ok) {
        throw new Error('Analysis failed. Please try again.')
      }

      const eventData = await response.json()
      const eventId = eventData.event_id
      
      // Get results from streaming endpoint
      const resultResponse = await fetch(`${apiUrl}/api/predict/${eventId}`)
      const reader2 = resultResponse.body?.getReader()
      const decoder = new TextDecoder()
      
      let gradioResult = null
      while (true) {
        const { done, value } = await reader2!.read()
        if (done) break
        
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(line => line.trim())
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6))
            if (data.msg === 'process_completed') {
              gradioResult = data.output.data
              break
            }
          }
        }
        if (gradioResult) break
      }
      
      // Transform Gradio response
      const data = gradioResult[0]
      
      const result = {
        prediction: data.label,
        confidence: data.confidences.find((c: any) => c.label === data.label)?.confidence || 0,
        all_predictions: data.confidences.reduce((acc: any, curr: any) => {
          acc[curr.label] = curr.confidence
          return acc
        }, {})
      }
      
      // Store result and navigate to results page
      sessionStorage.setItem('ct-scan-result', JSON.stringify(result))
      sessionStorage.setItem('ct-scan-image', preview!)
      
      router.push('/ct-scan/results')

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleRemove = () => {
    setFile(null)
    setPreview(null)
    setError(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
              <h1 className="text-xl font-bold text-slate-900">CT Scan Analysis</h1>
              <p className="text-xs text-slate-600">Lung Cancer Detection</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          {/* Info Banner */}
          <div className="mb-8 rounded-lg bg-blue-50 border border-blue-200 p-4">
            <h2 className="font-semibold text-blue-900">🫁 Lung Cancer Detection</h2>
            <p className="mt-1 text-sm text-blue-700">
              Upload a chest CT scan image for AI-powered analysis. Our model can detect:
              Adenocarcinoma, Squamous Cell Carcinoma, Large Cell Carcinoma, and Normal tissue.
            </p>
          </div>

          {/* Upload Area */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            {!preview ? (
              <div
                {...getRootProps()}
                className={`cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  {isDragActive ? 'Drop your CT scan here' : 'Upload CT Scan Image'}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Drag and drop or click to browse
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Supports: JPEG, PNG, DICOM (Max 16MB)
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Preview */}
                <div className="relative">
                  <img
                    src={preview}
                    alt="CT Scan Preview"
                    className="mx-auto max-h-96 rounded-lg"
                  />
                  <button
                    onClick={handleRemove}
                    className="absolute top-2 right-2 rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* File Info */}
                <div className="rounded-lg bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{file?.name}</p>
                      <p className="text-xs text-slate-600">
                        {(file!.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleRemove}
                    className="flex-1 rounded-lg border border-slate-300 px-4 py-3 font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Remove
                  </button>
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3 font-semibold text-white hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analyzing...
                      </span>
                    ) : (
                      'Analyze Image'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className="mt-6 rounded-lg bg-amber-50 border border-amber-200 p-4">
            <p className="text-xs text-amber-800">
              ⚠️ <strong>Disclaimer:</strong> This AI tool is for educational and research purposes.
              Results should not be used as a substitute for professional medical diagnosis.
              Always consult qualified healthcare providers for medical decisions.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
