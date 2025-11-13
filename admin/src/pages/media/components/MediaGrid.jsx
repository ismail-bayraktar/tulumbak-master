import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  MoreVertical,
  Trash2,
  Download,
  Eye,
  Copy,
  Image as ImageIcon,
  FileText,
  Video,
  File
} from "lucide-react"

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

// Get file icon based on mimetype
const getFileIcon = (mimetype) => {
  if (mimetype?.startsWith('image/')) return ImageIcon
  if (mimetype?.startsWith('video/')) return Video
  if (mimetype?.includes('pdf') || mimetype?.includes('document')) return FileText
  return File
}

// Format file size
const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

// Get full URL
const getMediaUrl = (media) => {
  if (!media) return ''
  const url = media.secureUrl || media.url
  return url?.startsWith('http') ? url : `${backendUrl}${url}`
}

export function MediaGrid({ media, viewMode, loading, onDelete, pagination, onPageChange }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  if (!media || media.length === 0) {
    return (
      <div className="text-center py-12">
        <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Medya bulunamadı</h3>
        <p className="text-sm text-muted-foreground">
          Yükle sekmesinden medya ekleyebilirsiniz
        </p>
      </div>
    )
  }

  // Grid View
  if (viewMode === "grid") {
    return (
      <>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map((item) => {
            const FileIcon = getFileIcon(item.mimetype)
            const isImage = item.mimetype?.startsWith('image/')

            return (
              <Card key={item.id} className="group hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="relative aspect-square bg-muted rounded-t-lg overflow-hidden">
                    {isImage ? (
                      <img
                        src={getMediaUrl(item)}
                        alt={item.alt || item.originalName}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileIcon className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => window.open(getMediaUrl(item), '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(getMediaUrl(item))}>
                            <Copy className="h-4 w-4 mr-2" />
                            URL Kopyala
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            İndir
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => onDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Sil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Category Badge */}
                    <Badge variant="secondary" className="absolute top-2 left-2 text-xs">
                      {item.category}
                    </Badge>
                  </div>

                  <div className="p-2 space-y-1">
                    <p className="text-xs font-medium truncate" title={item.originalName}>
                      {item.originalName}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatFileSize(item.size)}</span>
                      {item.width && item.height && (
                        <span>{item.width}×{item.height}</span>
                      )}
                    </div>
                    {(item.views > 0 || item.downloads > 0) && (
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        {item.views > 0 && <span>👁️ {item.views}</span>}
                        {item.downloads > 0 && <span>⬇️ {item.downloads}</span>}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => pagination.hasPrev && onPageChange(pagination.page - 1)}
                  className={!pagination.hasPrev ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              {[...Array(pagination.pages)].map((_, i) => {
                const page = i + 1
                // Show first page, last page, current page, and pages around current
                if (
                  page === 1 ||
                  page === pagination.pages ||
                  (page >= pagination.page - 1 && page <= pagination.page + 1)
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => onPageChange(page)}
                        isActive={page === pagination.page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                } else if (page === pagination.page - 2 || page === pagination.page + 2) {
                  return <span key={page} className="px-2">...</span>
                }
                return null
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => pagination.hasNext && onPageChange(pagination.page + 1)}
                  className={!pagination.hasNext ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </>
    )
  }

  // List View
  return (
    <>
      <div className="space-y-2">
        {media.map((item) => {
          const FileIcon = getFileIcon(item.mimetype)
          const isImage = item.mimetype?.startsWith('image/')

          return (
            <Card key={item.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 flex-shrink-0 bg-muted rounded overflow-hidden">
                    {isImage ? (
                      <img
                        src={getMediaUrl(item)}
                        alt={item.alt || item.originalName}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.originalName}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <Badge variant="outline">{item.category}</Badge>
                      <span>{formatFileSize(item.size)}</span>
                      {item.width && item.height && (
                        <span>{item.width}×{item.height}</span>
                      )}
                      {item.views > 0 && <span>👁️ {item.views}</span>}
                      {item.downloads > 0 && <span>⬇️ {item.downloads}</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(getMediaUrl(item), '_blank')}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Görüntüle
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(getMediaUrl(item))}>
                          <Copy className="h-4 w-4 mr-2" />
                          URL Kopyala
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          İndir
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => onDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Sil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => pagination.hasPrev && onPageChange(pagination.page - 1)}
                className={!pagination.hasPrev ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>

            {[...Array(pagination.pages)].map((_, i) => {
              const page = i + 1
              if (
                page === 1 ||
                page === pagination.pages ||
                (page >= pagination.page - 1 && page <= pagination.page + 1)
              ) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => onPageChange(page)}
                      isActive={page === pagination.page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              } else if (page === pagination.page - 2 || page === pagination.page + 2) {
                return <span key={page} className="px-2">...</span>
              }
              return null
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => pagination.hasNext && onPageChange(pagination.page + 1)}
                className={!pagination.hasNext ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  )
}
