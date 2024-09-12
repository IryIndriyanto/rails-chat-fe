import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"

interface ServerStatusCardProps {
  isOnline: boolean
}

export default function ServerStatusCard({ isOnline }: ServerStatusCardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Server Status</CardTitle>
        {isOnline ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <XCircle className="h-4 w-4 text-red-500" />
        )}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
          {isOnline ? "Online" : "Offline"}
        </div>
      </CardContent>
    </Card>
  )
}