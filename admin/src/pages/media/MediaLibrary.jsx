import { useState, useEffect, useCallback } from "react"
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
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  Grid3x3,
  List,
  Search,
  Filter,
  Settings,
  Trash2,
  Download,
  Eye,
  FolderOpen,
  Image as ImageIcon,
  FileText,
  Video,
  CloudUpload
} from "lucide-react"
import { mediaAPI } from "@/lib/api"
import { MediaGrid } from "./components/MediaGrid"
import { MediaUpload } from "./components/MediaUpload"
import { MediaSettings } from "./components/MediaSettings"
import { useToast } from "@/hooks/use-toast"

// 8 Categories as defined in MediaModel
const CATEGORIES = [
  { value: "all", label: "Tümü", icon: FolderOpen },
  { value: "products", label: "Ürünler", icon: ImageIcon },
  { value: "sliders", label: "Slider/Banner", icon: ImageIcon },
  { value: "blogs", label: "Blog", icon: FileText },
  { value: "pages", label: "Sayfalar", icon: FileText },
  { value: "categories", label: "Kategoriler", icon: FolderOpen },
  { value: "users", label: "Kullanıcılar", icon: ImageIcon },
  { value: "settings", label: "Ayarlar", icon: Settings },
  { value: "general", label: "Genel", icon: FolderOpen },
]

export default function MediaLibrary() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("library")
  const [viewMode, setViewMode] = useState("grid") // grid | list
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })

  // Fetch media
  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        search: searchQuery || undefined,
        sortBy,
        sortOrder
      }

      const response = await mediaAPI.getAll(params)

      if (response.data.success) {
        setMedia(response.data.media)
        setPagination(response.data.pagination)
      }
    } catch (error) {
      console.error("Error fetching media:", error)
      toast({
        title: "Hata",
        description: "Medya listesi yüklenemedi",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit, selectedCategory, searchQuery, sortBy, sortOrder, toast])

  useEffect(() => {
    fetchMedia()
  }, [fetchMedia])

  // Handle upload success
  const handleUploadSuccess = () => {
    fetchMedia()
    setActiveTab("library")
    toast({
      title: "Başarılı",
      description: "Medya başarıyla yüklendi",
    })
  }

  // Handle delete
  const handleDelete = async (id) => {
    if (!confirm("Bu medyayı silmek istediğinizden emin misiniz?")) return

    try {
      const response = await mediaAPI.remove(id)
      if (response.data.success) {
        toast({
          title: "Başarılı",
          description: "Medya silindi",
        })
        fetchMedia()
      }
    } catch (error) {
      console.error("Error deleting media:", error)
      toast({
        title: "Hata",
        description: error.response?.data?.message || "Medya silinemedi",
        variant: "destructive",
      })
    }
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
                    <BreadcrumbPage>Medya Kütüphanesi</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <Badge variant="outline" className="text-sm">
              {pagination.total} Medya
            </Badge>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Medya Kütüphanesi</h1>
              <p className="text-muted-foreground">
                Resim, video ve dokümanlarınızı yönetin
              </p>
            </div>
          </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="library">
            <FolderOpen className="w-4 h-4 mr-2" />
            Kütüphane
          </TabsTrigger>
          <TabsTrigger value="upload">
            <Upload className="w-4 h-4 mr-2" />
            Yükle
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Ayarlar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Category Filter */}
                  <div className="w-48">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            <div className="flex items-center gap-2">
                              <cat.icon className="w-4 h-4" />
                              {cat.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Search */}
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Ara..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt">Tarih</SelectItem>
                      <SelectItem value="size">Boyut</SelectItem>
                      <SelectItem value="originalName">İsim</SelectItem>
                      <SelectItem value="views">Görüntülenme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <MediaGrid
                media={media}
                viewMode={viewMode}
                loading={loading}
                onDelete={handleDelete}
                pagination={pagination}
                onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload">
          <MediaUpload onSuccess={handleUploadSuccess} />
        </TabsContent>

        <TabsContent value="settings">
          <MediaSettings />
        </TabsContent>
        </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
