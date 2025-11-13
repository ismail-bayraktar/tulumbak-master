import { useState, useCallback, useEffect } from 'react'
import { courierAPI } from '@/lib/api'

export function useCourierData() {
  const [courierData, setCourierData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchCourierData = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true)

      // Fetch courier dashboard data
      const response = await courierAPI.getDashboard()

      if (response.data.success) {
        const apiData = response.data.data

        // Transform backend data to widget format
        const transformedData = {
          activeDeliveries: apiData.recentOrders?.filter(o =>
            o.status === 'pending' || o.status === 'in_transit'
          ).slice(0, 3).map(o => ({
            id: o.externalId || o.id,
            orderId: o.orderNumber || o.id,
            status: o.status || 'in_transit',
            estimatedTime: 'Hesaplanıyor',
            address: 'N/A'
          })) || [],

          todaySummary: {
            totalDeliveries: apiData.metrics?.totalOrders || 0,
            successful: apiData.metrics?.syncedOrders || 0,
            inProgress: apiData.status?.retryQueue?.activeRetries || 0,
            failed: apiData.status?.dlqPending || 0,
          },

          pendingAssignments: apiData.recentOrders?.filter(o =>
            !o.externalId && o.status === 'pending'
          ).slice(0, 2).map(o => ({
            id: o.orderNumber || o.id,
            customerName: 'Müşteri',
            address: 'N/A',
            waitTime: 'Bekliyor'
          })) || [],

          problematicDeliveries: [] // DLQ'dan gelecek
        }

        setCourierData(transformedData)
      }
    } catch (error) {
      console.error('Courier data fetch error:', error)
      // Fail silently for dashboard - widgets will show empty state
      setCourierData(null)
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  // Auto-fetch on mount
  useEffect(() => {
    fetchCourierData()
  }, [fetchCourierData])

  return {
    courierData,
    loading,
    fetchCourierData,
  }
}
