"use client"

import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Award, Star, Plus, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function RewardsQualitiesPage() {
  return (
    <AuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-islamic text-primary mb-2">Rewards & Qualities</h1>
            <p className="text-muted-foreground">Manage spiritual rewards and qualities associated with zikrs</p>
          </div>

          <Tabs defaultValue="rewards" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="rewards">Zikr Rewards</TabsTrigger>
              <TabsTrigger value="qualities">Zikr Qualities</TabsTrigger>
            </TabsList>

            <TabsContent value="rewards" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="font-islamic flex items-center gap-2">
                        <Award className="h-5 w-5 text-secondary" />
                        Zikr Rewards
                      </CardTitle>
                      <CardDescription>
                        Manage spiritual rewards and benefits associated with zikrs
                      </CardDescription>
                    </div>
                    <Link href="/admin/rewards-qualities/rewards">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Manage Rewards
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-4 w-4 text-secondary" />
                        <h3 className="font-medium">Add New Reward</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Create spiritual rewards for zikrs
                      </p>
                      <Link href="/admin/rewards-qualities/rewards/add">
                        <Button size="sm" className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Reward
                        </Button>
                      </Link>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-4 w-4 text-primary" />
                        <h3 className="font-medium">View All Rewards</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Browse and manage existing rewards
                      </p>
                      <Link href="/admin/rewards-qualities/rewards">
                        <Button size="sm" variant="outline" className="w-full">
                          View Rewards
                        </Button>
                      </Link>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-medium">Quick Stats</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Track reward management activity
                      </p>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Coming soon...
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="qualities" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="font-islamic flex items-center gap-2">
                        <Star className="h-5 w-5 text-primary" />
                        Zikr Qualities
                      </CardTitle>
                      <CardDescription>
                        Manage spiritual qualities and characteristics of zikrs
                      </CardDescription>
                    </div>
                    <Link href="/admin/rewards-qualities/qualities">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Manage Qualities
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-4 w-4 text-primary" />
                        <h3 className="font-medium">Add New Quality</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Create spiritual qualities for zikrs
                      </p>
                      <Link href="/admin/rewards-qualities/qualities/add">
                        <Button size="sm" className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Quality
                        </Button>
                      </Link>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-4 w-4 text-secondary" />
                        <h3 className="font-medium">View All Qualities</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Browse and manage existing qualities
                      </p>
                      <Link href="/admin/rewards-qualities/qualities">
                        <Button size="sm" variant="outline" className="w-full">
                          View Qualities
                        </Button>
                      </Link>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-medium">Quick Stats</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Track quality management activity
                      </p>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Coming soon...
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
