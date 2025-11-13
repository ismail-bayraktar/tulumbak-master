import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { RefreshCw } from "lucide-react"
import { KPICards } from "./components/KPICards"
import { OrdersTable } from "./components/OrdersTable"
import { CourierWidgets } from "./components/CourierWidgets"
import { useDashboardStats } from "./hooks/useDashboardStats"
import { useOrders } from "./hooks/useOrders"
import { useCourierData } from "./hooks/useCourierData"
import { usePolling } from "./hooks/usePolling"
import { useToast } from "@/hooks/use-toast"

export default function Dashboard() {
  const { stats, dailySales, deliveryStatus, loading: statsLoading, fetchStats } = useDashboardStats()
  const { orders, loading: ordersLoading, fetchOrders, updateOrderStatus } = useOrders()
  const { courierData, loading: courierLoading, fetchCourierData } = useCourierData()
  const { toast } = useToast()

  // Auto-refresh every 15 seconds
  usePolling(() => {
    fetchOrders(true) // silent refresh
    fetchStats(true)
    fetchCourierData(true)
  }, 15000)

  const handleManualRefresh = () => {
    fetchOrders()
    fetchStats()
    fetchCourierData()
    toast({
      title: "Yenilendi",
      description: "Veriler güncellendi",
    })
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center justify-between w-full px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Tulumbak Admin
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              disabled={statsLoading || ordersLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${(statsLoading || ordersLoading) ? 'animate-spin' : ''}`} />
              Yenile
            </Button>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* KPI Cards */}
          <KPICards
            stats={stats}
            dailySales={dailySales}
            deliveryStatus={deliveryStatus}
            loading={statsLoading}
          />

          {/* Courier Widgets */}
          <CourierWidgets
            courierData={courierData}
            loading={courierLoading}
          />

          {/* Orders Table */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Son Siparişler</h2>
              <p className="text-sm text-muted-foreground">
                Sipariş yönetimi ve durum güncellemeleri
              </p>
            </div>
            <OrdersTable
              orders={orders}
              loading={ordersLoading}
              onStatusUpdate={updateOrderStatus}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
