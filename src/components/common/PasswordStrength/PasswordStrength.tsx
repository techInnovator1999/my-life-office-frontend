'use client'

import { calculatePasswordStrength, type PasswordStrength } from '@/utils/validators'

type PasswordStrengthProps = {
  password: string
}

const strengthColors: Record<PasswordStrength, string> = {
  weak: 'bg-red-500',
  fair: 'bg-orange-500',
  good: 'bg-yellow-500',
  strong: 'bg-green-500',
}

const strengthLabels: Record<PasswordStrength, string> = {
  weak: 'Weak',
  fair: 'Fair',
  good: 'Good',
  strong: 'Strong',
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null

  const { strength, score, feedback } = calculatePasswordStrength(password)
  const percentage = (score / 5) * 100

  return (
    <div className="mt-2 space-y-2">
      {/* Progress Bar */}
      <div className="w-full bg-neutral-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-1.5 rounded-full transition-all duration-300 ${strengthColors[strength]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Strength Label */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-700 dark:text-gray-300">Password strength:</span>
        <span
          className={`font-semibold ${
            strength === 'weak'
              ? 'text-red-600 dark:text-red-400'
              : strength === 'fair'
                ? 'text-orange-600 dark:text-orange-400'
                : strength === 'good'
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-green-600 dark:text-green-400'
          }`}
        >
          {strengthLabels[strength]}
        </span>
      </div>

      {/* Feedback */}
      {feedback.length > 0 && (
        <div className="w-full text-xs text-gray-800 dark:text-gray-200 space-y-1 bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 rounded-lg p-2">
          <p className="font-medium text-gray-900 dark:text-gray-100">Requirements:</p>
          <ul className="list-disc list-inside space-y-0.5 ml-2 text-gray-800 dark:text-gray-200">
            {feedback.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

