import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { backendUrl } from "@/App"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react"

export default function DashboardPage({ token }) {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    todayRevenue: 0,
    newUsers: 0,
  })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      try {
        const statsResponse = await axios.get(
          backendUrl + "/api/report/dashboard",
          { headers: { token } }
        )

        if (statsResponse.data.success) {
          setStats(statsResponse.data.data || {})
        }
      } catch (err) {
        console.log("Dashboard stats not available")
      }
    } catch (error) {
      console.error("Dashboard error:", error)
    } finally {
      setLoading(false)
    }
  }

  const statsCards = [
    {
      title: "Toplam Sipariş",
      value: stats.totalOrders || 0,
      icon: ShoppingCart,
      description: "Tüm siparişler",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Bekleyen Sipariş",
      value: stats.pendingOrders || 0,
      icon: Package,
      description: "İşlem bekleyen",
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
    {
      title: "Bugünkü Gelir",
      value: `₺${stats.todayRevenue || 0}`,
      icon: TrendingUp,
      description: "Günlük toplam",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Yeni Kullanıcı",
      value: stats.newUsers || 0,
      icon: Users,
      description: "Bu ay",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Hoş geldiniz! İşte işletmenizin özeti.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-muted rounded"></div>
                <div className="h-8 w-8 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted rounded mb-2"></div>
                <div className="h-3 w-24 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Hoş Geldiniz! 🎉</CardTitle>
          <CardDescription>
            Shadcn/ui ile yenilenen modern admin paneline hoş geldiniz.
            Bu demo sayfası çalışıyor demektir!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Modern UI Componentleri</h3>
              <p className="text-sm text-muted-foreground">
                Shadcn/ui ile responsive ve accessible design
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Dark Mode Desteği</h3>
              <p className="text-sm text-muted-foreground">
                Sağ üstteki tema butonundan açık/koyu mod arasında geçiş yapabilirsiniz
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
