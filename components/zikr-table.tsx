"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  CheckCircle, 
  Edit, 
  Search, 
  Trash2, 
  XCircle, 
  Filter,
  Eye,
  Download,
  RefreshCw
} from "lucide-react"
import { deleteZikr, type Zikr } from "@/lib/api/zikr"

interface ZikrTableProps {
  zikrs: Zikr[]
  onZikrDeleted: (id: string) => void
  onRefresh?: () => void
  isLoading?: boolean
}

type FilterType = 'all' | 'verified' | 'unverified' | 'quran' | 'hadith'
type SortField = 'titleEn' | 'createdAt' | 'updatedAt'
type SortDirection = 'asc' | 'desc'

export function ZikrTable({ zikrs, onZikrDeleted, onRefresh, isLoading = false }: ZikrTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterType>('all')
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [showFilters, setShowFilters] = useState(false)

  // Enhanced filtering and sorting
  const filteredAndSortedZikrs = useMemo(() => {
    let filtered = zikrs.filter((zikr) => {
      // Search filter - Fixed property names
      const searchMatch = !searchTerm || 
        (zikr.textAr || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (zikr.titleEn || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (zikr.titleUr || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (zikr.transliteration || "").toLowerCase().includes(searchTerm.toLowerCase())

      if (!searchMatch) return false

      // Status filter - Fixed property names
      switch (filter) {
        case 'verified':
          return zikr.isVerified
        case 'unverified':
          return !zikr.isVerified
        case 'quran':
          return zikr.isQuran
        case 'hadith':
          return zikr.isHadith
        default:
          return true
      }
    })

    // Sort
    filtered.sort((a, b) => {
      let aVal: string | Date
      let bVal: string | Date

      switch (sortField) {
        case 'titleEn':
          aVal = (a.titleEn || '').toLowerCase()
          bVal = (b.titleEn || '').toLowerCase()
          break
        case 'createdAt':
          aVal = new Date(a.createdAt)
          bVal = new Date(b.createdAt)
          break
        case 'updatedAt':
          aVal = new Date(a.updatedAt)
          bVal = new Date(b.updatedAt)
          break
        default:
          return 0
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [zikrs, searchTerm, filter, sortField, sortDirection])

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const response = await deleteZikr(id)
      if (response.success) {
        onZikrDeleted(id)
      } else {
        alert(response.message || "Failed to delete zikr")
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert("Network error occurred")
    } finally {
      setDeletingId(null)
    }
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const exportToCSV = () => {
    const headers = ['ID', 'Arabic Text', 'English Title', 'Urdu Title', 'Transliteration', 'Source', 'Verified', 'Created At']
    const csvData = [
      headers,
      ...filteredAndSortedZikrs.map(zikr => [
        zikr.id,
        zikr.textAr,
        zikr.titleEn || '',
        zikr.titleUr || '',
        zikr.transliteration || '',
        [zikr.isQuran && 'Quran', zikr.isHadith && 'Hadith'].filter(Boolean).join(', '),
        zikr.isVerified ? 'Yes' : 'No',
        new Date(zikr.createdAt).toLocaleDateString()
      ])
    ]

    const csvContent = csvData.map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `zikrs-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const stats = useMemo(() => ({
    total: zikrs.length,
    verified: zikrs.filter(z => z.isVerified).length,
    pending: zikrs.filter(z => !z.isVerified).length,
    quran: zikrs.filter(z => z.isQuran).length,
    hadith: zikrs.filter(z => z.isHadith).length,
  }), [zikrs])

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-card border rounded-lg p-3">
          <div className="text-2xl font-bold text-primary">{stats.total}</div>
          <div className="text-xs text-muted-foreground">Total Zikrs</div>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
          <div className="text-xs text-muted-foreground">Verified</div>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-xs text-muted-foreground">Pending</div>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <div className="text-2xl font-bold text-blue-600">{stats.quran}</div>
          <div className="text-xs text-muted-foreground">Quran</div>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <div className="text-2xl font-bold text-purple-600">{stats.hadith}</div>
          <div className="text-xs text-muted-foreground">Hadith</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search zikrs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Filters Toggle */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="shrink-0"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {onRefresh && (
            <Button
              variant="outline"
              onClick={onRefresh}
              disabled={isLoading}
              className="shrink-0"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={exportToCSV}
            disabled={filteredAndSortedZikrs.length === 0}
            className="shrink-0"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <Link href="/admin/zikrs/add">
            <Button>Add New Zikr</Button>
          </Link>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-card border rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={filter} onValueChange={(value: FilterType) => setFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="verified">Verified Only</SelectItem>
                  <SelectItem value="unverified">Unverified Only</SelectItem>
                  <SelectItem value="quran">Quran Only</SelectItem>
                  <SelectItem value="hadith">Hadith Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Field */}
            <div>
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <Select value={sortField} onValueChange={(value: SortField) => setSortField(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                  <SelectItem value="updatedAt">Updated Date</SelectItem>
                  <SelectItem value="titleEn">English Title</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Direction */}
            <div>
              <label className="text-sm font-medium mb-2 block">Order</label>
              <Select value={sortDirection} onValueChange={(value: SortDirection) => setSortDirection(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm('')
              setFilter('all')
              setSortField('createdAt')
              setSortDirection('desc')
            }}
          >
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">ID</TableHead>
              <TableHead>Arabic Text</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('titleEn')}
              >
                English Title {sortField === 'titleEn' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('createdAt')}
              >
                Created {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="w-40">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedZikrs.length > 0 ? (
              filteredAndSortedZikrs.map((zikr) => (
                <TableRow key={zikr.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-xs">{zikr.id.slice(0, 8)}</TableCell>
                  <TableCell>
                    <div className="font-islamic text-right max-w-xs truncate" dir="rtl">
                      {zikr.textAr}
                    </div>
                    {zikr.transliteration && (
                      <div className="text-xs text-muted-foreground mt-1 max-w-xs truncate">
                        {zikr.transliteration}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">{zikr.titleEn || "-"}</div>
                    {zikr.titleUr && (
                      <div className="text-xs text-muted-foreground mt-1 max-w-xs truncate">
                        {zikr.titleUr}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {zikr.isQuran && (
                        <Badge variant="secondary" className="text-xs">
                          Quran
                        </Badge>
                      )}
                      {zikr.isHadith && (
                        <Badge variant="outline" className="text-xs">
                          Hadith
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {zikr.isVerified ? (
                        <Badge variant="default" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          <XCircle className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-muted-foreground">
                      {new Date(zikr.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/zikrs/view/${zikr.id}`}>
                        <Button variant="outline" size="sm" title="View Details">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/zikrs/edit/${zikr.id}`}>
                        <Button variant="outline" size="sm" title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={deletingId === zikr.id}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Zikr</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this zikr? This action cannot be undone.
                              <div className="mt-2 p-2 bg-muted rounded text-sm">
                                <strong>Arabic:</strong> {zikr.textAr.substring(0, 50)}...
                                {zikr.titleEn && (
                                  <>
                                    <br />
                                    <strong>Title:</strong> {zikr.titleEn}
                                  </>
                                )}
                              </div>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(zikr.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {searchTerm || filter !== 'all' ? 
                    "No zikrs found matching your filters." : 
                    "No zikrs found."
                  }
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results Summary */}
      {filteredAndSortedZikrs.length > 0 && (
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>
            Showing {filteredAndSortedZikrs.length} of {zikrs.length} zikrs
          </span>
          {(searchTerm || filter !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('')
                setFilter('all')
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      )}
    </div>
  )
}