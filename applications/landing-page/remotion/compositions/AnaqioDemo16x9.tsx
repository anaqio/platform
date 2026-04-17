import { AbsoluteFill } from 'remotion'

import { COLORS } from '../lib/brand'
import { loadFonts } from '../lib/fonts'
import { SceneCTA } from '../scenes/SceneCTA'
import { SceneGenerate } from '../scenes/SceneGenerate'
import { SceneIntro } from '../scenes/SceneIntro'
import { SceneProblem } from '../scenes/SceneProblem'
import { SceneResults } from '../scenes/SceneResults'
import { SceneUpload } from '../scenes/SceneUpload'

loadFonts()

export function AnaqioDemo16x9() {
  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <SceneIntro />
      <SceneProblem />
      <SceneUpload />
      <SceneGenerate />
      <SceneResults />
      <SceneCTA />
    </AbsoluteFill>
  )
}
