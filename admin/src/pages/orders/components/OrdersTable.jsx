import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  MoreHorizontal,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  Package,
} from "lucide-react"
import { formatCurrency, formatRelativeTime, getStatusColor } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export function OrdersTable({ orders, loading, onStatusUpdate, onViewDetails }) {
  const [selectedOrders, setSelectedOrders] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  // Pagination
  const totalPages = Math.ceil(orders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOrders = orders.slice(startIndex, startIndex + itemsPerPage)

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedOrders.length === paginatedOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(paginatedOrders.map((o) => o._id))
    }
  }

  const toggleSelectOrder = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    )
  }

  const isSelected = (orderId) => selectedOrders.includes(orderId)
  const isAllSelected =
    paginatedOrders.length > 0 && selectedOrders.length === paginatedOrders.length

  // Status update handler
  const handleStatusUpdate = async (orderId, newStatus) => {
    await onStatusUpdate(orderId, newStatus)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">Sipariş bulunamadı</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Filtrelerinizi değiştirerek tekrar deneyin
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="flex items-center gap-2 bg-muted p-3 rounded-lg">
          <span className="text-sm font-medium">
            {selectedOrders.length} sipariş seçildi
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              selectedOrders.forEach((orderId) =>
                handleStatusUpdate(orderId, "Hazırlanıyor")
              )
              setSelectedOrders([])
            }}
          >
            <Clock className="h-4 w-4 mr-2" />
            Hazırlanıyor Yap
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              selectedOrders.forEach((orderId) =>
                handleStatusUpdate(orderId, "Kuryeye Verildi")
              )
              setSelectedOrders([])
            }}
          >
            <Truck className="h-4 w-4 mr-2" />
            Kuryeye Ver
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedOrders([])}
          >
            İptal
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Sipariş No</TableHead>
              <TableHead>Müşteri</TableHead>
              <TableHead>Ürünler</TableHead>
              <TableHead>Tutar</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Kurye</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.map((order) => (
              <TableRow key={order._id} className={isSelected(order._id) ? "bg-muted/50" : ""}>
                <TableCell>
                  <Checkbox
                    checked={isSelected(order._id)}
                    onCheckedChange={() => toggleSelectOrder(order._id)}
                  />
                </TableCell>
                <TableCell className="font-mono text-sm">
                  #{order._id?.slice(-8) || "N/A"}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {order.address?.firstName || ""} {order.address?.lastName || ""}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {order.address?.phone || "N/A"}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {order.items?.length || 0} ürün
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(order.amount || 0)}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(order.status || "Bilinmiyor")}>
                    {order.status || "Bilinmiyor"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {order.courierAssigned ? (
                    <Badge variant="outline" className="bg-purple-50">
                      <Truck className="h-3 w-3 mr-1" />
                      Atandı
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-50">
                      Bekliyor
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatRelativeTime(order.date)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onViewDetails(order)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Detayları Gör
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(order._id, "Hazırlanıyor")}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Hazırlanıyor
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(order._id, "Kuryeye Verildi")}
                      >
                        <Truck className="h-4 w-4 mr-2" />
                        Kuryeye Ver
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(order._id, "Teslim Edildi")}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Teslim Et
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Sayfa {currentPage} / {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Önceki
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Sonraki
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
