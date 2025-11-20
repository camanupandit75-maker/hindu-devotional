'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Check, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { mockPricingPlans } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const faqs = [
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, and PayPal.',
    },
    {
      question: 'Can I change my plan later?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.',
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee for all paid plans.',
    },
    {
      question: 'What happens if I exceed my generation limit?',
      answer: 'You can upgrade to a higher plan or purchase additional generations as needed.',
    },
  ]

  return (
    <div className="container py-8">
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Pricing Plans</h1>
        <p className="text-lg text-text-secondary mb-8">
          Choose the perfect plan for your devotional content creation needs
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-4 p-1 bg-muted rounded-lg mb-8">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-colors',
              billingCycle === 'monthly'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground'
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-colors relative',
              billingCycle === 'yearly'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground'
            )}
          >
            Yearly
            <Badge className="ml-2 bg-primary text-primary-foreground text-xs">
              Save 20%
            </Badge>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
        {mockPricingPlans.map((plan) => {
          const price = billingCycle === 'monthly' ? plan.price : plan.yearlyPrice / 12
          const originalPrice = billingCycle === 'yearly' ? plan.price : null

          return (
            <Card
              key={plan.id}
              className={cn(
                'relative',
                plan.popular && 'border-primary border-2 shadow-lg'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">${price}</span>
                    <span className="text-text-secondary">/month</span>
                  </div>
                  {originalPrice && (
                    <p className="text-sm text-text-secondary mt-1">
                      ${originalPrice.toFixed(0)}/month billed annually
                    </p>
                  )}
                </div>
                <CardDescription className="mt-4">
                  {billingCycle === 'yearly' && plan.yearlyPrice > 0 && (
                    <span>${plan.yearlyPrice}/year</span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  size="lg"
                >
                  {plan.id === 'free' ? 'Get Started' : 'Subscribe'}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Comparison Table */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Feature Comparison</h2>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">Feature</th>
                    {mockPricingPlans.map((plan) => (
                      <th key={plan.id} className="text-center p-4 font-semibold capitalize">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Generations per month', free: '5', creator: '100', pro: 'Unlimited' },
                    { feature: 'Voice styles', free: 'Basic', creator: 'All', pro: 'All' },
                    { feature: 'Templates', free: 'Standard', creator: 'Premium', pro: 'All' },
                    { feature: 'Video quality', free: 'SD', creator: 'HD', pro: '4K' },
                    { feature: 'Watermarks', free: 'Yes', creator: 'No', pro: 'No' },
                    { feature: 'Commercial license', free: 'No', creator: 'Yes', pro: 'Yes' },
                    { feature: 'Support', free: 'Community', creator: 'Priority', pro: '24/7 Priority' },
                    { feature: 'API access', free: 'No', creator: 'No', pro: 'Yes' },
                  ].map((row, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-4">{row.feature}</td>
                      <td className="p-4 text-center">{row.free}</td>
                      <td className="p-4 text-center">{row.creator}</td>
                      <td className="p-4 text-center">{row.pro}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

