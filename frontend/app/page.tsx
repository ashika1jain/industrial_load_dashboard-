'use client'

import { useState } from 'react'
import { Zap, TrendingUp, Activity, AlertTriangle } from 'lucide-react'
import { TopNav } from '@/components/top-nav'
import { KPICard } from '@/components/kpi-card'
import { DataUploadSection } from '@/components/data-upload-section'
import { DemandControlPanel } from '@/components/demand-control-panel'
import { LoadChart } from '@/components/load-chart'
import { PredictionResults } from '@/components/prediction-results'
import { AlertPanel } from '@/components/alert-panel'
import { ForecastSection } from '@/components/forecast-section'
import { RecentPredictionsTable } from '@/components/recent-predictions-table'
import { runPrediction, PredictionResponse } from '@/lib/api'

export default function Dashboard() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [predictionData, setPredictionData] = useState<PredictionResponse | null>(null)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setUploadStatus('success')
    setErrorMessage(null)
  }

  const handleRunPrediction = async (contractDemand: number) => {
    if (!selectedFile) {
      alert('Please upload a CSV file first')
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const result = await runPrediction(selectedFile, contractDemand)
      setPredictionData(result)
      setUploadStatus('success')
    } catch (error: any) {
      setErrorMessage(error.message || 'Something went wrong')
      setUploadStatus('error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Industrial Load Intelligence Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Monitor factory loads, predict demand peaks, and stay within contract limits
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-700 font-medium">⚠️ Error: {errorMessage}</p>
          </div>
        )}

        {/* KPI Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Current Load"
            value={predictionData ? String(predictionData.next_day_prediction) : '—'}
            unit="kW"
            icon={<Zap className="h-5 w-5" />}
            trend={predictionData ? 'Live' : 'No data'}
          />
          <KPICard
            title="Predicted Load (Next Day)"
            value={predictionData ? String(predictionData.next_day_prediction) : '—'}
            unit="kW"
            icon={<TrendingUp className="h-5 w-5" />}
            trend={predictionData ? predictionData.status : 'No data'}
          />
          <KPICard
            title="Predicted Load (Next Week)"
            value={predictionData
              ? String(Math.round(predictionData.next_week_prediction.reduce((a, b) => a + b, 0) / predictionData.next_week_prediction.length))
              : '—'}
            unit="kW"
            icon={<Activity className="h-5 w-5" />}
            trend={predictionData ? 'Avg' : 'No data'}
          />
          <KPICard
            title="Contract Demand"
            value={predictionData ? String(predictionData.contract_demand) : '—'}
            unit="kW"
            icon={<AlertTriangle className="h-5 w-5" />}
            trend="Limit"
          />
        </div>

        {/* Upload + Demand Control */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <DataUploadSection
            onFileSelect={handleFileSelect}
            uploadStatus={uploadStatus}
          />
          <DemandControlPanel
            onRunPrediction={handleRunPrediction}
            isLoading={isLoading}
          />
        </div>

        {/* Load Chart */}
        <div className="mb-8">
          <LoadChart data={predictionData} />
        </div>

        {/* Prediction Results + Alert */}
        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PredictionResults data={predictionData} />
          </div>
          <div>
            <AlertPanel data={predictionData} />
          </div>
        </div>

        {/* Forecast Section */}
        <div className="mb-8">
          <ForecastSection data={predictionData} />
        </div>

        {/* Recent Predictions Table */}
        <div>
          <RecentPredictionsTable />
        </div>
      </main>
    </div>
  )
}
