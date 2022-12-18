import { positionType } from "shared/hooks/usePosition";

// export const cAnchorEdge = ["middle", "left", "right", "top", "bottom", "auto"] as const;
const cAnchorsMap = {
  middle: { x: 0.5, y: 0.5 },
  left: { x: 0, y: 0.5 },
  right: { x: 1, y: 0.5 },
  top: { x: 0.5, y: 0 },
  bottom: { x: 0.5, y: 1 },
} as const;

type AnchorsEdges = keyof typeof cAnchorsMap;
type AnchorsOptions = AnchorsEdges | "auto";

const useAutoSelectAnchor = () => {};
