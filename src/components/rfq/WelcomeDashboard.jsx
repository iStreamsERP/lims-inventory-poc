import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar, MessageSquare, Bell, CheckCircle2 } from "lucide-react"



export default function WelcomeDashboard({ user }) {
  const progress = (user.tasksCompleted / user.totalTasks) * 100

  return (
    <Card className="w-full max-w-3xl mx-auto bg-gradient-to-br from-purple-50 to-blue-100 border-none shadow-xl rounded-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-14 w-14 ring-3 ring-white/80">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-purple-500 text-white text-lg">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Hello, {user.name}!
              </CardTitle>
              <p className="text-sm text-gray-600">Ready to crush it today?</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-purple-100">
            <Bell className="h-5 w-5 text-purple-600" />
          </Button>
        </div>
      </CardHeader>
      
    </Card>
  )
}           