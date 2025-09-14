"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { type ZikrQuality } from "@/lib/api/quality"

interface ZikrQualityViewProps {
  quality: ZikrQuality
}

function FieldRow({ label, value, isArabic = false }: { 
  label: string
  value: string | React.ReactNode
  isArabic?: boolean 
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-3">
      <div className="text-sm font-medium text-muted-foreground">{label}</div>
      <div className={`md:col-span-2 ${isArabic ? 'font-islamic text-right' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
        {value}
      </div>
    </div>
  )
}

export function ZikrQualityView({ quality }: ZikrQualityViewProps) {
  return (
    <div className="space-y-6">
      {/* Main Information */}
      <Card>
        <CardHeader>
          <CardTitle className="font-islamic">Quality Information</CardTitle>
          <CardDescription>
            Details about this zikr quality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldRow 
            label="Quality ID" 
            value={<code className="text-xs bg-muted px-2 py-1 rounded">{quality.id}</code>} 
          />
          
          <Separator />
          
          <FieldRow 
            label="Quality Text" 
            value={
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm leading-relaxed">{quality.text}</p>
              </div>
            } 
          />
          
          <Separator />
          
          <FieldRow 
            label="Status" 
            value={
              <Badge variant={quality.isDeleted ? "destructive" : "default"}>
                {quality.isDeleted ? "Deleted" : "Active"}
              </Badge>
            } 
          />
        </CardContent>
      </Card>

      {/* Associated Zikr */}
      {quality.zikr && (
        <Card>
          <CardHeader>
            <CardTitle className="font-islamic">Associated Zikr</CardTitle>
            <CardDescription>
              The zikr this quality is associated with
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FieldRow 
              label="Zikr ID" 
              value={<code className="text-xs bg-muted px-2 py-1 rounded">{quality.zikrId}</code>} 
            />
            
            <Separator />
            
            <FieldRow 
              label="Arabic Text" 
              value={
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="font-islamic text-right leading-relaxed" dir="rtl">
                    {quality.zikr.textAr}
                  </p>
                </div>
              } 
              isArabic={true}
            />
            
            {quality.zikr.titleEn && (
              <>
                <Separator />
                <FieldRow 
                  label="English Title"
                  value={quality.zikr.titleEn}
                />
              </>
            )}
            
            {quality.zikr.titleUr && (
              <>
                <Separator />
                <FieldRow 
                  label="Urdu Title"
                  value={
                    <div className="text-right" dir="rtl">
                      {quality.zikr.titleUr}
                    </div>
                  }
                />
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>
            Metadata about this quality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldRow 
            label="Created At" 
            value={new Date(quality.createdAt).toLocaleString()} 
          />
          
          <Separator />
          
          <FieldRow 
            label="Updated At" 
            value={new Date(quality.updatedAt).toLocaleString()} 
          />
          
          {quality.isDeleted && quality.deletedAt && (
            <>
              <Separator />
              <FieldRow 
                label="Deleted At" 
                value={new Date(quality.deletedAt).toLocaleString()} 
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
