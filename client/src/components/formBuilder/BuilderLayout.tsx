import BuilderCanvas from "./BuilderCanvas"
import BuilderHeader from "./BuilderHeader"
import FieldPalette from "./FieldPalette"
import FieldPropertiesPannel from "./FieldPropertiesPannel"

const BuilderLayout = () => {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-neutral-950 text-white">
      <BuilderHeader/>
      
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-85 shrink-0 overflow-y-auto border-r border-neutral-800">
          <FieldPalette />
        </aside>

        <main className="flex-1 overflow-y-auto">
          <BuilderCanvas />
        </main>

        <aside className="w-[330px] shrink-0 overflow-y-auto border-l border-neutral-800">
          <FieldPropertiesPannel />
        </aside>
      </div>
    </div>
  )
}

export default BuilderLayout