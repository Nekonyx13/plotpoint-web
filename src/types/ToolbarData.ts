export default interface ToolbarData {
  zoom: number
  mode: string
  dragging: boolean
  dragStart: { x: number; y: number }
  dragEnd: { x: number; y: number }
}
