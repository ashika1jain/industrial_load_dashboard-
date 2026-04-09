'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Zap, Loader2 } from 'lucide-react'

interface DemandControlPanelProps {
  onRunPrediction: (contractDemand: number) => void
  isLoading: boolean
}

export function DemandControlPanel({ onRunPrediction, isLoading }: DemandControlPanelProps) {
  const [demand, setDemand] = useState('500')

  const handleRun = () => {
    const value = parseFloat(demand)
    if (!value || value <= 0) {
      alert('Please enter a valid contract demand value')
      return
    }
    onRunPrediction(value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract Demand Control</CardTitle>
        <CardDescription>Set your contract limit and run predictions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="demand" className="text-sm font-medium text-foreground">
            Contract Demand (kW)
          </Label>
          <div className="relative flex-1">
            <Input
              id="demand"
              type="number"
              value={demand}
              onChange={(e) => setDemand(e.target.value)}
              className="pr-8"
              placeholder="Enter contract demand"
            />
            <Zap className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">Your maximum allowed load capacity</p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Quick Actions:</p>
          <Button
            onClick={handleRun}
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Prediction...
              </>
            ) : (
              'Run Prediction'
            )}
          </Button>
        </div>

        <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
          <p className="text-xs text-blue-900">
            💡 <span className="font-semibold">Tip:</span> Upload at least 1 week (168 rows) of hourly data for accurate predictions.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}