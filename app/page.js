'use client'

import { useState } from 'react'
import HomePage from '@/components/tooliyapa/HomePage'
import MergePdfTool from '@/components/tooliyapa/MergePdfTool'
import CompressPdfTool from '@/components/tooliyapa/CompressPdfTool'
import SplitPdfTool from '@/components/tooliyapa/SplitPdfTool'
import RotatePdfTool from '@/components/tooliyapa/RotatePdfTool'
import OrganizePdfTool from '@/components/tooliyapa/OrganizePdfTool'
import JpgToPdfTool from '@/components/tooliyapa/JpgToPdfTool'
import PdfToJpgTool from '@/components/tooliyapa/PdfToJpgTool'
import PageNumbersTool from '@/components/tooliyapa/PageNumbersTool'
import WatermarkTool from '@/components/tooliyapa/WatermarkTool'
import UnlockPdfTool from '@/components/tooliyapa/UnlockPdfTool'
import Header from '@/components/tooliyapa/Header'
import Footer from '@/components/tooliyapa/Footer'

const App = () => {
  const [view, setView] = useState('home')
  const back = () => setView('home')

  const tools = {
    merge: <MergePdfTool onBack={back} />,
    compress: <CompressPdfTool onBack={back} />,
    split: <SplitPdfTool onBack={back} />,
    rotate: <RotatePdfTool onBack={back} />,
    organize: <OrganizePdfTool onBack={back} />,
    jpg2pdf: <JpgToPdfTool onBack={back} />,
    pdf2jpg: <PdfToJpgTool onBack={back} />,
    pagenum: <PageNumbersTool onBack={back} />,
    watermark: <WatermarkTool onBack={back} />,
    unlock: <UnlockPdfTool onBack={back} />,
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-rose-50/40 to-white">
      <Header onLogoClick={back} onSelectTool={setView} currentView={view} />
      <main className="flex-1">
        {view === 'home' ? <HomePage onSelectTool={setView} /> : tools[view] || <HomePage onSelectTool={setView} />}
      </main>
      <Footer />
    </div>
  )
}

export default App
