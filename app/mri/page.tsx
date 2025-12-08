'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useDropzone } from 'react-dropzone'
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react'

export default function MRIPage() {
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
      const apiUrl = process.env.NEXT_PUBLIC_MRI_API || 'http://localhost:7860'
      console.log('🔧 MRI API URL:', apiUrl)
      
      // Convert file to base64 data URL (Gradio accepts base64 in url field)
      const reader = new FileReader()
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.readAsDataURL(file)
      })
      const base64Image = await base64Promise
      console.log('📸 Base64 image length:', base64Image.length)

      const requestBody = {
        data: [{
          path: null,
          url: base64Image,  // Base64 data URL
          size: file.size,
          orig_name: file.name,
          mime_type: file.type,
          is_stream: false,
          meta: { _type: "gradio.FileData" }
        }]
      }
      console.log('📤 Request body:', JSON.stringify(requestBody).substring(0, 500) + '...')

      // Gradio v6 API endpoint - send ImageData format
      const response = await fetch(`${apiUrl}/gradio_api/call/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      console.log('📥 Call response status:', response.status)
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Error response:', errorText)
        throw new Error('Analysis failed. Please try again.')
      }

      const eventData = await response.json()
      console.log('🎫 Event data:', eventData)
      const eventId = eventData.event_id
      
      // Get results from SSE streaming endpoint
      console.log('🌊 Starting SSE stream for event:', eventId)
      const resultResponse = await fetch(`${apiUrl}/gradio_api/call/predict/${eventId}`)
      
      console.log('📥 Stream response status:', resultResponse.status)
      if (!resultResponse.ok) {
        const errorText = await resultResponse.text()
        console.error('❌ Stream error:', errorText)
        throw new Error('Failed to get prediction results')
      }
      
      const reader2 = resultResponse.body?.getReader()
      const decoder = new TextDecoder()
      
      let gradioResult = null
      let buffer = ''
      let lineCount = 0
      
      while (true) {
        const { done, value } = await reader2!.read()
        
        if (done) {
          console.log('✅ Stream ended')
          break
        }
        
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''  // Keep incomplete line in buffer
        
        for (const line of lines) {
          lineCount++
          console.log(`📨 Line ${lineCount}:`, line.substring(0, 200))
          
          if (line.startsWith('data:')) {
            try {
              const jsonStr = line.slice(5).trim()  // Remove 'data:' and trim
              if (!jsonStr) continue
              
              const data = JSON.parse(jsonStr)
              console.log('📊 Parsed SSE data:', JSON.stringify(data, null, 2))
              
              // Handle different response formats from Gradio
              if (typeof data === 'string') {
                // Direct string response
                console.log('✅ Found result as direct string')
                gradioResult = data
                break
              } else if (Array.isArray(data) && data.length > 0) {
                // Array with string at index 0
                console.log('✅ Found result in array format')
                gradioResult = data[0]
                break
              } else if (data.msg === 'process_completed' && data.output?.data) {
                console.log('✅ Found result in process_completed')
                gradioResult = data.output.data[0]
                break
              } else if (data.msg === 'process_generating' && data.output?.data) {
                console.log('⚡ Found result in process_generating')
                gradioResult = data.output.data[0]
              }
            } catch (e) {
              console.error('❌ Failed to parse SSE data:', e, 'Line:', line)
            }
          }
        }
        
        if (gradioResult) break
      }

      console.log('🎯 Final gradioResult:', gradioResult)
      
      if (!gradioResult) {
        console.error('❌ No result received - gradioResult is null')
        throw new Error('No result received from analysis')
      }
      
      // Transform Gradio response - expecting textual result
      console.log('🔄 Transforming result...')
      const result = {
        success: true,
        analysis: typeof gradioResult === 'string' ? gradioResult : JSON.stringify(gradioResult),
        timestamp: new Date().toISOString(),
        metadata: {
          model: 'MRI Analysis Model',
          device: 'GPU'
        }
      }
      console.log('✅ Final result:', result)
      
      // Store result and navigate to results page
      sessionStorage.setItem('mri-result', JSON.stringify(result))
      sessionStorage.setItem('mri-image', preview!)
      
      console.log('🚀 Navigating to results page...')
      router.push('/mri/results')

    } catch (err) {
      console.error('💥 Error in handleAnalyze:', err)
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
              <h1 className="text-xl font-bold text-slate-900">MRI Analysis</h1>
              <p className="text-xs text-slate-600">Lung Cancer Segmentation</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          {/* Info Banner */}
          <div className="mb-8 rounded-lg bg-purple-50 border border-purple-200 p-4">
            <h2 className="font-semibold text-purple-900">🧠 MRI Analysis</h2>
            <p className="mt-1 text-sm text-purple-700">
              Upload a lung MRI image for AI-powered analysis. Our model provides detailed 
              textual analysis and segmentation insights.
            </p>
          </div>

          {/* Upload Area */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            {!preview ? (
              <div
                {...getRootProps()}
                className={`cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
                  isDragActive
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-slate-300 hover:border-purple-400 hover:bg-slate-50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  {isDragActive ? 'Drop your MRI scan here' : 'Upload MRI Image'}
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
                    alt="MRI Preview"
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
                    className="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 font-semibold text-white hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
