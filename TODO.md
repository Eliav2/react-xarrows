- change calculation style from `left right up down` style to `forward backward left right` style
- add option to render custom svg - improve automatic scaling
- add `gridRadius` prop

for V2:

- in anchors advanced custom: rename `rightness`,`bottomness` to `x`,`y`, and add `rightness`,`forward` from the arrow
  point of view.
- should replace all svg animations with react-spring animations.
- `curveness` and `gridBreak` will be combined to `path`. 
- change `anchorCustomPositionType`
- should change architecture
