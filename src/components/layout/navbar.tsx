import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/auth-context'
import { Button } from '@/components/ui/button'
import { Bug, LogOut, User } from 'lucide-react'

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Bug className="h-6 w-6" />
          <span>Bug Tracker</span>
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            {user?.role === 'User' && (
              <>
                <Link to="/bugs/create">
                  <Button variant="ghost">Report Bug</Button>
                </Link>
                <Link to="/my-bugs">
                  <Button variant="ghost">My Bugs</Button>
                </Link>
              </>
            )}
            {user?.role === 'Developer' && (
              <>
                <Link to="/bugs/create">
                  <Button variant="ghost">Report Bug</Button>
                </Link>
                <Link to="/assigned-bugs">
                  <Button variant="ghost">Assigned Bugs</Button>
                </Link>
                <Link to="/unassigned-bugs">
                  <Button variant="ghost">Unassigned</Button>
                </Link>
              </>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{user?.fullName}</span>
              <span className="rounded bg-secondary px-2 py-0.5 text-xs">{user?.role}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Register</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
