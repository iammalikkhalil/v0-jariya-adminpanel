"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  CheckCircle, 
  XCircle, 
  BookOpen, 
  Calendar, 
  Hash,
  Globe,
  Languages,
  Info,
  Database,
  Clock,
  Trash2,
  AlertTriangle
} from "lucide-react"
import { type ZikrTranslation } from "@/lib/api/translation"

interface ZikrTranslationViewProps {
  translation: ZikrTranslation
}

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "ur", name: "Urdu" },
  { code: "ar", name: "Arabic" },
  { code: "tr", name: "Turkish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "es", name: "Spanish" },
  { code: "id", name: "Indonesian" },
  { code: "ms", name: "Malay" },
  { code: "bn", name: "Bengali" },
]

export function ZikrTranslationView({ translation }: ZikrTranslationViewProps) {
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

  const getLanguageName = (code: string) => {
    return LANGUAGES.find((lang) => lang.code === code)?.name || code
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
                {getLanguageName(translation.languageCode)} Translation
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                {translation.languageCode.toUpperCase()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {translation.isDeleted ? (
                <Badge variant="destructive" className="text-xs">
                  <Trash2 className="h-3 w-3 mr-1" />
                  Deleted
                </Badge>
              ) : (
                <Badge variant="default" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Translation Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Translation Content
          </CardTitle>
          <CardDescription>Translation text and language information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Translation Text */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <h3 className="text-lg font-semibold">Translation Text (translation)</h3>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-lg leading-relaxed">
                {translation.translation}
              </p>
            </div>
          </div>

          <Separator />

          {/* Language Information */}
          <div className="space-y-1">
            <FieldRow 
              label="Language Code (languageCode)" 
              value={translation.languageCode} 
              icon={Languages} 
            />
            <FieldRow 
              label="Language Name" 
              value={getLanguageName(translation.languageCode)} 
              icon={Info} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Related Zikr Information */}
      {translation.zikr && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Related Zikr
            </CardTitle>
            <CardDescription>Source zikr information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Arabic Text */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Arabic Text</h4>
                <div className="bg-muted/30 p-3 rounded-lg">
                  <p className="font-islamic text-right leading-relaxed" dir="rtl">
                    {translation.zikr.textAr}
                  </p>
                </div>
              </div>

              {/* Titles */}
              {(translation.zikr.titleEn || translation.zikr.titleUr) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {translation.zikr.titleEn && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">English Title</h4>
                      <p className="text-sm">{translation.zikr.titleEn}</p>
                    </div>
                  )}
                  {translation.zikr.titleUr && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">Urdu Title</h4>
                      <p className="text-sm">{translation.zikr.titleUr}</p>
                    </div>
                  )}
                </div>
              )}

              <FieldRow 
                label="Zikr ID (zikrId)" 
                value={translation.zikrId} 
                icon={Database} 
              />
            </div>
          </CardContent>
        </Card>
      )}

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
              label="Translation ID (id)" 
              value={translation.id} 
              icon={Database} 
            />
            <FieldRow 
              label="Created At (createdAt)" 
              value={translation.createdAt} 
              icon={Clock} 
              type="date"
            />
            <FieldRow 
              label="Updated At (updatedAt)" 
              value={translation.updatedAt} 
              icon={Clock} 
              type="date"
            />
            <FieldRow 
              label="Is Deleted (isDeleted)" 
              value={translation.isDeleted} 
              icon={Trash2} 
              type="boolean"
            />
            <FieldRow 
              label="Deleted At (deletedAt)" 
              value={translation.deletedAt} 
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
              <div className="text-2xl font-bold text-primary">{translation.translation.length}</div>
              <div className="text-muted-foreground">Characters</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">
                {translation.translation.split(' ').length}
              </div>
              <div className="text-muted-foreground">Words</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {translation.languageCode.toUpperCase()}
              </div>
              <div className="text-muted-foreground">Language</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">
                {translation.isDeleted ? 0 : 1}
              </div>
              <div className="text-muted-foreground">Status</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
