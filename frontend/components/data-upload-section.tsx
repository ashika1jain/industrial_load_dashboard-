'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UploadCloud, CheckCircle, XCircle } from 'lucide-react'

interface DataUploadSectionProps {
  onFileSelect: (file: File) => void
  uploadStatus: 'idle' | 'success' | 'error'
}

export function DataUploadSection({ onFileSelect, uploadStatus }: DataUploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      alert('Only CSV files are allowed')
      return
    }
    setFileName(file.name)
    onFileSelect(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Factory Data Upload</CardTitle>
        <CardDescription>Upload historical load data for predictions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            isDragging
              ? 'border-primary bg-blue-50'
              : 'border-border bg-muted/30 hover:border-primary/50'
          }`}
        >
          <UploadCloud className="mx-auto h-8 w-8 text-primary mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">Drag and drop your file here</p>
          <p className="text-xs text-muted-foreground mb-4">or</p>
          <label htmlFor="csv-upload">
            <Button variant="outline" size="sm" asChild>
              <span className="cursor-pointer">Upload CSV File</span>
            </Button>
          </label>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleInputChange}
          />
          <p className="text-xs text-muted-foreground mt-3">Supported: .csv</p>
        </div>

        {/* File Status */}
        {fileName && (
          <div className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
            uploadStatus === 'error' 
              ? 'bg-red-50 text-red-700 border border-red-200' 
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {uploadStatus === 'error' 
              ? <XCircle className="h-4 w-4" /> 
              : <CheckCircle className="h-4 w-4" />}
            <span>{fileName}</span>
          </div>
        )}

        {/* Format Example */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Required Data Format:</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-border rounded-md">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-2 font-semibold text-foreground">datetime</th>
                  <th className="px-3 py-2 font-semibold text-foreground">load_kw</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="px-3 py-2 text-muted-foreground">2024-01-01 10:00:00</td>
                  <td className="px-3 py-2 text-muted-foreground">420</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-3 py-2 text-muted-foreground">2024-01-01 11:00:00</td>
                  <td className="px-3 py-2 text-muted-foreground">450</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground italic">
            Minimum 168 rows (1 week) of hourly data required.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}