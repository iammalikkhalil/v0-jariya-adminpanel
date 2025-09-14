'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { type Collection } from '@/lib/api/collection'

interface Props {
  collection: Collection
}

const FieldRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-3">
    <div className="text-sm font-medium text-muted-foreground">{label}</div>
    <div className="md:col-span-2">{value}</div>
  </div>
)

export const CollectionView: React.FC<Props> = ({ collection }) => {
  return (
    <div className="space-y-6">
      {/* Main Information */}
      <Card>
        <CardHeader>
          <CardTitle className="font-islamic">Collection Information</CardTitle>
          <CardDescription>Details about this collection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldRow
            label="Collection ID"
            value={<code className="text-xs bg-muted px-2 py-1 rounded">{collection.id}</code>}
          />

          <Separator />

          <FieldRow
            label="Title"
            value={
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm leading-relaxed">{collection.text}</p>
              </div>
            }
          />

          {collection.description && (
            <>
              <Separator />
              <FieldRow
                label="Description"
                value={
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm leading-relaxed">{collection.description}</p>
                  </div>
                }
              />
            </>
          )}

          <Separator />

          <FieldRow
            label="Featured"
            value={
              <Badge variant={collection.isFeatured ? 'default' : 'secondary'}>
                {collection.isFeatured ? 'Yes' : 'No'}
              </Badge>
            }
          />

          <Separator />

          <FieldRow label="Order Index" value={String(collection.orderIndex)} />

          <Separator />

          <FieldRow
            label="Status"
            value={
              <Badge variant={collection.isDeleted ? 'destructive' : 'default'}>
                {collection.isDeleted ? 'Deleted' : 'Active'}
              </Badge>
            }
          />
        </CardContent>
      </Card>

      {/* System Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Metadata about this collection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldRow label="Created At" value={new Date(collection.createdAt).toLocaleString()} />

          {collection.updatedAt && (
            <>
              <Separator />
              <FieldRow label="Updated At" value={new Date(collection.updatedAt).toLocaleString()} />
            </>
          )}

          {collection.isDeleted && collection.deletedAt && (
            <>
              <Separator />
              <FieldRow label="Deleted At" value={new Date(collection.deletedAt).toLocaleString()} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
