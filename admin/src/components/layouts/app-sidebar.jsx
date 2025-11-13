import { Link } from "react-router-dom"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  Building,
  PackageSearch,
  Store,
  MapPin,
  Clock,
  Settings,
  Truck,
  Ticket,
  Image,
  Activity,
  Mail,
  MessageSquare,
  BarChart3,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { assets } from "@/assets/assets"

const menuItems = [
  {
    title: "Ana Menü",
    items: [
      { title: "Dashboard", icon: LayoutDashboard, url: "/dashboard" },
      { title: "Ürün Ekle", icon: Package, url: "/add" },
      { title: "Ürün Listesi", icon: ShoppingCart, url: "/list" },
    ],
  },
  {
    title: "Siparişler",
    items: [
      { title: "Siparişler", icon: FileText, url: "/orders" },
      { title: "Kurumsal Siparişler", icon: Building, url: "/corporate-orders" },
      { title: "Sipariş İşleme", icon: PackageSearch, url: "/order-processing" },
    ],
  },
  {
    title: "Şube",
    items: [
      { title: "Şubeler", icon: Store, url: "/branches" },
      { title: "Teslimat Bölgeleri", icon: MapPin, url: "/delivery-zones" },
      { title: "Zaman Aralıkları", icon: Clock, url: "/time-slots" },
      { title: "Şube Atama Ayarları", icon: Settings, url: "/branch-assignment-settings" },
    ],
  },
  {
    title: "Esnaf Express",
    items: [
      { title: "Kurye Entegrasyonu", icon: Truck, url: "/courier-test" },
    ],
  },
  {
    title: "Ayarlar",
    items: [
      { title: "Medya Kütüphanesi", icon: Image, url: "/media-library" },
      { title: "Slider Yönetimi", icon: Activity, url: "/slider" },
      { title: "Kuponlar", icon: Ticket, url: "/coupons" },
      { title: "Ayarlar", icon: Settings, url: "/settings" },
      { title: "Email Logları", icon: Mail, url: "/email-logs" },
      { title: "SMS Logları", icon: MessageSquare, url: "/sms-logs" },
    ],
  },
  {
    title: "Raporlar",
    items: [
      { title: "Raporlar", icon: BarChart3, url: "/reports" },
    ],
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <img src={assets.logo} alt="Tulumbak" className="h-8 w-8" />
          <div>
            <h2 className="text-lg font-bold">Tulumbak</h2>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span>Sistem Aktif</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
