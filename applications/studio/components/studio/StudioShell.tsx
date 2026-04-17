'use client'

import { useCallback } from 'react'
import { TOTAL_STUDIO_STEPS, useStudioStore } from '@/stores/studio-store'
import { ChevronLeft, ChevronRight, Loader2, Sparkles } from 'lucide-react'

import type { Database } from '@/types/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

import { ArtisticStyleSelector } from './ArtisticStyleSelector'
import { BackgroundColorPicker } from './BackgroundColorPicker'
import { FashionPoseSelector } from './FashionPoseSelector'
import { FitStyleSelector } from './FitStyleSelector'
import { GarmentDescription } from './GarmentDescription'
import { GarmentUploader } from './GarmentUploader'
import { GenerationOutput } from './GenerationOutput'
import { GenerationStatus } from './GenerationStatus'
import { ModelPresetGrid } from './ModelPresetGrid'
import { ModeSelector } from './ModeSelector'
import { QualitySelector } from './QualitySelector'

type PresetModel = Database['public']['Tables']['preset_models']['Row']

interface StudioShellProps {
  presets: PresetModel[]
}

export function StudioShell({ presets }: StudioShellProps) {
  const store = useStudioStore()
  const isGenerating = store.workflowState === 'uploading' || store.workflowState === 'generating'

  // Can the user advance past this step?
  const canProceed = useCallback(() => {
    switch (store.step) {
      case 1:
        return true // Mode always has a default
      case 2:
        return !!store.garmentFile
      case 3:
        return !!store.fashionPose
      case 4:
        return true // Description is optional
      case 5:
        return !!store.selectedPresetId
      default:
        return false
    }
  }, [store.step, store.garmentFile, store.fashionPose, store.selectedPresetId])

  // Show output when completed
  if (store.outputPath) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <Card className="w-full max-w-lg p-6">
          <GenerationOutput
            outputPath={store.outputPath}
            initialBase64={store.outputBase64 ?? ''}
            initialMimeType={store.outputMimeType ?? ''}
            onReset={store.reset}
          />
        </Card>
      </div>
    )
  }

  // Show realtime status during generation
  if (isGenerating && store.generationId) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <GenerationStatus
          generationId={store.generationId}
          onCompleted={store.setOutputPath}
          onFailed={store.setGenerationFailed}
        />
      </div>
    )
  }

  const progressPercent = (store.step / TOTAL_STUDIO_STEPS) * 100

  return (
    <div className="flex min-h-[80vh] flex-col px-4">
      {/* Progress bar */}
      <div className="mx-auto w-full max-w-lg pt-4 pb-2">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-muted-foreground text-xs">
            Step {store.step} of {TOTAL_STUDIO_STEPS}
          </span>
          <span className="text-muted-foreground text-xs">{Math.round(progressPercent)}%</span>
        </div>
        <Progress value={progressPercent} className="h-1" />
      </div>

      {/* Step content — centered, single card, mobile-first */}
      <div className="flex flex-1 items-center justify-center py-6">
        <Card className="w-full max-w-lg p-6">
          <StepContent step={store.step} presets={presets} />
        </Card>
      </div>

      {/* Navigation */}
      <div className="mx-auto flex w-full max-w-lg items-center justify-between gap-3 pb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={store.prevStep}
          disabled={store.step === 1}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        {store.step < TOTAL_STUDIO_STEPS ? (
          <Button size="sm" onClick={store.nextStep} disabled={!canProceed()} className="gap-1">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={store.startGeneration}
            disabled={
              !store.garmentFile || !store.selectedPresetId || !store.fashionPose || isGenerating
            }
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate
              </>
            )}
          </Button>
        )}
      </div>

      {/* Error */}
      {store.errorMessage && (
        <p className="text-destructive mx-auto max-w-lg pb-4 text-center text-sm">
          {store.errorMessage}
        </p>
      )}
    </div>
  )
}

// ── Step content renderer ─────────────────────────────────────

function StepContent({ step, presets }: { step: number; presets: PresetModel[] }) {
  const store = useStudioStore()

  switch (step) {
    case 1:
      return (
        <>
          <StepHeader title="Select Mode" subtitle="What are you creating today?" />
          <ModeSelector value={store.mode} onChange={store.setMode} />
        </>
      )
    case 2:
      return (
        <>
          <StepHeader title="Upload Garment" subtitle="Upload a photo of the garment to try on." />
          <GarmentUploader
            selectedFile={store.garmentFile}
            onFileSelect={store.setGarmentFile}
            onClear={() => store.setGarmentFile(null)}
          />
        </>
      )
    case 3:
      return (
        <>
          <StepHeader title="Select Pose" subtitle="Choose a pose for the model." />
          <FashionPoseSelector value={store.fashionPose} onChange={store.setFashionPose} />
        </>
      )
    case 4:
      return (
        <>
          <StepHeader
            title="Describe Your Garment"
            subtitle="Add details for the AI to focus on."
            optional
          />
          <GarmentDescription value={store.description} onChange={store.setDescription} />
        </>
      )
    case 5:
      return (
        <>
          <StepHeader
            title="Style & Quality"
            subtitle="Fine-tune the look and feel of your generation."
          />
          <div className="space-y-5">
            <div>
              <p className="text-muted-foreground mb-2 text-xs font-medium">Artistic Style</p>
              <ArtisticStyleSelector
                value={store.artisticStyle}
                onChange={store.setArtisticStyle}
              />
            </div>
            <div>
              <p className="text-muted-foreground mb-2 text-xs font-medium">Garment Fit</p>
              <FitStyleSelector value={store.fitStyle} onChange={store.setFitStyle} />
            </div>
            <div>
              <p className="text-muted-foreground mb-2 text-xs font-medium">Background</p>
              <BackgroundColorPicker
                value={store.backgroundColor}
                onChange={store.setBackgroundColor}
              />
            </div>
            <div>
              <p className="text-muted-foreground mb-2 text-xs font-medium">Image Quality</p>
              <QualitySelector value={store.quality} onChange={store.setQuality} />
            </div>
            <div>
              <p className="text-muted-foreground mb-2 text-xs font-medium">Model</p>
              <ModelPresetGrid
                presets={presets}
                selectedId={store.selectedPresetId}
                onSelect={store.setSelectedPresetId}
              />
            </div>
          </div>
        </>
      )
    default:
      return null
  }
}

function StepHeader({
  title,
  subtitle,
  optional,
}: {
  title: string
  subtitle: string
  optional?: boolean
}) {
  return (
    <div className="mb-5">
      <div className="flex items-baseline gap-2">
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        {optional && <span className="text-muted-foreground text-xs italic">Optional</span>}
      </div>
      <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
    </div>
  )
}
