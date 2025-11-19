'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, Play, Volume2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/use-toast'
import { DevanagariText } from '@/components/DevanagariText'
import { languages, voiceStyles, voices, mockUser } from '@/lib/mock-data'
import { apiClient } from '@/lib/api-client'
import { cn } from '@/lib/utils'

type Step = 1 | 2 | 3 | 4

export default function GeneratePage() {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [formData, setFormData] = useState({
    mantra: '',
    language: '',
    voiceStyle: '',
    voice: '',
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const router = useRouter()
  const { toast } = useToast()
  const user = mockUser

  const steps = [
    { number: 1, title: 'Mantra', description: 'Enter your text' },
    { number: 2, title: 'Language', description: 'Choose language' },
    { number: 3, title: 'Voice Style', description: 'Select style' },
    { number: 4, title: 'Voice', description: 'Pick voice' },
  ]

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.mantra.trim().length > 0
      case 2:
        return formData.language !== ''
      case 3:
        return formData.voiceStyle !== ''
      case 4:
        return formData.voice !== ''
      default:
        return false
    }
  }

  const handleNext = () => {
    if (canProceed() && currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as Step)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step)
    }
  }

  const handleGenerate = async () => {
    if (!canProceed()) return

    const remaining = user.usage.generationsLimit - user.usage.generationsUsed
    if (remaining <= 0) {
      toast({
        title: 'Generation limit reached',
        description: 'Please upgrade your plan to continue generating content.',
        variant: 'destructive',
      })
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)

    try {
      const generation = await apiClient.createGeneration({
        input_text: formData.mantra,
        language: formData.language,
        voice_style: formData.voiceStyle,
        selected_voice: formData.voice,
        generation_type: 'tts_mantra',
      })

      // Poll for completion
      const pollInterval = setInterval(async () => {
        try {
          const updated = await apiClient.getGeneration(generation.id)
          const progress = updated.status === 'processing' ? 50 : 
                          updated.status === 'completed' ? 100 : 
                          updated.status === 'failed' ? 0 : 10
          setGenerationProgress(progress)

          if (updated.status === 'completed') {
            clearInterval(pollInterval)
            setIsGenerating(false)
            setGenerationProgress(100)
            toast({
              title: 'Generation complete!',
              description: 'Your devotional content is ready.',
            })
            router.push(`/generation/${generation.id}`)
          } else if (updated.status === 'failed') {
            clearInterval(pollInterval)
            setIsGenerating(false)
            toast({
              title: 'Generation failed',
              description: 'Please try again later.',
              variant: 'destructive',
            })
          }
        } catch (error) {
          clearInterval(pollInterval)
          setIsGenerating(false)
          toast({
            title: 'Error checking status',
            description: 'Please refresh the page.',
            variant: 'destructive',
          })
        }
      }, 2000)

      // Stop polling after 5 minutes
      setTimeout(() => {
        clearInterval(pollInterval)
        if (isGenerating) {
          setIsGenerating(false)
          toast({
            title: 'Generation taking longer than expected',
            description: 'Check your dashboard for updates.',
          })
        }
      }, 300000) // 5 minutes
    } catch (error: any) {
      setIsGenerating(false)
      setGenerationProgress(0)
      toast({
        title: 'Generation failed',
        description: error.message || 'Could not create generation',
        variant: 'destructive',
      })
    }
  }

  const selectedLanguage = languages.find((l) => l.value === formData.language)
  const selectedVoiceStyle = voiceStyles.find((v) => v.value === formData.voiceStyle)
  const availableVoices = voices.filter((v) => v.style === formData.voiceStyle || !formData.voiceStyle)

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Generate Mantra</h1>
          <p className="text-text-secondary">
            Create beautiful Sanskrit mantras with AI-powered text-to-speech
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors',
                      currentStep >= step.number
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'border-muted text-muted-foreground'
                    )}
                  >
                    {currentStep > step.number ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="text-xs text-text-secondary">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="h-5 w-5 text-muted-foreground mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Mantra Input */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Enter Mantra</CardTitle>
                  <CardDescription>
                    Type or paste your Sanskrit mantra text
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mantra">Mantra Text</Label>
                    <Textarea
                      id="mantra"
                      placeholder="ॐ नमो भगवते वासुदेवाय"
                      value={formData.mantra}
                      onChange={(e) => setFormData({ ...formData, mantra: e.target.value })}
                      className="min-h-[200px] text-devanagari text-lg"
                    />
                    <p className="text-sm text-text-secondary">
                      {formData.mantra.length} characters
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Language Selection */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Language</CardTitle>
                  <CardDescription>
                    Choose the language for your mantra
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={formData.language}
                      onValueChange={(value) => setFormData({ ...formData, language: value })}
                    >
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedLanguage && (
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <p className="text-sm font-medium mb-2">Selected: {selectedLanguage.label}</p>
                      {selectedLanguage.devanagari && (
                        <p className="text-sm text-text-secondary">
                          Devanagari script supported
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 3: Voice Style */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Voice Style</CardTitle>
                  <CardDescription>
                    Choose the emotional tone for your mantra
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    {voiceStyles.map((style) => (
                      <button
                        key={style.value}
                        onClick={() => setFormData({ ...formData, voiceStyle: style.value })}
                        className={cn(
                          'p-4 rounded-lg border text-left transition-all hover:border-primary',
                          formData.voiceStyle === style.value
                            ? 'border-primary bg-primary/5'
                            : 'border-muted'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{style.label}</p>
                            <p className="text-sm text-text-secondary">{style.description}</p>
                          </div>
                          {formData.voiceStyle === style.value && (
                            <Check className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Voice Selection */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Voice</CardTitle>
                  <CardDescription>
                    Choose a voice and preview it
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="voice">Voice</Label>
                    <Select
                      value={formData.voice}
                      onValueChange={(value) => setFormData({ ...formData, voice: value })}
                    >
                      <SelectTrigger id="voice">
                        <SelectValue placeholder="Select a voice" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableVoices.map((voice) => (
                          <SelectItem key={voice.value} value={voice.value}>
                            {voice.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.voice && (
                    <div className="p-4 bg-primary/5 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {voices.find((v) => v.value === formData.voice)?.label}
                          </p>
                          <p className="text-sm text-text-secondary">
                            {selectedVoiceStyle?.label} style
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Play className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
                Back
              </Button>
              {currentStep < 4 ? (
                <Button onClick={handleNext} disabled={!canProceed()}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleGenerate} disabled={!canProceed() || isGenerating}>
                  {isGenerating ? 'Generating...' : 'Generate Mantra'}
                </Button>
              )}
            </div>

            {isGenerating && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Generating your mantra...</span>
                      <span>{generationProgress}%</span>
                    </div>
                    <Progress value={generationProgress} />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Your generation settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.mantra && (
                  <div>
                    <Label className="text-xs text-text-secondary">Mantra</Label>
                    <div className="mt-1 p-3 bg-muted rounded-md">
                      <DevanagariText className="text-lg">
                        {formData.mantra || 'Enter mantra text...'}
                      </DevanagariText>
                    </div>
                  </div>
                )}
                {formData.language && (
                  <div>
                    <Label className="text-xs text-text-secondary">Language</Label>
                    <p className="mt-1">{selectedLanguage?.label}</p>
                  </div>
                )}
                {formData.voiceStyle && (
                  <div>
                    <Label className="text-xs text-text-secondary">Voice Style</Label>
                    <p className="mt-1">{selectedVoiceStyle?.label}</p>
                  </div>
                )}
                {formData.voice && (
                  <div>
                    <Label className="text-xs text-text-secondary">Voice</Label>
                    <p className="mt-1">
                      {voices.find((v) => v.value === formData.voice)?.label}
                    </p>
                  </div>
                )}
                {!formData.mantra && (
                  <div className="text-center py-8 text-text-secondary">
                    <Volume2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Complete the form to see preview</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Generation Limit Warning */}
            {user.usage.generationsUsed >= user.usage.generationsLimit * 0.8 && (
              <Card className="mt-4 border-yellow-500">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">Generation Limit Warning</p>
                      <p className="text-xs text-text-secondary">
                        You&apos;ve used {user.usage.generationsUsed} of {user.usage.generationsLimit} generations
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                    <a href="/pricing">Upgrade Plan</a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

