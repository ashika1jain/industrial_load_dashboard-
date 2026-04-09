'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts'
import { PredictionResponse } from '@/lib/api'

interface ForecastSectionProps {
  data: PredictionResponse | null
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function ForecastSection({ data }: ForecastSectionProps) {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>7-Day Load Forecast</CardTitle>
          <CardDescription>Run a prediction to see forecast</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No forecast available. Upload data and run prediction.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Group 168 hourly predictions into 7 daily averages
  const dailyAverages = DAY_LABELS.map((day, i) => {
    const slice = data.next_week_prediction.slice(i * 24, (i + 1) * 24)
    const avg = slice.reduce((a, b) => a + b, 0) / slice.length
    return { day, load: Math.round(avg) }
  })

  const nextDayLoad = data.next_day_prediction
  const weekAvg = Math.round(dailyAverages.reduce((a, b) => a + b.load, 0) / 7)
  const peakDay = dailyAverages.reduce((a, b) => a.load > b.load ? a : b)
  const lowDay = dailyAverages.reduce((a, b) => a.load < b.load ? a : b)
  const daysAtRisk = dailyAverages.filter(d => d.load > data.contract_demand).length

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Next Day Forecast */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Next Day Forecast</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Expected Load</span>
                <span className="text-2xl font-bold text-foreground">{nextDayLoad} kW</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${nextDayLoad > data.contract_demand ? 'bg-red-500' : 'bg-gradient-to-r from-chart-1 to-chart-2'}`}
                  style={{ width: `${Math.min((nextDayLoad / data.contract_demand) * 100, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>0 kW</span>
                <span>{data.contract_demand} kW</span>
              </div>
            </div>
            <div className={`rounded-lg p-3 border ${nextDayLoad > data.contract_demand ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
              <p className={`text-xs font-semibold ${nextDayLoad > data.contract_demand ? 'text-red-700' : 'text-green-700'}`}>
                {nextDayLoad > data.contract_demand ? '⚠ Status: Risk' : '✓ Status: Safe'}
              </p>
              <p className={`text-xs mt-1 ${nextDayLoad > data.contract_demand ? 'text-red-600' : 'text-green-600'}`}>
                {nextDayLoad > data.contract_demand
                  ? `Exceeds contract by ${Math.round(nextDayLoad - data.contract_demand)} kW`
                  : `${Math.round(((data.contract_demand - nextDayLoad) / data.contract_demand) * 100)}% below contract limit`}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 7-Day Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">7-Day Trend Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Average Load</span>
                <span className="text-2xl font-bold text-foreground">{weekAvg} kW</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-chart-3 to-chart-2 rounded-full"
                  style={{ width: `${Math.min((weekAvg / data.contract_demand) * 100, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>0 kW</span>
                <span>{data.contract_demand} kW</span>
              </div>
            </div>
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
              <p className="text-xs font-semibold text-blue-700">Weekly Overview</p>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p><span className="font-semibold">Peak Day:</span> {peakDay.day} - {peakDay.load} kW</p>
              <p><span className="font-semibold">Lowest Day:</span> {lowDay.day} - {lowDay.load} kW</p>
              <p><span className="font-semibold">Days at Risk:</span> {daysAtRisk} / 7</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Week Chart */}
      <Card>
        <CardHeader>
          <CardTitle>7-Day Load Forecast Chart</CardTitle>
          <CardDescription>Predicted daily loads with contract limit reference</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyAverages} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
                <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} label={{ value: 'Load (kW)', angle: -90, position: 'insideLeft' }} />
                <ChartTooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <ReferenceLine y={data.contract_demand} stroke="red" strokeDasharray="5 5" strokeWidth={2} label={{ value: 'Contract Limit', position: 'right', fontSize: 11, fill: 'red' }} />
                <Line type="monotone" dataKey="load" stroke="var(--chart-1)" name="Predicted Load" strokeWidth={3} dot={{ fill: 'var(--primary)', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}