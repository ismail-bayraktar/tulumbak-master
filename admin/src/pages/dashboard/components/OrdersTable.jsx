import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Eye } from "lucide-react"
import { OrderStatusBadge, CourierStatusBadge } from "./OrderStatusBadge"
import { formatCurrency, formatRelativeTime } from "@/lib/utils"

export function OrdersTable({ orders, loading, onStatusUpdate }) {
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  // Filter orders by status
  const filteredOrders = selectedStatus === "all"
    ? orders
    : orders.filter((order) => order.status === selectedStatus)

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage)

  // Status filter options
  const statusOptions = [
    { value: "all", label: "Tümü" },
    { value: "Siparişiniz Alındı", label: "Bekliyor" },
    { value: "Hazırlanıyor", label: "Hazırlanıyor" },
    { value: "Kuryeye Atandı", label: "Kuryeye Atandı" },
    { value: "Teslim Edildi", label: "Teslim Edildi" },
  ]

  const handleStatusChange = async (orderId, newStatus) => {
    if (onStatusUpdate) {
      await onStatusUpdate(orderId, newStatus)
    }
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtrele:</span>
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              variant={selectedStatus === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedStatus(option.value)
                setCurrentPage(1)
              }}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <Badge variant="secondary">
          {filteredOrders.length} sipariş
        </Badge>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sipariş No</TableHead>
              <TableHead>Müşteri</TableHead>
              <TableHead>Tutar</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Kurye</TableHead>
              <TableHead>Zaman</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Sipariş bulunamadı
                </TableCell>
              </TableRow>
            ) : (
              paginatedOrders.map((order) => {
                const isCourierAssigned = order.courierIntegration?.platform || order.courierTrackingId
                const courierName = order.courierIntegration?.platform === 'muditakurye' ? 'MuditaKurye' : null

                return (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">
                      #{order.trackingId || order._id.slice(-6)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.address?.name || 'Bilinmiyor'}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {order.address?.street || ''}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(order.amount)}</TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>
                      <CourierStatusBadge
                        assigned={isCourierAssigned}
                        courierName={courierName}
                      />
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
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Detayları Gör
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(order._id, "Hazırlanıyor")}
                            disabled={order.status === "Hazırlanıyor"}
                          >
                            Hazırlanıyor Olarak İşaretle
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(order._id, "Kuryeye Atandı")}
                            disabled={order.status === "Kuryeye Atandı"}
                          >
                            Kuryeye Ata
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(order._id, "Teslim Edildi")}
                            disabled={order.status === "Teslim Edildi"}
                          >
                            Teslim Edildi Olarak İşaretle
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
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
