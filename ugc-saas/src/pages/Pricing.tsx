import React, { useState } from 'react'
import { Check, Zap, ArrowRight, HelpCircle } from 'lucide-react'
import { PageProps } from '../types'
import { PRICING_PLANS } from '../data'

const Pricing: React.FC<PageProps> = ({ navigate, user, onLogin }) => {
  const [annual, setAnnual] = useState(false)

  const getPrice = (price: number) => {
    if (price === 0) return 0
    return annual ? Math.round(price * 0.8) : price
  }

  const faqs = [
    {
      q: 'What counts as one video credit?',
      a: 'Each generated video uses one credit, regardless of length or preset. Retries on failed generations are free.',
    },
    {
      q: 'Can I use my own avatar?',
      a: 'Yes! On Pro and Business plans you can upload photos to create a custom avatar that looks like you or your brand ambassador.',
    },
    {
      q: 'How long does video generation take?',
      a: 'Most videos are ready in 20–60 seconds on Pro/Business plans. Free/Starter users join a standard queue.',
    },
    {
      q: 'Can I download the videos?',
      a: 'Yes. All plans include MP4 download. Free plan includes a watermark; paid plans deliver clean files in up to 4K.',
    },
    {
      q: 'Do unused credits roll over?',
      a: 'Credits reset monthly and do not roll over. Business plan users have unlimited credits so this doesn\'t apply.',
    },
    {
      q: 'Can I cancel anytime?',
      a: 'Absolutely. Cancel from your account settings at any time — no questions asked.',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="badge-violet inline-block mb-4">Pricing</div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Start free. Scale as you grow. No hidden fees.
        </p>

        {/* Annual toggle */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <span className={`text-sm ${!annual ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-12 h-6 rounded-full transition-colors ${annual ? 'bg-violet-600' : 'bg-gray-700'}`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${annual ? 'left-7' : 'left-1'}`}
            />
          </button>
          <span className={`text-sm ${annual ? 'text-white' : 'text-gray-400'}`}>
            Annual
            <span className="ml-1.5 badge bg-green-900/50 text-green-300 border border-green-700/30">
              Save 20%
            </span>
          </span>
        </div>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
        {PRICING_PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl p-6 flex flex-col ${
              plan.highlighted
                ? 'bg-gradient-to-b from-violet-900/60 to-indigo-900/40 border-2 border-violet-500 shadow-2xl shadow-violet-900/30'
                : 'bg-gray-900 border border-gray-800'
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                  {plan.badge}
                </span>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
              <p className="text-sm text-gray-400">{plan.description}</p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">
                  ${getPrice(plan.price)}
                </span>
                {plan.price > 0 && (
                  <span className="text-gray-400 text-sm">/{plan.period}</span>
                )}
              </div>
              {annual && plan.price > 0 && (
                <p className="text-xs text-green-400 mt-1">
                  ${plan.price}/mo billed ${Math.round(plan.price * 0.8 * 12)}/yr
                </p>
              )}
              <div className="mt-3">
                <span className="text-sm font-semibold text-white">
                  {plan.credits === -1 ? 'Unlimited videos' : `${plan.credits} videos/month`}
                </span>
              </div>
            </div>

            <ul className="space-y-3 flex-1 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm">
                  <Check
                    size={16}
                    className={`flex-shrink-0 mt-0.5 ${plan.highlighted ? 'text-violet-400' : 'text-gray-400'}`}
                  />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => (user ? navigate('create') : onLogin())}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                plan.highlighted
                  ? 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg'
                  : plan.name === 'Business'
                  ? 'btn-secondary'
                  : 'border border-gray-700 text-white hover:bg-gray-800'
              }`}
            >
              {plan.highlighted && <Zap size={16} fill="currentColor" />}
              {plan.cta}
              {plan.name !== 'Business' && <ArrowRight size={14} />}
            </button>
          </div>
        ))}
      </div>

      {/* Comparison note */}
      <div className="text-center mb-16">
        <p className="text-gray-500 text-sm">
          All plans include access to all 9 presets, 9 hooks, and 14 settings. · No setup fees. · Cancel anytime.
        </p>
      </div>

      {/* Feature comparison table */}
      <div className="card overflow-hidden mb-16">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-gray-400 font-medium p-4 w-1/3">Feature</th>
                {PRICING_PLANS.map((p) => (
                  <th key={p.name} className={`text-center p-4 font-semibold ${p.highlighted ? 'text-violet-400' : 'text-white'}`}>
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { feature: 'Videos per month', values: ['3', '30', '100', 'Unlimited'] },
                { feature: 'Video quality', values: ['720p', '1080p', '4K', '4K'] },
                { feature: 'Watermark', values: ['Yes', 'No', 'No', 'No'] },
                { feature: 'Custom avatar', values: ['—', '—', '✓', '✓'] },
                { feature: 'API access', values: ['—', '—', '✓', '✓'] },
                { feature: 'Bulk export', values: ['—', '—', '✓', '✓'] },
                { feature: 'Team seats', values: ['1', '1', '1', '10'] },
                { feature: 'Priority queue', values: ['—', '✓', '✓', 'Dedicated'] },
                { feature: 'Custom branding', values: ['—', '—', '—', '✓'] },
                { feature: 'Account manager', values: ['—', '—', '—', '✓'] },
              ].map(({ feature, values }) => (
                <tr key={feature} className="border-b border-gray-800/50 last:border-0 hover:bg-gray-800/20">
                  <td className="p-4 text-gray-300">{feature}</td>
                  {values.map((v, i) => (
                    <td key={i} className={`text-center p-4 ${PRICING_PLANS[i].highlighted ? 'text-violet-300' : 'text-gray-400'}`}>
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <HelpCircle size={24} className="text-violet-400" />
            Frequently Asked Questions
          </h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="card p-5">
              <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
        <p className="text-gray-400 mb-6">No credit card required for the free plan.</p>
        <button onClick={() => (user ? navigate('create') : onLogin())} className="btn-primary text-base px-8 py-4 inline-flex items-center gap-2">
          <Zap size={18} fill="white" />
          {user ? 'Create a Video Now' : 'Start for Free'}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}

export default Pricing
