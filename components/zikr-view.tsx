"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  CheckCircle, 
  XCircle, 
  BookOpen, 
  FileText, 
  Calendar, 
  User, 
  Hash,
  Globe,
  Languages,
  Info,
  Database,
  Shield,
  Clock,
  Trash2,
  AlertTriangle
} from "lucide-react"
import { type Zikr } from "@/lib/api/zikr"

interface ZikrViewProps {
  zikr: Zikr
}

export function ZikrView({ zikr }: ZikrViewProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not available"
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getSourceBadges = () => {
    const badges = []
    if (zikr.isQuran) {
      badges.push(
        <Badge key="quran" variant="secondary" className="text-xs">
          <BookOpen className="h-3 w-3 mr-1" />
          Quran
        </Badge>
      )
    }
    if (zikr.isHadith) {
      badges.push(
        <Badge key="hadith" variant="outline" className="text-xs">
          <FileText className="h-3 w-3 mr-1" />
          Hadith
        </Badge>
      )
    }
    return badges
  }

  const FieldRow = ({ label, value, icon: Icon, type = "text" }: { 
    label: string, 
    value: any, 
    icon: any, 
    type?: "text" | "boolean" | "date" | "number" | "badge" 
  }) => {
    const formatValue = () => {
      if (value === null || value === undefined || value === "") {
        return <span className="text-muted-foreground italic">Not set</span>
      }
      
      switch (type) {
        case "boolean":
          return (
            <Badge variant={value ? "default" : "secondary"} className="text-xs">
              {value ? (
                <CheckCircle className="h-3 w-3 mr-1" />
              ) : (
                <XCircle className="h-3 w-3 mr-1" />
              )}
              {value ? "Yes" : "No"}
            </Badge>
          )
        case "date":
          return <span>{formatDate(value)}</span>
        case "number":
          return <span className="font-mono">{value.toLocaleString()}</span>
        case "badge":
          return value
        default:
          return <span>{value}</span>
      }
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-3 border-b border-border/50 last:border-b-0">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Icon className="h-4 w-4" />
          {label}
        </div>
        <div className="md:col-span-2">
          {formatValue()}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Status */}
      <Card className="border-l-4 border-l-primary">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-islamic text-primary">
                {zikr.titleEn || "Untitled Zikr"}
              </h1>
              {zikr.titleUr && (
                <p className="text-lg text-muted-foreground mt-1">{zikr.titleUr}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {zikr.isVerified ? (
                <Badge variant="default" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  <XCircle className="h-3 w-3 mr-1" />
                  Pending Verification
                </Badge>
              )}
              {zikr.isDeleted && (
                <Badge variant="destructive" className="text-xs">
                  <Trash2 className="h-3 w-3 mr-1" />
                  Deleted
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Content Information
          </CardTitle>
          <CardDescription>Main content and text fields</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Arabic Text */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <h3 className="text-lg font-semibold">Arabic Text (textAr)</h3>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="font-islamic text-2xl text-right leading-relaxed" dir="rtl">
                {zikr.textAr}
              </p>
            </div>
          </div>

          <Separator />

          {/* All Content Fields */}
          <div className="space-y-1">
            <FieldRow 
              label="English Title (titleEn)" 
              value={zikr.titleEn} 
              icon={Languages} 
            />
            <FieldRow 
              label="Urdu Title (titleUr)" 
              value={zikr.titleUr} 
              icon={Languages} 
            />
            <FieldRow 
              label="Transliteration (transliteration)" 
              value={zikr.transliteration} 
              icon={Languages} 
            />
            <FieldRow 
              label="Character Count (charCount)" 
              value={zikr.charCount} 
              icon={Hash} 
              type="number"
            />
          </div>
        </CardContent>
      </Card>

      {/* Source & Classification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Source & Classification
          </CardTitle>
          <CardDescription>Source information and categorization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <FieldRow 
              label="From Quran (isQuran)" 
              value={zikr.isQuran} 
              icon={BookOpen} 
              type="boolean"
            />
            <FieldRow 
              label="From Hadith (isHadith)" 
              value={zikr.isHadith} 
              icon={FileText} 
              type="boolean"
            />
            <FieldRow 
              label="Verified (isVerified)" 
              value={zikr.isVerified} 
              icon={Shield} 
              type="boolean"
            />
            <FieldRow 
              label="Verified By (verifiedByName)" 
              value={zikr.verifiedByName} 
              icon={User} 
            />
            <FieldRow 
              label="Verification Date (verifiedDate)" 
              value={zikr.verifiedDate} 
              icon={Calendar} 
              type="date"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notes & References */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Notes & References
          </CardTitle>
          <CardDescription>Additional information and references</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Quantity Notes (quantityNotes)</h4>
              <div className="bg-muted/30 p-3 rounded-lg min-h-[60px]">
                {zikr.quantityNotes ? (
                  <p className="text-sm whitespace-pre-wrap">{zikr.quantityNotes}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No quantity notes provided</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Source Notes (sourceNotes)</h4>
              <div className="bg-muted/30 p-3 rounded-lg min-h-[60px]">
                {zikr.sourceNotes ? (
                  <p className="text-sm whitespace-pre-wrap">{zikr.sourceNotes}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No source notes provided</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            System Metadata
          </CardTitle>
          <CardDescription>Technical information and timestamps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <FieldRow 
              label="Record ID (id)" 
              value={zikr.id} 
              icon={Database} 
            />
            <FieldRow 
              label="Created At (createdAt)" 
              value={zikr.createdAt} 
              icon={Clock} 
              type="date"
            />
            <FieldRow 
              label="Updated At (updatedAt)" 
              value={zikr.updatedAt} 
              icon={Clock} 
              type="date"
            />
            <FieldRow 
              label="Is Deleted (isDeleted)" 
              value={zikr.isDeleted} 
              icon={Trash2} 
              type="boolean"
            />
            <FieldRow 
              label="Deleted At (deletedAt)" 
              value={zikr.deletedAt} 
              icon={Trash2} 
              type="date"
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Summary */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4" />
            Data Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{zikr.charCount}</div>
              <div className="text-muted-foreground">Characters</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">
                {zikr.textAr.split(' ').length}
              </div>
              <div className="text-muted-foreground">Words</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {[zikr.isQuran, zikr.isHadith].filter(Boolean).length}
              </div>
              <div className="text-muted-foreground">Sources</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">
                {zikr.isVerified ? 1 : 0}
              </div>
              <div className="text-muted-foreground">Verified</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
