import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentZikrs } from "@/components/recent-zikrs"
import { QuickActions } from "@/components/quick-actions"

export default function AdminDashboard() {
  return (
    <AuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-islamic text-primary mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to the Jariya Islamic Zikr Management System</p>
          </div>

          {/* Stats Cards */}
          <DashboardStats />

          {/* Recent Activity and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentZikrs />
            <QuickActions />
          </div>
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
