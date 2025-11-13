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
import { Plus, Edit, Trash2, FolderTree, Loader2, Upload, X } from "lucide-react"
import useCategories from "@/hooks/useCategories"
import { Textarea } from "@/components/ui/textarea"

export default function Categories() {
  const { toast } = useToast()
  const {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    removeCategory,
    toggleActive: toggleCategoryActive,
    refresh,
  } = useCategories()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [categoryToDelete, setCategoryToDelete] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    active: true
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || formData.name.trim().length < 2) {
      toast({
        variant: "destructive",
        title: "Eksik Bilgi",
        description: "Kategori adı en az 2 karakter olmalıdır",
      })
      return
    }

    setSubmitting(true)

    try {
      if (editingCategory) {
        // Update existing
        const result = await updateCategory({
          id: editingCategory._id,
          ...formData,
        })

        if (result.success) {
          toast({
            title: "Başarılı",
            description: result.message || "Kategori güncellendi",
          })
          setDialogOpen(false)
          setEditingCategory(null)
          setFormData({ name: "", description: "", image: null, metaTitle: "", metaDescription: "", keywords: "", active: true })
          setImageFile(null)
          setImagePreview(null)
        } else {
          toast({
            variant: "destructive",
            title: "Hata",
            description: result.message || "Kategori güncellenemedi",
          })
        }
      } else {
        // Add new
        const result = await addCategory(formData)

        if (result.success) {
          toast({
            title: "Başarılı",
            description: "Kategori eklendi",
          })
          setDialogOpen(false)
          setFormData({ name: "", description: "", image: null, metaTitle: "", metaDescription: "", keywords: "", active: true })
          setImageFile(null)
          setImagePreview(null)
        } else {
          toast({
            variant: "destructive",
            title: "Hata",
            description: result.message || "Kategori eklenemedi",
          })
        }
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Beklenmeyen bir hata oluştu",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || "",
      image: category.image || null,
      metaTitle: category.metaTitle || "",
      metaDescription: category.metaDescription || "",
      keywords: category.keywords ? category.keywords.join(", ") : "",
      active: category.active,
    })
    setImagePreview(category.image)
    setImageFile(null)
    setDialogOpen(true)
  }

  const handleImageUpload = (file) => {
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setFormData({ ...formData, image: null })
  }

  const handleDelete = async () => {
    setSubmitting(true)

    try {
      const result = await removeCategory(categoryToDelete._id)

      if (result.success) {
        toast({
          title: "Başarılı",
          description: result.message || "Kategori silindi",
        })
        setDeleteDialogOpen(false)
        setCategoryToDelete(null)
      } else {
        toast({
          variant: "destructive",
          title: "Hata",
          description: result.message || "Kategori silinemedi",
        })
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Beklenmeyen bir hata oluştu",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const openDeleteDialog = (category) => {
    setCategoryToDelete(category)
    setDeleteDialogOpen(true)
  }

  const handleToggleActive = async (category) => {
    try {
      const result = await toggleCategoryActive(category._id)

      if (result.success) {
        toast({
          title: "Güncellendi",
          description: result.message || `Kategori ${category.active ? "pasif" : "aktif"} yapıldı`,
        })
      } else {
        toast({
          variant: "destructive",
          title: "Hata",
          description: result.message || "Durum değiştirilemedi",
        })
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Beklenmeyen bir hata oluştu",
      })
    }
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
                onClick={refresh}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Yenile
              </Button>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={() => {
                    setEditingCategory(null)
                    setFormData({ name: "", description: "", image: null, metaTitle: "", metaDescription: "", keywords: "", active: true })
                    setImageFile(null)
                    setImagePreview(null)
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
                    <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                      <div className="space-y-2">
                        <Label htmlFor="name">Kategori Adı *</Label>
                        <Input
                          id="name"
                          placeholder="Örn: Tulumbalar"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          disabled={submitting}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Açıklama</Label>
                        <Textarea
                          id="description"
                          placeholder="Kategori açıklaması..."
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          disabled={submitting}
                          rows={2}
                        />
                      </div>

                      {/* Image Upload */}
                      <div className="space-y-2">
                        <Label>Kategori Görseli</Label>
                        {imagePreview ? (
                          <div className="relative inline-block">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-32 h-32 object-cover rounded border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-0 right-0"
                              onClick={removeImage}
                              disabled={submitting}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed rounded-lg p-4 hover:border-primary transition-colors">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                              disabled={submitting}
                              className="hidden"
                              id="category-image"
                            />
                            <label
                              htmlFor="category-image"
                              className="flex flex-col items-center gap-2 cursor-pointer"
                            >
                              <Upload className="h-8 w-8 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Görsel Yükle</span>
                            </label>
                          </div>
                        )}
                      </div>

                      {/* SEO Fields */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3">SEO Ayarları</h4>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor="metaTitle">Meta Title</Label>
                            <Input
                              id="metaTitle"
                              placeholder="SEO başlığı (max 60 karakter)"
                              value={formData.metaTitle}
                              onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                              disabled={submitting}
                              maxLength={60}
                            />
                            <p className="text-xs text-muted-foreground">
                              {formData.metaTitle.length}/60
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="metaDescription">Meta Description</Label>
                            <Textarea
                              id="metaDescription"
                              placeholder="SEO açıklaması (max 160 karakter)"
                              value={formData.metaDescription}
                              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                              disabled={submitting}
                              maxLength={160}
                              rows={2}
                            />
                            <p className="text-xs text-muted-foreground">
                              {formData.metaDescription.length}/160
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="keywords">Anahtar Kelimeler</Label>
                            <Input
                              id="keywords"
                              placeholder="kelime1, kelime2, kelime3"
                              value={formData.keywords}
                              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                              disabled={submitting}
                            />
                            <p className="text-xs text-muted-foreground">
                              Virgülle ayırarak girin
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={submitting}>
                        İptal
                      </Button>
                      <Button type="submit" disabled={submitting}>
                        {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        {editingCategory ? "Güncelle" : "Ekle"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="pt-6">
                <p className="text-sm text-red-900">
                  <strong>Hata:</strong> {error}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Categories Table */}
          <Card>
            <CardHeader>
              <CardTitle>Kategoriler ({categories.length})</CardTitle>
              <CardDescription>Veritabanındaki tüm ürün kategorileri</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-semibold">Yükleniyor...</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Kategoriler getiriliyor
                  </p>
                </div>
              ) : categories.length === 0 ? (
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
                      <TableHead>Görsel</TableHead>
                      <TableHead>Kategori Adı</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Açıklama</TableHead>
                      <TableHead>SEO</TableHead>
                      <TableHead>Ürün Sayısı</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category._id}>
                        <TableCell>
                          {category.image ? (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                              <FolderTree className="h-6 w-6" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="text-muted-foreground text-sm font-mono">
                          {category.slug}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {category.description || "-"}
                        </TableCell>
                        <TableCell>
                          {category.metaTitle || category.metaDescription ? (
                            <Badge variant="outline" className="bg-green-50">✓ SEO</Badge>
                          ) : (
                            <Badge variant="secondary">- SEO</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {category.productCount || 0} ürün
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={category.active ? "default" : "secondary"}
                            className="cursor-pointer"
                            onClick={() => handleToggleActive(category)}
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
                              disabled={category.productCount > 0}
                              title={category.productCount > 0 ? "Bu kategoriye ait ürünler var" : "Kategoriyi sil"}
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
              <strong>{categoryToDelete?.name}</strong> kategorisi kalıcı olarak silinecektir.
              {categoryToDelete?.productCount > 0 && (
                <span className="text-destructive font-medium">
                  {" "}Bu kategoriye ait {categoryToDelete.productCount} ürün var. Önce ürünleri başka kategoriye taşıyın.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={submitting || (categoryToDelete?.productCount > 0)}
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  )
}
