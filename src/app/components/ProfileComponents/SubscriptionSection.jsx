'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown } from 'lucide-react';
import UpgradePlanModal from './UpgradePlanModal';

export default function SubscriptionSection() {
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const subscriptionTiers = [
    {
      name: 'Free Gamer Plan',
      badge: 'FREE',
      badgeColor: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400',
      price: 'FREE',
      expiration: 'No expiration',
      features: [
        'Priority Access',
        'Exclusive Tournaments',
      ],
      buttonText: 'UPGRADE PLAN',
      buttonStyle: 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400',
    },
  ];

  return (
    <motion.div
      className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#0c0c14] to-[#14141f] overflow-hidden relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5" />
      
      {/* Top accent - updated gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-pink-500/40" />
      
      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      <div className="relative z-10 p-4 sm:p-5">
        {/* Header with icon */}
        <motion.div
          className="flex items-center gap-3 mb-6"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <Crown size={20} className="text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">
            Subscription
          </h3>
        </motion.div>
    
          {subscriptionTiers.map((tier, index) => (
            <motion.div
              key={index}
              // className="rounded-xl border border-white/[0.06] hover:border-purple-500/20 transition duration-300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
            >
              {/* Plan Name + Badge */}
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h4 className="text-lg sm:text-xl font-bold text-white">{tier.name}</h4>
                <span className={`px-2.5 py-0.5 rounded-lg border text-[10px] sm:text-xs font-bold uppercase tracking-wider ${tier.badgeColor}`}>
                  {tier.badge}
                </span>
              </div>

              {/* Price */}
              <p className="text-1xl sm:text-2xl font-bold text-white mt-1">
                {tier.price}
              </p>

              {/* Expiration */}
              <p className="text-gray-500 text-sm mt-0.5">{tier.expiration}</p>

              {/* Divider */}
              <div className="my-4 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />

              {/* Features List */}
              <div className="space-y-2.5 mb-5">
                {tier.features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 * (idx + 1) }}
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="text-emerald-400" />
                    </div>
                    <span className="text-gray-400 text-sm sm:text-base">{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* Upgrade Button */}
              <motion.button
                onClick={() => setIsUpgradeModalOpen(true)}
                className={`w-full py-3 rounded-xl font-bold text-white text-sm sm:text-sm transition duration-300 shadow-lg shadow-purple-500/20 ${tier.buttonStyle}`}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                {tier.buttonText}
              </motion.button>
            </motion.div>
          ))}
        
      </div>

      {/* Upgrade Plan Modal */}
      <UpgradePlanModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} />
    </motion.div>
  );
}