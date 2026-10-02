import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { FiCheck, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi'

/**
 * Toast — minimalist black rectangle notification
 *
 * Usage:
 *   <Toast message="Account created" type="success" onClose={() => {}} />
 *
 *   or with the useToast hook (recommended) — see bottom of file.
 */
const Toast = ({ message, type = 'info', duration = 3500, onClose }) => {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)

  // Entrance animation
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  // Auto-dismiss
  useEffect(() => {
    const timer = setTimeout(() => {
      setLeaving(true)
      setTimeout(() => onClose?.(), 250)
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const handleClose = () => {
    setLeaving(true)
    setTimeout(() => onClose?.(), 250)
  }

  const Icon =
    type === 'success' ? FiCheck : type === 'error' ? FiAlertCircle : FiInfo

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 pl-4 pr-3 py-3 bg-black text-white rounded-lg shadow-2xl transition-all duration-250 ease-out ${
        visible && !leaving
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-3'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Icon size={16} className="shrink-0 opacity-90" />
        <p className="text-sm font-medium tracking-tight truncate max-w-xs">
          {message}
        </p>
      </div>

      <button
        type="button"
        onClick={handleClose}
        aria-label="Dismiss"
        className="shrink-0 flex h-6 w-6 items-center justify-center rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors"
      >
        <FiX size={14} />
      </button>
    </div>,
    document.body
  )
}

export default Toast