// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table'

// const predictions = [
//   {
//     timestamp: '2024-01-15 14:32',
//     nextDayLoad: '1,420 kW',
//     contractDemand: '1,500 kVA',
//     status: 'Safe',
//     statusType: 'safe',
//   },
//   {
//     timestamp: '2024-01-14 09:15',
//     nextDayLoad: '1,385 kW',
//     contractDemand: '1,500 kVA',
//     status: 'Safe',
//     statusType: 'safe',
//   },
//   {
//     timestamp: '2024-01-13 16:48',
//     nextDayLoad: '1,450 kW',
//     contractDemand: '1,500 kVA',
//     status: 'Safe',
//     statusType: 'safe',
//   },
//   {
//     timestamp: '2024-01-12 11:22',
//     nextDayLoad: '1,380 kW',
//     contractDemand: '1,500 kVA',
//     status: 'Safe',
//     statusType: 'safe',
//   },
//   {
//     timestamp: '2024-01-11 13:55',
//     nextDayLoad: '1,520 kW',
//     contractDemand: '1,500 kVA',
//     status: 'Risk',
//     statusType: 'risk',
//   },
//   {
//     timestamp: '2024-01-10 10:30',
//     nextDayLoad: '1,240 kW',
//     contractDemand: '1,500 kVA',
//     status: 'Safe',
//     statusType: 'safe',
//   },
//   {
//     timestamp: '2024-01-09 15:12',
//     nextDayLoad: '1,360 kW',
//     contractDemand: '1,500 kVA',
//     status: 'Safe',
//     statusType: 'safe',
//   },
//   {
//     timestamp: '2024-01-08 12:45',
//     nextDayLoad: '1,410 kW',
//     contractDemand: '1,500 kVA',
//     status: 'Safe',
//     statusType: 'safe',
//   },
// ]

// export function RecentPredictionsTable() {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Recent Predictions</CardTitle>
//         <CardDescription>Historical prediction records and compliance status</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="overflow-x-auto">
//           <Table>
//             <TableHeader>
//               <TableRow className="border-border hover:bg-transparent">
//                 <TableHead className="text-foreground font-semibold">Timestamp</TableHead>
//                 <TableHead className="text-foreground font-semibold">Next Day Predicted Load</TableHead>
//                 <TableHead className="text-foreground font-semibold">Contract Demand</TableHead>
//                 <TableHead className="text-foreground font-semibold">Status</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {predictions.map((pred, idx) => (
//                 <TableRow 
//                   key={idx} 
//                   className={`border-border hover:bg-muted/30 transition-colors ${
//                     pred.statusType === 'risk' ? 'bg-red-50/20' : ''
//                   }`}
//                 >
//                   <TableCell className="text-sm text-muted-foreground font-medium">
//                     {pred.timestamp}
//                   </TableCell>
//                   <TableCell className="text-sm font-semibold text-foreground">
//                     {pred.nextDayLoad}
//                   </TableCell>
//                   <TableCell className="text-sm text-muted-foreground">
//                     {pred.contractDemand}
//                   </TableCell>
//                   <TableCell>
//                     <Badge 
//                       variant={pred.statusType === 'safe' ? 'default' : 'destructive'}
//                       className={pred.statusType === 'safe' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}
//                     >
//                       {pred.status}
//                     </Badge>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//         <div className="mt-4 text-xs text-muted-foreground">
//           Showing 8 of 127 recent predictions · <a href="#" className="text-primary hover:underline">View all</a>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { getRecentPredictions, RecentPrediction } from '@/lib/api'

export function RecentPredictionsTable() {
  const [predictions, setPredictions] = useState<RecentPrediction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRecentPredictions()
      .then(data => setPredictions(data))
      .finally(() => setLoading(false))
  }, [])

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