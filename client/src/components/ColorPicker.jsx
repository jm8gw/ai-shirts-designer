import { SketchPicker } from 'react-color'
import { useSnapshot } from 'valtio'

import state from '../store'

const ColorPicker = () => {
  const snap = useSnapshot(state);

  return (
    <div className='absolute left-full ml-3'>
      <SketchPicker
        color={snap.color}
        disableAlpha // for that opacity slider
        presetColors={[
          "#000000",
          "#ffffff",
          "#ff0000",
          "#00ff00",
          "#0000ff",
          "#ffff00",
          "#00ffff",
          "#ff00ff",
          "#ff8000",
          "#ff0080",
          "#80ff00",
          "#00ff80",
          "#0080ff",
          "#8000ff",
          "#ff8080",
          "#80ff80",
          "#8080ff",
          "#ff80ff",
          "#80ffff",
          "#80ff80",
        ]}
        onChange={(color) => state.color = color.hex}
      />
    </div>
  )
}

export default ColorPicker