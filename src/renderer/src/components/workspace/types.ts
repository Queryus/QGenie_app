import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  id: string
  icon: LucideIcon
  active?: boolean
  disabled?: boolean
  onClick?: () => void
}

export interface FeatureCardData {
  title: string
  description: React.ReactNode
  image: string
}
