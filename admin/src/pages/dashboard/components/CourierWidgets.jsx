import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  TruckIcon,
  CheckCircle,
  Clock,
  AlertTriangle,
  Package,
  TrendingUp,
} from "lucide-react"
import { Link } from "react-router-dom"

export function CourierWidgets({ courierData, loading }) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    )
  }

  // Mock data - will be replaced with real API data
  const displayData = courierData || {
    activeDeliveries: [
      {
        id: "DEL-001",
        orderId: "ORD-789",
        status: "in_transit",
        estimatedTime: "15 dk",
        address: "Kadıköy, İstanbul",
      },
      {
        id: "DEL-002",
        orderId: "ORD-790",
        status: "preparing",
        estimatedTime: "5 dk",
        address: "Beşiktaş, İstanbul",
      },
      {
        id: "DEL-003",
        orderId: "ORD-791",
        status: "in_transit",
        estimatedTime: "22 dk",
        address: "Üsküdar, İstanbul",
      },
    ],
    todaySummary: {
      totalDeliveries: 47,
      successful: 42,
      inProgress: 3,
      failed: 2,
    },
    pendingAssignments: [
      {
        id: "ORD-794",
        customerName: "Ahmet Yılmaz",
        address: "Şişli, İstanbul",
        waitTime: "5 dk",
      },
      {
        id: "ORD-795",
        customerName: "Ayşe Demir",
        address: "Sarıyer, İstanbul",
        waitTime: "12 dk",
      },
    ],
    problematicDeliveries: [
      {
        id: "DEL-045",
        orderId: "ORD-788",
        issue: "Müşteriye ulaşılamadı",
        attempts: 2,
        lastAttempt: "10 dk önce",
      },
      {
        id: "DEL-046",
        orderId: "ORD-787",
        issue: "Hatalı adres",
        attempts: 1,
        lastAttempt: "25 dk önce",
      },
    ],
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      in_transit: { label: "Yolda", variant: "secondary", icon: TruckIcon },
      preparing: { label: "Hazırlanıyor", variant: "outline", icon: Clock },
      delivered: { label: "Teslim Edildi", variant: "default", icon: CheckCircle },
    }
    const config = statusMap[status] || statusMap.preparing
    const Icon = config.icon
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <TruckIcon className="h-5 w-5" />
          Kurye Entegrasyonu
        </h2>
        <Link to="/courier-performance">
          <Badge variant="outline" className="cursor-pointer hover:bg-accent">
            Detaylı Görünüm →
          </Badge>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Active Deliveries Widget */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TruckIcon className="h-4 w-4" />
              Aktif Teslimatlar
            </CardTitle>
            <CardDescription>Şu anda yoldaki teslimatlar</CardDescription>
          </CardHeader>
          <CardContent>
            {displayData.activeDeliveries.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aktif teslimat bulunmuyor
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sipariş No</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Tahmini Süre</TableHead>
                    <TableHead>Adres</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayData.activeDeliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell className="font-medium">{delivery.orderId}</TableCell>
                      <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                      <TableCell className="text-sm">{delivery.estimatedTime}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {delivery.address}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Today's Summary Widget */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Bugünkü Özet
            </CardTitle>
            <CardDescription>Günlük teslimat özeti</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Toplam Teslimat</span>
                <span className="text-lg font-bold">{displayData.todaySummary.totalDeliveries}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  Başarılı
                </span>
                <span className="text-sm font-semibold text-green-600">
                  {displayData.todaySummary.successful}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3 text-blue-600" />
                  Devam Eden
                </span>
                <span className="text-sm font-semibold text-blue-600">
                  {displayData.todaySummary.inProgress}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-red-600" />
                  Başarısız
                </span>
                <span className="text-sm font-semibold text-red-600">
                  {displayData.todaySummary.failed}
                </span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Başarı Oranı</span>
                  <span className="text-sm font-bold text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {((displayData.todaySummary.successful / displayData.todaySummary.totalDeliveries) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Assignments Widget */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Bekleyen Atamalar
            </CardTitle>
            <CardDescription>Kuryeye atanmamış siparişler</CardDescription>
          </CardHeader>
          <CardContent>
            {displayData.pendingAssignments.length === 0 ? (
              <div className="text-center py-4">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Tüm siparişler atandı
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {displayData.pendingAssignments.map((order) => (
                  <div key={order.id} className="border-l-2 border-yellow-500 pl-3 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{order.id}</span>
                      <Badge variant="outline" className="text-xs">
                        {order.waitTime}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">{order.address}</p>
                  </div>
                ))}
                {displayData.pendingAssignments.length > 2 && (
                  <Link to="/orders">
                    <p className="text-xs text-center text-primary hover:underline cursor-pointer">
                      +{displayData.pendingAssignments.length - 2} daha fazla
                    </p>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Problematic Deliveries - Full Width */}
      {displayData.problematicDeliveries.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <AlertTriangle className="h-4 w-4" />
              Sorunlu Teslimatlar
            </CardTitle>
            <CardDescription className="text-red-700">
              Dikkat gerektiren teslimatlar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teslimat ID</TableHead>
                  <TableHead>Sipariş No</TableHead>
                  <TableHead>Sorun</TableHead>
                  <TableHead>Deneme Sayısı</TableHead>
                  <TableHead>Son Deneme</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayData.problematicDeliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell className="font-medium">{delivery.id}</TableCell>
                    <TableCell>{delivery.orderId}</TableCell>
                    <TableCell>
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {delivery.issue}
                      </Badge>
                    </TableCell>
                    <TableCell>{delivery.attempts} kez</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {delivery.lastAttempt}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
