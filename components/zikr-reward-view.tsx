"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { type ZikrReward } from "@/lib/api/reward"

interface ZikrRewardViewProps {
  reward: ZikrReward
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

export function ZikrRewardView({ reward }: ZikrRewardViewProps) {
  return (
    <div className="space-y-6">
      {/* Main Information */}
      <Card>
        <CardHeader>
          <CardTitle className="font-islamic">Reward Information</CardTitle>
          <CardDescription>
            Details about this zikr reward
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldRow 
            label="Reward ID" 
            value={<code className="text-xs bg-muted px-2 py-1 rounded">{reward.id}</code>} 
          />
          
          <Separator />
          
          <FieldRow 
            label="Reward Text" 
            value={
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm leading-relaxed">{reward.text}</p>
              </div>
            } 
          />
          
          <Separator />
          
          <FieldRow 
            label="Status" 
            value={
              <Badge variant={reward.isDeleted ? "destructive" : "default"}>
                {reward.isDeleted ? "Deleted" : "Active"}
              </Badge>
            } 
          />
        </CardContent>
      </Card>

      {/* Associated Zikr */}
      {reward.zikr && (
        <Card>
          <CardHeader>
            <CardTitle className="font-islamic">Associated Zikr</CardTitle>
            <CardDescription>
              The zikr this reward is associated with
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FieldRow 
              label="Zikr ID" 
              value={<code className="text-xs bg-muted px-2 py-1 rounded">{reward.zikrId}</code>} 
            />
            
            <Separator />
            
            <FieldRow 
              label="Arabic Text" 
              value={
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="font-islamic text-right leading-relaxed" dir="rtl">
                    {reward.zikr.textAr}
                  </p>
                </div>
              } 
              isArabic={true}
            />
            
            {reward.zikr.titleEn && (
              <>
                <Separator />
                <FieldRow 
                  label="English Title"
                  value={reward.zikr.titleEn}
                />
              </>
            )}
            
            {reward.zikr.titleUr && (
              <>
                <Separator />
                <FieldRow 
                  label="Urdu Title"
                  value={
                    <div className="text-right" dir="rtl">
                      {reward.zikr.titleUr}
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
            Metadata about this reward
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldRow 
            label="Created At" 
            value={new Date(reward.createdAt).toLocaleString()} 
          />
          
          <Separator />
          
          <FieldRow 
            label="Updated At" 
            value={new Date(reward.updatedAt).toLocaleString()} 
          />
          
          {reward.isDeleted && reward.deletedAt && (
            <>
              <Separator />
              <FieldRow 
                label="Deleted At" 
                value={new Date(reward.deletedAt).toLocaleString()} 
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
