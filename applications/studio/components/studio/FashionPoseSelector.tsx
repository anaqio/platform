'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils/cn'

interface FashionPoseSelectorProps {
  value: string
  onChange: (pose: string) => void
}

const poseCategories = [
  {
    title: 'Back & Detail Shots',
    poses: [
      { label: 'Standing from Behind', en: 'a standing pose seen from the back' },
      { label: 'Walking Away', en: 'a walking pose, seen from behind' },
      {
        label: 'Looking Over Shoulder',
        en: 'a pose looking over the shoulder, showcasing the back',
      },
      { label: 'Dynamic Turn', en: 'in the middle of a dynamic turn, showing side and back' },
      {
        label: 'Close-up on Back Detail',
        en: 'a close-up shot focusing on the back details of the garment',
      },
    ],
  },
  {
    title: 'Formal & Elegant',
    poses: [
      { label: 'Confident Catwalk', en: 'a confident walking pose' },
      { label: 'Elegant Standing Pose', en: 'an elegant and poised standing pose' },
      { label: 'Assertive Presentation', en: 'as if assertively explaining a point' },
      { label: 'Sophisticated Hand on Hip', en: 'a sophisticated pose with one hand on the hip' },
      { label: 'Stylish Stair Descent', en: 'as if confidently descending a staircase' },
    ],
  },
  {
    title: 'Athletic & Activewear',
    poses: [
      { label: 'Powerful Running Motion', en: 'a powerful running motion' },
      { label: 'Dynamic Mid-Air Jump', en: 'a dynamic mid-air jumping pose' },
      { label: 'Focused Yoga/Stretch', en: 'a focused yoga or stretching pose' },
      { label: 'Dynamic Kicking Pose', en: 'in a dynamic pose as if kicking a ball' },
      { label: 'Post-Workout Stretch', en: 'a powerful post-workout stretching pose' },
    ],
  },
  {
    title: 'Casual & Relaxed',
    poses: [
      { label: 'Relaxed Floating Pose', en: 'a relaxed floating pose, suggesting ease' },
      { label: 'Gentle Breeze Sway', en: 'gently swaying as if caught in a breeze' },
      { label: 'Casual Leaning Pose', en: 'a casual leaning pose' },
      { label: 'Invisible Stool Sit', en: 'casually sitting on an invisible stool' },
      {
        label: 'Leaning on Invisible Wall',
        en: 'leaning against an invisible wall with crossed arms',
      },
    ],
  },
  {
    title: 'Bohemian & Artisanal',
    poses: [
      { label: 'Bohemian Walk', en: 'a relaxed walking pose with the garment flowing naturally' },
      { label: 'Sitting on Rug', en: 'casually sitting on a woven, artisanal rug' },
      {
        label: 'Gentle Look Over Shoulder',
        en: 'a gentle and natural pose looking over the shoulder',
      },
      {
        label: 'Adjusting Accessory',
        en: 'a candid pose, adjusting a handcrafted accessory like a bracelet or necklace',
      },
      { label: 'Leaning on Rustic Wall', en: 'leaning against a textured, rustic wall' },
    ],
  },
  {
    title: 'Dresses & Gowns',
    poses: [
      { label: 'Graceful Twirl', en: 'a graceful twirling motion, with the fabric flowing out' },
      { label: 'Majestic Sweeping Walk', en: 'a sweeping, majestic walking pose' },
      { label: 'Gentle Curtsy', en: 'a gentle curtsy pose, with the fabric draping elegantly' },
      {
        label: 'Dramatic Sleeve Showcase',
        en: 'a dramatic pose with arms outstretched, showcasing the sleeves',
      },
    ],
  },
  {
    title: 'Dynamic & Action Poses',
    poses: [
      {
        label: 'Walking into Wind',
        en: 'a powerful forward stride, as if walking into a strong wind',
      },
      { label: 'Dramatic Side Leap', en: 'a dramatic mid-air leap to the side' },
      { label: 'Sprint Start Pose', en: 'an athletic pose, as if about to sprint off the blocks' },
      {
        label: 'Quick Twisting Motion',
        en: 'a quick twisting motion, capturing the fabric in movement',
      },
      { label: 'Celebratory Motion', en: 'arms thrown up in a celebratory motion' },
    ],
  },
]

export function FashionPoseSelector({ value, onChange }: FashionPoseSelectorProps) {
  const [openCategory, setOpenCategory] = useState<string>(poseCategories[0].title)

  return (
    <div className="space-y-2">
      {poseCategories.map((category) => {
        const isOpen = openCategory === category.title
        const categoryId = `poses-${category.title.replace(/\s/g, '-')}`

        return (
          <div key={category.title} className="bg-muted/50 rounded-lg p-3">
            <button
              type="button"
              onClick={() =>
                setOpenCategory((prev) => (prev === category.title ? '' : category.title))
              }
              className="flex w-full items-center justify-between text-left"
              aria-expanded={isOpen}
              aria-controls={categoryId}
            >
              <span className="text-foreground text-sm font-medium">{category.title}</span>
              <ChevronDown
                className={cn(
                  'text-muted-foreground h-4 w-4 shrink-0 transition-transform duration-200',
                  isOpen && 'rotate-180'
                )}
              />
            </button>

            <div
              id={categoryId}
              className={cn(
                'grid overflow-hidden transition-all duration-300 ease-in-out',
                isOpen ? 'mt-2 grid-rows-[1fr]' : 'grid-rows-[0fr]'
              )}
            >
              <div className="min-h-0">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {category.poses.map((pose) => {
                    const isSelected = value === pose.en
                    return (
                      <button
                        key={pose.en}
                        type="button"
                        onClick={() => onChange(pose.en)}
                        className={cn(
                          'w-full rounded-md p-2 text-left text-xs font-medium transition-all',
                          isSelected
                            ? 'bg-brand-gold/10 text-foreground ring-2 ring-[#D4AF37]'
                            : 'border-border text-muted-foreground hover:border-muted-foreground border'
                        )}
                      >
                        {pose.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
