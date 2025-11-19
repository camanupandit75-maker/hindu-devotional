'use client'

export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { useMemo } from 'react'
import { Plus, Sparkles, Video, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/StatusBadge'
import { mockUser, mockGenerations } from '@/lib/mock-data'
import { formatDistanceToNow } from 'date-fns'
import { DevanagariText } from '@/components/DevanagariText'
import { EmptyState } from '@/components/EmptyState'

export default function DashboardPage() {
  const user = mockUser
  const generations = mockGenerations

  const stats = useMemo(() => {
    const completed = generations.filter(g => g.status === 'completed').length
    const processing = generations.filter(g => g.status === 'processing').length
    const failed = generations.filter(g => g.status === 'failed').length
    
    return {
      total: generations.length,
      completed,
      processing,
      failed,
    }
  }, [generations])

  const recentGenerations = generations.slice(0, 5)

  return (
    <div className="container py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user.name.split(' ')[0]}! 🙏
        </h1>
        <p className="text-text-secondary">
          Continue creating beautiful devotional content
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Generations Used</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.usage.generationsUsed}</div>
            <p className="text-xs text-muted-foreground">
              of {user.usage.generationsLimit} this month
            </p>
            <div className="mt-2 h-2 bg-secondary/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${(user.usage.generationsUsed / user.usage.generationsLimit) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Creations</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.usage.totalCreations}</div>
            <p className="text-xs text-muted-foreground">
              All time creations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription</CardTitle>
            <Badge variant="secondary" className="capitalize">
              {user.subscription.plan}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{user.subscription.plan}</div>
            <p className="text-xs text-muted-foreground">
              {user.subscription.status === 'active' ? 'Active' : 'Expired'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              {stats.processing > 0 && `${stats.processing} processing`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Start creating new content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/generate">
                <Plus className="mr-2 h-4 w-4" />
                Generate Mantra
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/templates">
                <Video className="mr-2 h-4 w-4" />
                Browse Templates
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/pricing">
                Upgrade Plan
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Generations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Generations</CardTitle>
          <CardDescription>Your latest devotional content creations</CardDescription>
        </CardHeader>
        <CardContent>
          {recentGenerations.length > 0 ? (
            <div className="space-y-4">
              {recentGenerations.map((generation) => (
                <Link
                  key={generation.id}
                  href={`/generation/${generation.id}`}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/5 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <DevanagariText className="text-lg font-medium">
                        {generation.mantra}
                      </DevanagariText>
                      <StatusBadge status={generation.status} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-text-secondary">
                      <span>{generation.language}</span>
                      <span>•</span>
                      <span>{generation.voiceStyle}</span>
                      <span>•</span>
                      <span>{generation.voice}</span>
                      <span>•</span>
                      <span>
                        {formatDistanceToNow(new Date(generation.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {generation.status === 'completed' && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                    {generation.status === 'processing' && (
                      <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                    )}
                    {generation.status === 'failed' && (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Sparkles}
              title="No generations yet"
              description="Start creating your first devotional content"
              action={{
                label: 'Generate Mantra',
                onClick: () => window.location.href = '/generate'
              }}
            />
          )}
          {recentGenerations.length > 0 && (
            <div className="mt-6 text-center">
              <Button variant="outline" asChild>
                <Link href="/dashboard/generations">View All</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

