'use client'

type ConfirmationModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: string
  message: string
  highlightText?: string
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'primary' | 'danger'
  isLoading?: boolean
  icon?: string
  iconColor?: string
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  highlightText,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  isLoading = false,
  icon = 'check_circle',
  iconColor = 'text-primary',
}: ConfirmationModalProps) {
  if (!isOpen) return null

  const handleConfirm = async () => {
    await onConfirm()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-neutral-200 dark:border-slate-700 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${iconColor === 'text-primary' ? 'bg-primary/10 dark:bg-primary/20' : iconColor === 'text-red-600' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                <span 
                  className={`material-symbols-outlined text-[24px] ${iconColor}`}
                  style={{ fontVariationSettings: '"FILL" 1' }}
                >
                  {icon}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <p className="text-sm text-gray-800 dark:text-gray-200">
              {highlightText ? (
                <>
                  {message.split(highlightText).map((part, index, array) => (
                    <span key={index}>
                      {part}
                      {index < array.length - 1 && (
                        <span className="font-medium text-gray-900 dark:text-white">
                          {highlightText}
                        </span>
                      )}
                    </span>
                  ))}
                </>
              ) : (
                message
              )}
            </p>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-neutral-200 dark:border-slate-700 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-md hover:bg-neutral-50 dark:hover:bg-slate-700 hover:shadow-sm active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className={`px-4 py-2 text-sm font-medium rounded-md shadow-sm hover:shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                confirmVariant === 'danger'
                  ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/20'
                  : 'bg-primary text-white hover:bg-primary-hover focus:ring-primary/20 active:bg-primary-800'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Processing...
                </span>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
