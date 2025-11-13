import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, X, ImageIcon, FileText, Video, File, CloudUpload } from "lucide-react"
import { mediaAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

const CATEGORIES = [
  { value: "general", label: "Genel" },
  { value: "products", label: "Ürünler" },
  { value: "sliders", label: "Slider/Banner" },
  { value: "blogs", label: "Blog" },
  { value: "pages", label: "Sayfalar" },
  { value: "categories", label: "Kategoriler" },
  { value: "users", label: "Kullanıcılar" },
  { value: "settings", label: "Ayarlar" },
]

const getFileIcon = (file) => {
  if (file.type.startsWith('image/')) return ImageIcon
  if (file.type.startsWith('video/')) return Video
  if (file.type.includes('pdf') || file.type.includes('document')) return FileText
  return File
}

export function MediaUpload({ onSuccess }) {
  const { toast } = useToast()
  const [files, setFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [category, setCategory] = useState("general")
  const [metadata, setMetadata] = useState({
    title: "",
    alt: "",
    description: "",
    tags: "",
  })

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  // Handle drop
  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }, [])

  // Handle file selection
  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files)
    handleFiles(selectedFiles)
  }

  // Process files
  const handleFiles = (newFiles) => {
    const validFiles = newFiles.filter((file) => {
      // Check file type
      const allowedTypes = /\.(jpg|jpeg|png|gif|webp|pdf|doc|docx|txt|mp4|avi|mov)$/i
      if (!allowedTypes.test(file.name)) {
        toast({
          title: "Geçersiz dosya tipi",
          description: `${file.name} desteklenmiyor`,
          variant: "destructive",
        })
        return false
      }

      // Check file size (50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "Dosya çok büyük",
          description: `${file.name} maksimum 50MB olabilir`,
          variant: "destructive",
        })
        return false
      }

      return true
    })

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles])
    }
  }

  // Remove file
  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // Upload files
  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "Dosya seçilmedi",
        description: "Lütfen en az bir dosya seçin",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()

      // Single or bulk upload
      if (files.length === 1) {
        formData.append("file", files[0])
        formData.append("category", category)
        formData.append("folder", category)
        if (metadata.title) formData.append("title", metadata.title)
        if (metadata.alt) formData.append("alt", metadata.alt)
        if (metadata.description) formData.append("description", metadata.description)
        if (metadata.tags) formData.append("tags", metadata.tags)

        const response = await mediaAPI.upload(formData)

        if (response.data.success) {
          toast({
            title: "Başarılı",
            description: "Medya başarıyla yüklendi",
          })
          setFiles([])
          setMetadata({ title: "", alt: "", description: "", tags: "" })
          onSuccess()
        }
      } else {
        // Bulk upload
        files.forEach((file) => {
          formData.append("files", file)
        })
        formData.append("category", category)
        formData.append("folder", category)

        const response = await mediaAPI.bulkUpload(formData)

        if (response.data.success) {
          toast({
            title: "Başarılı",
            description: `${files.length} medya başarıyla yüklendi`,
          })
          setFiles([])
          onSuccess()
        }
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Yükleme hatası",
        description: error.response?.data?.message || "Medya yüklenemedi",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medya Yükle</CardTitle>
        <CardDescription>
          Tek veya birden fazla dosya yükleyin (Maks: 50MB, Format: JPG, PNG, GIF, WebP, PDF, DOC, MP4)
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Drag & Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <CloudUpload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">Dosyaları buraya sürükleyin</p>
          <p className="text-sm text-muted-foreground mb-4">veya</p>
          <Button variant="outline" onClick={() => document.getElementById("fileInput").click()}>
            <Upload className="w-4 h-4 mr-2" />
            Dosya Seç
          </Button>
          <input
            id="fileInput"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileInput}
            accept="image/*,.pdf,.doc,.docx,.txt,video/*"
          />
        </div>

        {/* Selected Files */}
        {files.length > 0 && (
          <div className="space-y-2">
            <Label>Seçilen Dosyalar ({files.length})</Label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {files.map((file, index) => {
                const FileIcon = getFileIcon(file)
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                  >
                    <FileIcon className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                      disabled={uploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Category */}
        <div className="space-y-2">
          <Label>Kategori</Label>
          <Select value={category} onValueChange={setCategory} disabled={uploading}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Metadata (only for single file) */}
        {files.length === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Başlık</Label>
              <Input
                value={metadata.title}
                onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                disabled={uploading}
                placeholder="Dosya başlığı"
              />
            </div>

            <div className="space-y-2">
              <Label>Alt Metni (SEO)</Label>
              <Input
                value={metadata.alt}
                onChange={(e) => setMetadata({ ...metadata, alt: e.target.value })}
                disabled={uploading}
                placeholder="Resim açıklaması"
              />
            </div>

            <div className="space-y-2">
              <Label>Açıklama</Label>
              <Textarea
                value={metadata.description}
                onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                disabled={uploading}
                placeholder="Medya açıklaması"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Etiketler (virgülle ayırın)</Label>
              <Input
                value={metadata.tags}
                onChange={(e) => setMetadata({ ...metadata, tags: e.target.value })}
                disabled={uploading}
                placeholder="etiket1, etiket2, etiket3"
              />
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Yükleniyor...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} />
          </div>
        )}

        {/* Upload Button */}
        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "Yükleniyor..." : `Yükle (${files.length})`}
          </Button>
          {files.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setFiles([])}
              disabled={uploading}
            >
              Temizle
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
