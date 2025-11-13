import { useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
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
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, FolderTree } from "lucide-react"

// Default categories for Tulumbak
const DEFAULT_CATEGORIES = [
  { id: 1, name: "Taze Meyve", description: "Taze meyve tabakları ve paketleri", active: true },
  { id: 2, name: "Kuruyemiş", description: "Premium kuruyemiş çeşitleri", active: true },
  { id: 3, name: "Çikolata", description: "El yapımı çikolata ürünleri", active: true },
  { id: 4, name: "Atıştırmalık", description: "Sağlıklı atıştırmalıklar", active: true },
  { id: 5, name: "Özel Paketler", description: "Özel günler için hazırlanmış paketler", active: true },
]

export default function Categories() {
  const { toast } = useToast()
  const [categories, setCategories] = useState(() => {
    // Load from localStorage or use defaults
    const saved = localStorage.getItem("tulumbak_categories")
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES
  })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [categoryToDelete, setCategoryToDelete] = useState(null)
  const [formData, setFormData] = useState({ name: "", description: "", active: true })

  const saveCategories = (newCategories) => {
    setCategories(newCategories)
    localStorage.setItem("tulumbak_categories", JSON.stringify(newCategories))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.name) {
      toast({
        variant: "destructive",
        title: "Eksik Bilgi",
        description: "Kategori adı gereklidir",
      })
      return
    }

    if (editingCategory) {
      // Update existing
      const updated = categories.map((cat) =>
        cat.id === editingCategory.id ? { ...cat, ...formData } : cat
      )
      saveCategories(updated)
      toast({
        title: "Başarılı",
        description: "Kategori güncellendi",
      })
    } else {
      // Add new
      const newCategory = {
        id: Math.max(...categories.map((c) => c.id), 0) + 1,
        ...formData,
      }
      saveCategories([...categories, newCategory])
      toast({
        title: "Başarılı",
        description: "Kategori eklendi",
      })
    }

    setDialogOpen(false)
    setEditingCategory(null)
    setFormData({ name: "", description: "", active: true })
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      active: category.active,
    })
    setDialogOpen(true)
  }

  const handleDelete = () => {
    const updated = categories.filter((cat) => cat.id !== categoryToDelete.id)
    saveCategories(updated)
    toast({
      title: "Başarılı",
      description: "Kategori silindi",
    })
    setDeleteDialogOpen(false)
    setCategoryToDelete(null)
  }

  const openDeleteDialog = (category) => {
    setCategoryToDelete(category)
    setDeleteDialogOpen(true)
  }

  const toggleActive = (category) => {
    const updated = categories.map((cat) =>
      cat.id === category.id ? { ...cat, active: !cat.active } : cat
    )
    saveCategories(updated)
    toast({
      title: "Güncellendi",
      description: `Kategori ${category.active ? "pasif" : "aktif"} yapıldı`,
    })
  }

  const resetToDefaults = () => {
    saveCategories(DEFAULT_CATEGORIES)
    toast({
      title: "Sıfırlandı",
      description: "Kategoriler varsayılan ayarlara döndürüldü",
    })
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Ana Sayfa</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Kategoriler</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <FolderTree className="h-8 w-8" />
                Kategori Yönetimi
              </h1>
              <p className="text-muted-foreground mt-1">
                Ürün kategorilerini yönetin ve organize edin
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetToDefaults}
              >
                Varsayılana Döndür
              </Button>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={() => {
                    setEditingCategory(null)
                    setFormData({ name: "", description: "", active: true })
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Kategori
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={handleSubmit}>
                    <DialogHeader>
                      <DialogTitle>
                        {editingCategory ? "Kategori Düzenle" : "Yeni Kategori Ekle"}
                      </DialogTitle>
                      <DialogDescription>
                        Kategori bilgilerini girin
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Kategori Adı *</Label>
                        <Input
                          id="name"
                          placeholder="Örn: Premium Kuruyemiş"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Açıklama</Label>
                        <Input
                          id="description"
                          placeholder="Kategori açıklaması (opsiyonel)"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                        İptal
                      </Button>
                      <Button type="submit">
                        {editingCategory ? "Güncelle" : "Ekle"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Info Card */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <p className="text-sm text-blue-900">
                <strong>Not:</strong> Kategoriler şu an lokal olarak yönetilmektedir. Değişiklikler
                tarayıcınızda saklanır. Backend entegrasyonu tamamlandığında kategoriler veritabanında
                tutulacaktır.
              </p>
            </CardContent>
          </Card>

          {/* Categories Table */}
          <Card>
            <CardHeader>
              <CardTitle>Kategoriler ({categories.length})</CardTitle>
              <CardDescription>Tüm ürün kategorileri</CardDescription>
            </CardHeader>
            <CardContent>
              {categories.length === 0 ? (
                <div className="text-center py-12">
                  <FolderTree className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">Kategori bulunamadı</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Başlamak için yeni bir kategori ekleyin
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kategori Adı</TableHead>
                      <TableHead>Açıklama</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {category.description || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={category.active ? "default" : "secondary"}
                            className="cursor-pointer"
                            onClick={() => toggleActive(category)}
                          >
                            {category.active ? "Aktif" : "Pasif"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(category)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kategoriyi silmek istediğinizden emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{categoryToDelete?.name}</strong> kategorisi silinecektir. Bu kategori altındaki
              ürünler etkilenmeyecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  )
}
