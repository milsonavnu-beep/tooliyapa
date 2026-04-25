'use client'

import { useState } from 'react'
import HomePage from '@/components/tooliyapa/HomePage'
import MergePdfTool from '@/components/tooliyapa/MergePdfTool'
import CompressPdfTool from '@/components/tooliyapa/CompressPdfTool'
import Header from '@/components/tooliyapa/Header'
import Footer from '@/components/tooliyapa/Footer'

export default function App() {
  const [view, setView] = useState('home') // 'home' | 'merge' | 'compress'

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-rose-50/40 to-white">
      <Header onLogoClick={() => setView('home')} onSelectTool={setView} currentView={view} />
      <main className="flex-1">
        {view === 'home' && <HomePage onSelectTool={setView} />}
        {view === 'merge' && <MergePdfTool onBack={() => setView('home')} />}
        {view === 'compress' && <CompressPdfTool onBack={() => setView('home')} />}
      </main>
      <Footer />
    </div>
  )
}
