'use client'

import Link from 'next/link'
import { Activity, Brain, Bone, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react'

const modalities = [
  {
    id: 'ct-scan',
    title: 'CT Scan Analysis',
    subtitle: 'Lung Cancer Detection',
    description: 'AI-powered analysis of chest CT scans for early cancer detection using advanced deep learning',
    icon: Activity,
    gradient: 'from-blue-600 via-blue-500 to-cyan-500',
    hoverGradient: 'hover:from-blue-700 hover:via-blue-600 hover:to-cyan-600',
    status: 'active',
    href: '/ct-scan',
    badge: 'Active',
    badgeColor: 'bg-green-500',
  },
  {
    id: 'mri',
    title: 'MRI Analysis',
    subtitle: 'Brain Imaging',
    description: 'Advanced MRI scan analysis for neurological conditions and abnormality detection',
    icon: Brain,
    gradient: 'from-purple-600 via-purple-500 to-pink-500',
    hoverGradient: 'hover:from-purple-700 hover:via-purple-600 hover:to-pink-600',
    status: 'coming-soon',
    href: '#',
    badge: 'Coming Soon',
    badgeColor: 'bg-amber-500',
  },
  {
    id: 'xray',
    title: 'X-Ray Analysis',
    subtitle: 'Bone & Fracture Detection',
    description: 'Automated X-ray analysis for fracture and bone abnormality detection with high precision',
    icon: Bone,
    gradient: 'from-amber-600 via-orange-500 to-red-500',
    hoverGradient: 'hover:from-amber-700 hover:via-orange-600 hover:to-red-600',
    status: 'coming-soon',
    href: '#',
    badge: 'Coming Soon',
    badgeColor: 'bg-amber-500',
  },
]

const features = [
  {
    icon: Zap,
    title: 'Fast Analysis',
    description: 'Get results in seconds with our optimized AI models trained on thousands of medical images',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Sparkles,
    title: 'High Accuracy',
    description: 'State-of-the-art deep learning models achieving professional-grade diagnostic accuracy',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your medical data is processed securely and never stored on our servers',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  Medical Imaging AI
                </h1>
                <p className="hidden text-xs text-slate-600 sm:block">Advanced Diagnostic Platform</p>
              </div>
            </div>
            <button className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900">
              About
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            <Sparkles className="h-4 w-4" />
            <span>Powered by Advanced AI Technology</span>
          </div>
          <h2 className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl">
            AI-Powered Medical
            <br />
            Diagnostic Platform
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-600 sm:text-lg">
            Analyze medical scans with state-of-the-art deep learning models.
            Fast, accurate, and accessible diagnostic assistance for healthcare professionals.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/ct-scan"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 sm:w-auto"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <button className="group flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-8 py-4 font-semibold text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50 sm:w-auto">
              <span>View Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* Modality Cards */}
      <section className="container mx-auto px-4 pb-20">
        <div className="mb-12 text-center">
          <h3 className="text-3xl font-bold text-slate-900">Choose Your Analysis Type</h3>
          <p className="mt-2 text-slate-600">Select the imaging modality you want to analyze</p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {modalities.map((modality) => {
            const Icon = modality.icon
            const isActive = modality.status === 'active'

            return (
              <div
                key={modality.id}
                className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 ${
                  isActive
                    ? 'hover:shadow-2xl hover:-translate-y-2'
                    : 'opacity-75 hover:opacity-90'
                }`}
              >
                {/* Gradient Header with Icon */}
                <div
                  className={`relative h-48 bg-gradient-to-br ${modality.gradient} p-6 transition-all duration-300 ${
                    isActive ? modality.hoverGradient : ''
                  }`}
                >
                  <div className="flex h-full flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
                        <Icon className="h-8 w-8 text-white" strokeWidth={1.5} />
                      </div>
                      <span
                        className={`${modality.badgeColor} rounded-full px-3 py-1 text-xs font-semibold text-white shadow-lg`}
                      >
                        {modality.badge}
                      </span>
                    </div>
                    <div className="text-white">
                      <h3 className="text-2xl font-bold">{modality.title}</h3>
                      <p className="mt-1 text-sm font-medium text-white/90">
                        {modality.subtitle}
                      </p>
                    </div>
                  </div>
                  
                  {/* Decorative gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-sm leading-relaxed text-slate-600">
                    {modality.description}
                  </p>

                  {isActive ? (
                    <Link
                      href={modality.href}
                      className={`group/btn mt-6 flex items-center justify-between rounded-xl bg-gradient-to-r ${modality.gradient} px-5 py-3 font-semibold text-white shadow-md transition-all hover:shadow-lg ${modality.hoverGradient}`}
                    >
                      <span>Start Analysis</span>
                      <ArrowRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-5 py-3 font-semibold text-slate-400 cursor-not-allowed"
                    >
                      <span>Notify Me</span>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-slate-200 bg-white py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h3 className="text-3xl font-bold text-slate-900">Why Choose Our Platform?</h3>
            <p className="mt-2 text-slate-600">Built for healthcare professionals who demand excellence</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:border-slate-300 hover:shadow-xl"
                >
                  <div className="relative z-10">
                    <div className={`inline-flex rounded-xl ${feature.bgColor} p-3`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-slate-900">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {feature.description}
                    </p>
                  </div>
                  
                  {/* Decorative gradient */}
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 opacity-0 blur-3xl transition-opacity group-hover:opacity-30"></div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 text-center sm:grid-cols-3">
            <div>
              <div className="text-4xl font-bold text-blue-600">89%+</div>
              <div className="mt-2 text-sm font-medium text-slate-600">Prediction Accuracy</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600">10s</div>
              <div className="mt-2 text-sm font-medium text-slate-600">Average Analysis Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600">100%</div>
              <div className="mt-2 text-sm font-medium text-slate-600">Data Privacy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
            <p className="text-center text-sm text-amber-900">
              <span className="font-semibold">⚠️ Medical Disclaimer:</span> This is an AI assistance tool for educational and research purposes. 
              Always consult qualified medical professionals for diagnosis and treatment decisions.
            </p>
          </div>
          <div className="mt-6 text-center text-sm text-slate-500">
            <p>Medical Imaging AI Platform • FYP Project © 2025</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
