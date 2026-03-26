import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Calendar, Zap } from 'lucide-react'
import { PredictionResponse } from '@/lib/api'

interface PredictionResultsProps {
  data: PredictionResponse | null
}

export function PredictionResults({ data }: PredictionResultsProps) {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Prediction Results</CardTitle>
          <CardDescription>Upload CSV and run prediction to see results</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No predictions yet. Upload your data and click Run Prediction.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Group next_week_prediction into 7 days (24 hours each)
  const dailyAverages = Array.from({ length: 7 }, (_, i) => {
    const slice = data.next_week_prediction.slice(i * 24, (i + 1) * 24)
    const avg = slice.reduce((a, b) => a + b, 0) / slice.length
    return Math.round(avg)
  })

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const maxValue = data.contract_demand

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prediction Results</CardTitle>
        <CardDescription>AI-powered forecast analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Next Day Prediction */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Next Day Prediction</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground mb-1">Expected Load</p>
              <p className="text-2xl font-bold text-foreground">{data.next_day_prediction}</p>
              <p className="text-xs text-muted-foreground mt-1">kW</p>
            </div>
            <div className={`rounded-lg p-3 border ${
              data.status === 'Safe' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <p className={`text-lg font-bold ${
                data.status === 'Safe' ? 'text-green-700' : 'text-red-700'
              }`}>
                {data.status}
              </p>
              <p className={`text-xs mt-1 ${
                data.status === 'Safe' ? 'text-green-600' : 'text-red-600'
              }`}>
                {data.status === 'Safe' ? 'Within limits' : 'Exceeds limit!'}
              </p>
            </div>
          </div>
        </div>

        {/* Next Week Trend */}
        <div className="space-y-3 border-t border-border pt-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Next Week Trend</h3>
          </div>
          <div className="rounded-lg bg-muted/30 p-4">
            <div className="space-y-2">
              {days.map((day, idx) => {
                const value = dailyAverages[idx]
                const percentage = Math.min((value / maxValue) * 100, 100)
                const isRisk = value > maxValue
                return (
                  <div key={day} className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground w-8">{day}</span>
                    <div className="flex-1 h-6 bg-muted rounded-sm overflow-hidden">
                      <div
                        className={`h-full rounded-sm transition-all ${
                          isRisk 
                            ? 'bg-gradient-to-r from-red-400 to-red-500' 
                            : 'bg-gradient-to-r from-chart-1 to-chart-2'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className={`text-xs font-semibold w-16 text-right ${
                      isRisk ? 'text-red-600' : 'text-foreground'
                    }`}>
                      {value} kW
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Contract Analysis */}
        <div className="space-y-3 border-t border-border pt-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Contract Analysis</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground mb-1">Contract Demand</p>
              <p className="text-2xl font-bold text-foreground">{data.contract_demand}</p>
              <p className="text-xs text-muted-foreground mt-1">kW</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-3 border border-blue-200">
              <p className="text-xs text-muted-foreground mb-1">Margin</p>
              <p className="text-lg font-bold text-blue-700">
                {Math.round(((data.contract_demand - data.next_day_prediction) / data.contract_demand) * 100)}%
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {data.status === 'Safe' ? 'Available' : 'Exceeded'}
              </p>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
