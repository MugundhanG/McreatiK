/* ============================================
   TechHeroShaderPanel
   The WebGPU shader tree, split into its own chunk
   (see Hero.jsx's React.lazy import) because the
   `shaders` engine bundles its full component
   registry as part of the root Shader component —
   several hundred KB gzipped that would otherwise
   block the main /tech bundle. The parent panel's
   solid background shows instantly; this loads in
   behind it once the chunk arrives.
   ============================================ */

import React from 'react'
import { Shader, ChromaFlow, ColorWheel } from 'shaders/react'

const CHROMA_FLOW_ID = 'idmqpyk6mjcpovurzxm'

export default function TechHeroShaderPanel() {
  return (
    <Shader style={{ width: '100%', height: '100%', display: 'block' }}>
      <ChromaFlow id={CHROMA_FLOW_ID} intensity={1.3} momentum={10} visible={false} />
      <ColorWheel
        angle={{
          type: 'map',
          curve: 0,
          source: CHROMA_FLOW_ID,
          channel: 'alpha',
          inputMax: 1,
          inputMin: 0,
          outputMax: 46,
          outputMin: -180,
        }}
        colorA="#dbe6fb"
        colorB="#1E4FD9"
        colorC="#0a1660"
        colorSpace="oklab"
        mode="custom"
        scale={2.6}
        speed={0.16}
      />
    </Shader>
  )
}
