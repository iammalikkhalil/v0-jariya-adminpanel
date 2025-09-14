"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Award, Star, Plus } from "lucide-react"

export default function RewardsQualitiesPage() {
  const [selectedZikr, setSelectedZikr] = useState("")

  return (
    <AuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-islamic text-primary mb-2">Rewards & Qualities</h1>
            <p className="text-muted-foreground">Manage spiritual rewards and qualities associated with zikrs</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Zikr Selection */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="font-islamic">Select Zikr</CardTitle>
                <CardDescription>Choose a zikr to manage its rewards and qualities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="zikr-select">Zikr</Label>
                    <Select value={selectedZikr} onValueChange={setSelectedZikr}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a zikr" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">
                          <div className="flex items-center gap-2">
                            <span className="font-islamic text-right" dir="rtl">
                              سُبْحَانَ اللَّهِ وَبِحَمْدِهِ
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem value="2">
                          <div className="flex items-center gap-2">
                            <span className="font-islamic text-right" dir="rtl">
                              لَا إِلَهَ إِلَّا اللَّهُ
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem value="3">
                          <div className="flex items-center gap-2">
                            <span className="font-islamic text-right" dir="rtl">
                              اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ
                            </span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedZikr && (
                    <div className="p-4 bg-accent rounded-lg">
                      <div className="font-islamic text-right mb-2" dir="rtl">
                        سُبْحَانَ اللَّهِ وَبِحَمْدِهِ
                      </div>
                      <div className="text-sm text-muted-foreground">Glory be to Allah and praise be to Him</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Rewards & Qualities Management */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="font-islamic">Manage Rewards & Qualities</CardTitle>
                <CardDescription>Add and manage spiritual benefits</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedZikr ? (
                  <Tabs defaultValue="rewards" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="rewards">Rewards</TabsTrigger>
                      <TabsTrigger value="qualities">Qualities</TabsTrigger>
                    </TabsList>

                    <TabsContent value="rewards" className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Spiritual Rewards</h3>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Reward
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {[
                          "Paradise tree planted for each recitation",
                          "Sins forgiven with sincere recitation",
                          "Protection from evil and harm",
                        ].map((reward, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Award className="h-4 w-4 text-secondary" />
                              <span>{reward}</span>
                            </div>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4 pt-4 border-t">
                        <h4 className="font-medium">Add New Reward</h4>
                        <div className="space-y-2">
                          <Label htmlFor="reward-text">Reward Description</Label>
                          <Textarea id="reward-text" placeholder="Enter the spiritual reward or benefit" rows={3} />
                        </div>
                        <Button>Add Reward</Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="qualities" className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Spiritual Qualities</h3>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Quality
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {[
                          "Increases faith and devotion",
                          "Brings peace to the heart",
                          "Strengthens connection with Allah",
                        ].map((quality, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Star className="h-4 w-4 text-primary" />
                              <span>{quality}</span>
                            </div>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4 pt-4 border-t">
                        <h4 className="font-medium">Add New Quality</h4>
                        <div className="space-y-2">
                          <Label htmlFor="quality-text">Quality Description</Label>
                          <Textarea
                            id="quality-text"
                            placeholder="Enter the spiritual quality or characteristic"
                            rows={3}
                          />
                        </div>
                        <Button>Add Quality</Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a zikr to manage its rewards and qualities</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
