import { useAuth } from '@/context/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Bug, Plus, ClipboardList, CheckCircle } from 'lucide-react'

export function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user?.fullName}!</h1>
        <p className="text-muted-foreground mt-2">
          {user?.role === 'Developer'
            ? 'Manage and resolve bugs assigned to you'
            : 'Track and report bugs for your projects'}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {user?.role === 'User' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Report a Bug
                </CardTitle>
                <CardDescription>Found an issue? Report it here</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/bugs/create">
                  <Button className="w-full">Create Bug Report</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bug className="h-5 w-5" />
                  My Reported Bugs
                </CardTitle>
                <CardDescription>View all bugs you've reported</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/my-bugs">
                  <Button variant="outline" className="w-full">
                    View My Bugs
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </>
        )}

        {user?.role === 'Developer' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Report a Bug
                </CardTitle>
                <CardDescription>Found an issue? Report it here</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/bugs/create">
                  <Button className="w-full">Create Bug Report</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Assigned Bugs
                </CardTitle>
                <CardDescription>Bugs assigned to you for resolution</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/assigned-bugs">
                  <Button variant="outline" className="w-full">
                    View Assigned
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Unassigned Bugs
                </CardTitle>
                <CardDescription>Pick up new bugs to work on</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/unassigned-bugs">
                  <Button variant="outline" className="w-full">
                    Browse Unassigned
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
