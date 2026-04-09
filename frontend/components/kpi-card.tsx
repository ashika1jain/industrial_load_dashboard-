import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string
  unit: string
  icon: React.ReactNode
  trend: string
}

export function KPICard({ title, value, unit, icon, trend }: KPICardProps) {
  const isTrendPositive = trend.startsWith('+')
  const isLimit = trend === 'Limit'

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold text-foreground">{value}</div>
          <div className="text-sm text-muted-foreground">{unit}</div>
        </div>
        <div className={`mt-3 text-xs font-semibold ${
          isLimit ? 'text-foreground' : isTrendPositive ? 'text-destructive' : 'text-green-600'
        }`}>
          {trend}
        </div>
      </CardContent>
    </Card>
  )
}
