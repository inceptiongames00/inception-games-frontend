'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inception-games.an.r.appspot.com/api/v1';

export default function ActivateSubscriptionModal({ isOpen, onClose, subscription, userId }) {
  const [trxId, setTrxId] = useState('');
  const [reference, setReference] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // 'success', 'error', null
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  if (!subscription) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type (images only)
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please upload an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('File size must be less than 5MB');
        return;
      }
      setProofFile(file);
      setFileName(file.name);
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setStatus(null);

    // Validation
    if (!trxId.trim()) {
      setErrorMessage('Transaction ID is required');
      return;
    }
    if (!reference.trim()) {
      setErrorMessage('Reference is required');
      return;
    }
    if (!userId) {
      setErrorMessage('User ID is missing. Please refresh the page.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('reference', reference.trim());
      formData.append('trx_id', trxId.trim());
      // Only append proof_image if file is selected
      if (proofFile) {
        formData.append('proof_image', proofFile);
      }

      const response = await fetch(`${API_BASE_URL}/subscription/submit-proof`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        // Reset form
        setTrxId('');
        setReference('');
        setProofFile(null);
        setFileName('');
        
        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setStatus('error');
        setErrorMessage(data.message || 'Failed to submit payment proof. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
      console.error('Error submitting payment proof:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTrxId('');
      setReference('');
      setProofFile(null);
      setFileName('');
      setStatus(null);
      setErrorMessage('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="bg-[#0c0c14] rounded-2xl border border-white/[0.06] w-full max-w-lg shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
              <h2 className="text-2xl font-bold text-white">Activate Subscription</h2>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="p-2 hover:bg-white/[0.05] rounded-lg transition disabled:opacity-50"
              >
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {status === 'success' ? (
                <motion.div
                  className="flex flex-col items-center justify-center py-8 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-4">
                    <CheckCircle size={32} className="text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Payment Submitted!</h3>
                  <p className="text-gray-400 text-sm">
                    Your payment proof has been submitted successfully. Your subscription will be activated soon.
                  </p>
                </motion.div>
              ) : status === 'error' ? (
                <motion.div
                  className="flex flex-col items-center justify-center py-8 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center mb-4">
                    <AlertCircle size={32} className="text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Submission Failed</h3>
                  <p className="text-gray-400 text-sm mb-4">{errorMessage}</p>
                  <button
                    onClick={() => {
                      setStatus(null);
                      setErrorMessage('');
                    }}
                    className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition"
                  >
                    Try Again
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Info Box */}
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                    <p className="text-blue-300 text-sm leading-relaxed">
                      <strong>Payment Instructions:</strong> Pay manually to activate your subscription. Then provide your transaction details and payment proof below.
                    </p>
                  </div>

                  {/* Transaction ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Transaction ID <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      placeholder="e.g., 8TY3K2X9"
                      className="w-full px-4 py-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Reference */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Reference <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="e.g., IG-001054"
                      className="w-full px-4 py-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Payment Proof <span className="text-gray-500">(Optional)</span>
                    </label>
                    <div
                      onClick={() => !isSubmitting && fileInputRef.current?.click()}
                      className="border-2 border-dashed border-white/[0.2] rounded-lg p-6 text-center cursor-pointer hover:border-white/[0.4] hover:bg-white/[0.02] transition"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={isSubmitting}
                      />
                      {fileName ? (
                        <div className="flex items-center justify-center gap-3">
                          <CheckCircle size={24} className="text-emerald-400" />
                          <div className="text-left">
                            <p className="text-white font-medium">{fileName}</p>
                            <p className="text-gray-500 text-sm">Ready to upload</p>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <Upload size={24} className="text-gray-500 mx-auto mb-2" />
                          <p className="text-gray-400 text-sm">Click to upload or drag and drop</p>
                          <p className="text-gray-500 text-xs mt-1">PNG, JPG, GIF up to 5MB</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Error Message */}
                  {errorMessage && !status && (
                    <motion.div
                      className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
                      <p className="text-red-300 text-sm">{errorMessage}</p>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Payment Proof'
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
