import BuilderCanvas from "./BuilderCanvas"
import BuilderHeader from "./BuilderHeader"
import FieldPalette from "./FieldPalette"
import FieldPropertiesPannel from "./FieldPropertiesPannel"

const BuilderLayout = () => {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <BuilderHeader />
      <div className="flex flex-1 overflow-hidden">
        <FieldPalette />
        <BuilderCanvas />
        <FieldPropertiesPannel />
      </div>
    </div>
  )
}

export default BuilderLayout