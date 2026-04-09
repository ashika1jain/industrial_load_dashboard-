'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartLegend } from '@/components/ui/chart'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts'
import { PredictionResponse } from '@/lib/api'

interface LoadChartProps {
  data: PredictionResponse | null
}

export function LoadChart({ data }: LoadChartProps) {
  const chartData = data
    ? data.next_week_prediction.slice(0, 24).map((load, i) => ({
        time: `${String(i).padStart(2, '0')}:00`,
        predicted: Math.round(load),
      }))
    : [
        { time: '00:00', predicted: 0 },
        { time: '06:00', predicted: 0 },
        { time: '12:00', predicted: 0 },
        { time: '18:00', predicted: 0 },
        { time: '23:00', predicted: 0 },
      ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Load Analytics</CardTitle>
        <CardDescription>
          {data ? 'Next 24 hours predicted load' : 'Upload data and run prediction to see chart'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="time" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
              <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} label={{ value: 'Load (kW)', angle: -90, position: 'insideLeft' }} />
              <ChartTooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
              <ChartLegend />
              {data && (
                <ReferenceLine y={data.contract_demand} stroke="red" strokeDasharray="5 5" strokeWidth={2} label={{ value: 'Contract Limit', position: 'right', fontSize: 11, fill: 'red' }} />
              )}
              <Line type="monotone" dataKey="predicted" stroke="var(--chart-1)" name="Predicted Load" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}