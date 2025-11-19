'use client'

export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { ArrowLeft, Download, Share2, Play, Pause, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/StatusBadge'
import { DevanagariText } from '@/components/DevanagariText'
import { mockGenerations } from '@/lib/mock-data'
import { formatDistanceToNow } from 'date-fns'
import { useState } from 'react'

export default function GenerationDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(120)

  const generation = mockGenerations.find((g) => g.id === id) || mockGenerations[0]

  if (!generation) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-text-secondary">Generation not found</p>
            <Button className="mt-4" asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Audio Player */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Audio Preview</CardTitle>
                  <CardDescription>Listen to your generated mantra</CardDescription>
                </div>
                <StatusBadge status={generation.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {generation.status === 'completed' ? (
                <>
                  <div className="bg-muted rounded-lg p-6">
                    <div className="flex items-center justify-center mb-4">
                      <Button
                        size="lg"
                        variant="outline"
                        className="h-16 w-16 rounded-full"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? (
                          <Pause className="h-8 w-8" />
                        ) : (
                          <Play className="h-8 w-8" />
                        )}
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-text-secondary">
                        <span>{Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}</span>
                        <span>{Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}</span>
                      </div>
                      <div className="h-2 bg-secondary/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${(currentTime / duration) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Download className="mr-2 h-4 w-4" />
                      Download Audio
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-text-secondary">
                  <Volume2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Audio will be available once generation is complete</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Video Preview */}
          {generation.videoUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Video Preview</CardTitle>
                <CardDescription>Your devotional lyric video</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl opacity-50">🎬</div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <Button className="w-full">Play Video</Button>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Download Video
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Video
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs text-text-secondary">Mantra</Label>
                <div className="mt-1 p-3 bg-muted rounded-md">
                  <DevanagariText className="text-lg">
                    {generation.mantra}
                  </DevanagariText>
                </div>
              </div>
              <div>
                <Label className="text-xs text-text-secondary">Language</Label>
                <p className="mt-1">{generation.language}</p>
              </div>
              <div>
                <Label className="text-xs text-text-secondary">Voice Style</Label>
                <p className="mt-1 capitalize">{generation.voiceStyle}</p>
              </div>
              <div>
                <Label className="text-xs text-text-secondary">Voice</Label>
                <p className="mt-1">{generation.voice}</p>
              </div>
              {generation.templateId && (
                <div>
                  <Label className="text-xs text-text-secondary">Template</Label>
                  <p className="mt-1">Template #{generation.templateId}</p>
                </div>
              )}
              {generation.duration && (
                <div>
                  <Label className="text-xs text-text-secondary">Duration</Label>
                  <p className="mt-1">{generation.duration} seconds</p>
                </div>
              )}
              <div>
                <Label className="text-xs text-text-secondary">Created</Label>
                <p className="mt-1">
                  {formatDistanceToNow(new Date(generation.createdAt), { addSuffix: true })}
                </p>
              </div>
              {generation.completedAt && (
                <div>
                  <Label className="text-xs text-text-secondary">Completed</Label>
                  <p className="mt-1">
                    {formatDistanceToNow(new Date(generation.completedAt), { addSuffix: true })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline" asChild>
                <Link href="/generate">Create New</Link>
              </Button>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/templates">Browse Templates</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-xs font-medium ${className}`}>{children}</p>
}

