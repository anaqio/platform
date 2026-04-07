import { StudioShell } from '@/components/studio/StudioShell'
import { createClient } from '@/lib/supabase/server'

export default async function StudioPage() {
  const supabase = await createClient()

  const { data: presets, error } = await supabase
    .from('preset_models')
    .select('id, created_at, label, label_ar, preview_path, gender, style_tags, active, sort_order')
    .eq('active', true)
    .order('sort_order')

  if (error) throw new Error(`[preset_models.select] ${error.message}`)

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold">Virtual Try-On Studio</h1>
        <p className="text-muted-foreground mt-2">
          Upload your garment, choose a model, and see the magic
        </p>
      </div>
      <StudioShell presets={presets ?? []} />
    </main>
  )
}
