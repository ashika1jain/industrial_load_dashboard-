'use client'
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { getRecentPredictions, RecentPrediction } from '@/lib/api'

export function RecentPredictionsTable() {
  const { user } = useUser()
  const userId = user?.id || "anonymous"
  const [predictions, setPredictions] = useState<RecentPrediction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRecentPredictions(userId)
      .then(data => setPredictions(data))
      .catch(() => setPredictions([]))
      .finally(() => setLoading(false))
  }, [userId])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Predictions</CardTitle>
        <CardDescription>Historical prediction records and compliance status</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground text-center py-8">Loading...</p>
        ) : predictions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No predictions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-foreground font-semibold">Timestamp</TableHead>
                  <TableHead className="text-foreground font-semibold">Next Day Predicted Load</TableHead>
                  <TableHead className="text-foreground font-semibold">Contract Demand</TableHead>
                  <TableHead className="text-foreground font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {predictions.map((pred) => (
                  <TableRow
                    key={pred.id}
                    className={`border-border hover:bg-muted/30 transition-colors ${
                      pred.status === 'Risk' ? 'bg-red-50/20' : ''
                    }`}
                  >
                    <TableCell className="text-sm text-muted-foreground font-medium">
                      {new Date(pred.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-foreground">
                      {pred.next_day_prediction} kW
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {pred.contract_demand} kW
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={pred.status === 'Safe' ? 'default' : 'destructive'}
                        className={pred.status === 'Safe' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}
                      >
                        {pred.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
