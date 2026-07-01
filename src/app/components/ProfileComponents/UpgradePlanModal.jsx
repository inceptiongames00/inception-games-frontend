'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';

export default function UpgradePlanModal({ isOpen, onClose }) {
  const plans = [
    {
      id: 'free',
      name: 'Free Gamer',
      price: 'Free',
      period: '',
      badge: 'CURRENT PLAN',
      badgeColor: 'bg-gray-700/50 text-gray-400',
      isCurrentPlan: true,
      features: [
        'Basic Matchmaking',
        'Community Forum Access',
        { text: 'No Advanced Stats', disabled: true },
      ],
      buttonText: 'CURRENTLY ACTIVE',
      buttonStyle: 'bg-gray-700 hover:bg-gray-700 cursor-default',
      highlighted: false,
    },
    {
      id: 'pro',
      name: 'Pro Gamer',
      price: '249 BDT',
      period: '/mo',
      badge: 'MOST POPULAR',
      badgeColor: 'bg-purple-600 text-white',
      isCurrentPlan: false,
      features: [
        'Advanced Performance Stats',
        'Pro Gear Discounts (10%)',
        'Ad-free Experience',
        'Priority Server Entry',
      ],
      buttonText: 'UPGRADE TO PRO',
      buttonStyle: 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400',
      highlighted: true,
    },
    {
      id: 'elite',
      name: 'Elite Gamer',
      price: '349 BDT',
      period: '/mo',
      badge: null,
      badgeColor: '',
      isCurrentPlan: false,
      features: [
        'All Pro Features',
        '1-on-1 Coaching Session',
        'Exclusive Tournament Entry',
        'Beta Game Access',
      ],
      buttonText: 'GO ELITE',
      buttonStyle: 'bg-transparent border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10',
      highlighted: false,
    },
    {
      id: 'legendary',
      name: 'Legendary Gamer',
      price: '449 BDT',
      period: '/mo',
      badge: null,
      badgeColor: '',
      isCurrentPlan: false,
      features: [
        'All Elite Features',
        'Personal Account Manager',
        'Custom Profile Badge',
        'Early Access to New Games',
      ],
      buttonText: 'GO LEGENDARY',
      buttonStyle: 'bg-transparent border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10',
      highlighted: false,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[200] p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-black via-[#0a0a0f] to-black border border-white/[0.08] rounded-3xl max-w-6xl w-full shadow-2xl shadow-black/50 overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-gray-400 hover:text-white hover:bg-white/[0.08] transition z-10"
            >
              <X size={20} />
            </button>

            {/* Content */}
            <div className="p-8 sm:p-12">
              {/* Header */}
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                  Level Up Your Experience
                </h2>
                <p className="text-lg text-gray-400">
                  Level up with premium perks, elite gear, and expert coaching.
                </p>
              </motion.div>

              {/* Plans Grid */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, staggerChildren: 0.1 }}
              >
                {plans.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className={`rounded-2xl border transition-all duration-300 ${
                      plan.highlighted
                        ? 'border-purple-500/60 bg-gradient-to-br from-purple-950/40 to-purple-900/20 shadow-lg shadow-purple-600/30 scale-105'
                        : 'border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="p-6 pt-8">
                      {/* Badge */}
                      {plan.badge && (
                        <div className="flex justify-center mb-4 -mt-12">
                          <span className={`text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider ${plan.badgeColor}`}>
                            {plan.badge}
                          </span>
                        </div>
                      )}
                      {/* Plan Name */}
                      <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>

                      {/* Price */}
                      <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-3xl font-bold text-white">{plan.price}</span>
                        {plan.period && (
                          <span className="text-sm text-gray-500">{plan.period}</span>
                        )}
                      </div>

                      {/* Features */}
                      <div className="space-y-3 mb-6">
                        {plan.features.map((feature, idx) => {
                          const isString = typeof feature === 'string';
                          const text = isString ? feature : feature.text;
                          const disabled = feature.disabled;

                          return (
                            <div
                              key={idx}
                              className={`flex items-start gap-3 ${disabled ? 'opacity-40' : ''}`}
                            >
                              <Check
                                size={18}
                                className={`flex-shrink-0 mt-0.5 ${
                                  disabled ? 'text-gray-600' : 'text-emerald-400'
                                }`}
                              />
                              <span className={`text-sm ${disabled ? 'text-gray-600' : 'text-gray-300'}`}>
                                {text}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Button */}
                      <motion.button
                        className={`w-full py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all duration-300 ${plan.buttonStyle}`}
                        whileHover={{ scale: plan.isCurrentPlan ? 1 : 1.02 }}
                        whileTap={{ scale: plan.isCurrentPlan ? 1 : 0.98 }}
                        disabled={plan.isCurrentPlan}
                      >
                        {plan.buttonText}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
