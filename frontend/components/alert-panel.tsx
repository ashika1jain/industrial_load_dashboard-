import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, AlertTriangle } from 'lucide-react'
import { PredictionResponse } from '@/lib/api'

interface AlertPanelProps {
  data: PredictionResponse | null
}

export function AlertPanel({ data }: AlertPanelProps) {
  const isRisk = data?.status === 'Risk'

  return (
    <Card className={isRisk ? 'border-destructive/30 bg-red-50/30' : 'border-green-200/30 bg-green-50/30'}>
      <CardHeader>
        <CardTitle className="text-base">Smart Alert</CardTitle>
        <CardDescription>Real-time demand status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!data ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Run a prediction to see alerts.
            </p>
          ) : isRisk ? (
            <div className="flex gap-3">
              <AlertTriangle className="h-8 w-8 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-destructive">⚠️ Risk Alert</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {data.alert_message}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-green-700">✅ All Clear</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {data.alert_message}
                </p>
              </div>
            </div>
          )}

          {data && (
            <div className={`rounded-md p-2.5 text-xs ${
              isRisk
                ? 'bg-red-100 text-red-900'
                : 'bg-green-100 text-green-900'
            }`}>
              <span className="font-semibold">Predicted Load:</span> {data.next_day_prediction} kW
              {' | '}
              <span className="font-semibold">Contract:</span> {data.contract_demand} kW
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}