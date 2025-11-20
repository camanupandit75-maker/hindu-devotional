'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { User, CreditCard, BarChart3, Settings, Upload, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { mockUser, mockGenerations } from '@/lib/mock-data'
import { formatDistanceToNow } from 'date-fns'

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const user = mockUser
  const generations = mockGenerations

  const usageStats = {
    generationsUsed: user.usage.generationsUsed,
    generationsLimit: user.usage.generationsLimit,
    percentage: (user.usage.generationsUsed / user.usage.generationsLimit) * 100,
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
        <p className="text-text-secondary">
          Manage your account, subscription, and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="subscription">
            <CreditCard className="mr-2 h-4 w-4" />
            Subscription
          </TabsTrigger>
          <TabsTrigger value="usage">
            <BarChart3 className="mr-2 h-4 w-4" />
            Usage
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-2xl">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                    variant="secondary"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-text-secondary">{user.email}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Upload className="mr-2 h-4 w-4" />
                    Change Photo
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user.email} />
                </div>
              </div>

              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
              <CardDescription>Manage your subscription and billing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold capitalize">{user.subscription.plan}</span>
                    <Badge variant={user.subscription.status === 'active' ? 'success' : 'destructive'}>
                      {user.subscription.status}
                    </Badge>
                  </div>
                  {user.subscription.expiresAt && (
                    <p className="text-sm text-text-secondary">
                      Expires: {new Date(user.subscription.expiresAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <Button variant="outline">Manage Subscription</Button>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Billing History</h3>
                <div className="space-y-2">
                  {[
                    { date: '2024-01-01', amount: '$19.00', status: 'Paid' },
                    { date: '2023-12-01', amount: '$19.00', status: 'Paid' },
                    { date: '2023-11-01', amount: '$19.00', status: 'Paid' },
                  ].map((invoice, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{new Date(invoice.date).toLocaleDateString()}</p>
                        <p className="text-sm text-text-secondary">{invoice.status}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{invoice.amount}</p>
                        <Button variant="ghost" size="sm">Download</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full" asChild>
                  <a href="/pricing">Upgrade Plan</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Usage Tab */}
        <TabsContent value="usage" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Generation Usage</CardTitle>
                <CardDescription>Your current usage statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">This Month</span>
                    <span className="text-sm text-text-secondary">
                      {usageStats.generationsUsed} / {usageStats.generationsLimit}
                    </span>
                  </div>
                  <Progress value={usageStats.percentage} />
                </div>
                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-text-secondary">Total Creations</span>
                    <span className="font-medium">{user.usage.totalCreations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-text-secondary">Remaining</span>
                    <span className="font-medium">
                      {usageStats.generationsLimit - usageStats.generationsUsed}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest generations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {generations.slice(0, 5).map((generation) => (
                    <div
                      key={generation.id}
                      className="flex items-center justify-between p-2 rounded hover:bg-muted"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {generation.mantra.substring(0, 30)}...
                        </p>
                        <p className="text-xs text-text-secondary">
                          {formatDistanceToNow(new Date(generation.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      <Badge variant={generation.status === 'completed' ? 'completed' : 'pending'}>
                        {generation.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-text-secondary">
                      Receive email updates about your generations
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-text-secondary">
                      Receive updates about new features and templates
                    </p>
                  </div>
                  <input type="checkbox" className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Delete Account</h4>
                <p className="text-sm text-text-secondary mb-4">
                  Permanently delete your account and all associated data
                </p>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

