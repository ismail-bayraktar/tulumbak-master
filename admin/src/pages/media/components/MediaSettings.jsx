import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { CloudUpload, HardDrive, Settings, Save } from "lucide-react"
import { mediaAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function MediaSettings() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    useCloudinary: true,
    autoOptimize: true,
    generateResponsive: true,
    quality: 80,
    maxFileSize: 10485760, // 10MB
  })

  // Fetch settings
  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await mediaAPI.getSettings()
      if (response.data) {
        setSettings((prev) => ({
          ...prev,
          ...response.data,
        }))
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast({
        title: "Hata",
        description: "Ayarlar yüklenemedi",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Save settings
  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await mediaAPI.updateSettings(settings)
      if (response.data.success) {
        toast({
          title: "Başarılı",
          description: "Ayarlar kaydedildi",
        })
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Hata",
        description: "Ayarlar kaydedilemedi",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
            <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Storage Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudUpload className="h-5 w-5" />
            Depolama Ayarları
          </CardTitle>
          <CardDescription>
            Medya dosyalarının nasıl depolanacağını seçin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Cloudinary CDN Kullan</Label>
              <p className="text-sm text-muted-foreground">
                Cloudinary CDN üzerinden hızlı ve optimize edilmiş medya sunumu
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={settings.useCloudinary ? "default" : "secondary"}>
                {settings.useCloudinary ? "Aktif" : "Pasif"}
              </Badge>
              <Switch
                checked={settings.useCloudinary}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, useCloudinary: checked })
                }
              />
            </div>
          </div>

          {!settings.useCloudinary && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-start gap-3">
                <HardDrive className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Yerel Depolama</p>
                  <p className="text-xs text-muted-foreground">
                    Medya dosyaları sunucunuzda depolanacak. Sharp.js ile optimize edilecek.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Optimization Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Optimizasyon Ayarları
          </CardTitle>
          <CardDescription>
            Otomatik optimizasyon ve responsive görsel oluşturma
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Otomatik Optimizasyon</Label>
              <p className="text-sm text-muted-foreground">
                Yüklenen görseller otomatik olarak optimize edilsin
              </p>
            </div>
            <Switch
              checked={settings.autoOptimize}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, autoOptimize: checked })
              }
            />
          </div>

          {settings.autoOptimize && (
            <div className="space-y-4 pl-4 border-l-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Görsel Kalitesi</Label>
                  <Badge variant="outline">{settings.quality}%</Badge>
                </div>
                <Slider
                  value={[settings.quality]}
                  onValueChange={([value]) =>
                    setSettings({ ...settings, quality: value })
                  }
                  min={50}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Daha yüksek kalite = daha büyük dosya boyutu
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Responsive Görseller Oluştur</Label>
              <p className="text-sm text-muted-foreground">
                Farklı ekran boyutları için otomatik boyutlandırma (thumbnail, small, medium, large)
              </p>
            </div>
            <Switch
              checked={settings.generateResponsive}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, generateResponsive: checked })
              }
            />
          </div>

          {settings.generateResponsive && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="text-xs space-y-1">
                <p className="font-medium">Oluşturulacak Boyutlar:</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Thumbnail:</span>
                    <span>150×150</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Small:</span>
                    <span>400×400</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Medium:</span>
                    <span>800×800</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Large:</span>
                    <span>1200×1200</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Size Limit */}
      <Card>
        <CardHeader>
          <CardTitle>Dosya Boyutu Limiti</CardTitle>
          <CardDescription>Maksimum yükleme boyutu</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Maksimum Dosya Boyutu</Label>
              <Badge variant="outline">
                {(settings.maxFileSize / 1024 / 1024).toFixed(0)} MB
              </Badge>
            </div>
            <Slider
              value={[settings.maxFileSize / 1024 / 1024]}
              onValueChange={([value]) =>
                setSettings({ ...settings, maxFileSize: value * 1024 * 1024 })
              }
              min={1}
              max={50}
              step={1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={fetchSettings} disabled={saving}>
          Sıfırla
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </div>
    </div>
  )
}
