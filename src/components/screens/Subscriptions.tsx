import { PLANS } from '@/src/constants';
import { Check, BadgeCheck } from 'lucide-react';

interface SubscriptionsProps {
  subscriptionData: any[]
}

export function Subscriptions({ subscriptionData }: SubscriptionsProps) {
  const activeSub = subscriptionData?.find(s => s.status === 'active') ?? null

  return (
    <div className="space-y-12 py-12">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl font-black text-on-surface tracking-tight mb-4 leading-tight">
          Cultivate with <span className="text-primary italic">Intelligence</span>
        </h2>
        <p className="text-on-surface-variant text-lg">
          Choose the level of AI precision your land deserves.
        </p>

        {activeSub && (
          <div className="mt-6 inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-full text-sm font-semibold">
            <BadgeCheck size={16} />
            Active Plan: {activeSub.plan} · {activeSub.status}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-7xl mx-auto">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-[2.5rem] p-10 flex flex-col ${
              plan.popular
              ? 'bg-gradient-to-br from-primary to-primary-container text-white h-[105%] shadow-2xl z-10'
              : 'bg-surface-container-low hover:bg-surface-container transition-colors h-full'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-tertiary-fixed text-on-surface font-black text-[10px] uppercase tracking-[0.2em] px-6 py-2 rounded-full shadow-lg">
                Most Popular
              </div>
            )}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className={`${plan.popular ? 'text-white/70' : 'text-on-surface-variant'} text-sm leading-relaxed`}>{plan.description}</p>
            </div>
            <div className="mb-10">
              <span className="text-4xl font-black italic">₹{plan.price}</span>
              <span className="text-sm opacity-60 ml-1">/ year</span>
            </div>
            <ul className="space-y-5 mb-10 flex-1">
              {plan.features.map(f => (
                <li key={f} className="flex gap-3 items-center text-sm font-medium">
                  <Check className={plan.popular ? 'text-secondary-container' : 'text-primary'} size={18} strokeWidth={3} />
                  {f}
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${
                plan.isCurrent
                ? 'bg-surface-container-highest text-on-surface-variant cursor-default'
                : plan.popular
                ? 'bg-white text-primary hover:scale-[1.02] shadow-xl'
                : 'bg-primary text-white hover:bg-primary-container'
              }`}
            >
              {plan.isCurrent ? 'Current Plan' : 'Upgrade Plan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}