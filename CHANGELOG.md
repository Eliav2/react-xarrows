## 1.5.0 
- properties that are completely removed and no longer supported: `consoleWarning`, `monitorDOMchanges` and `registerEvents`.
issues related to jest and other issues has fixed.
now update position is occur during the component render and not as sideEffect(useEffect).
dependencies changed: prop-types added in lodash replaced with lodash.isequal and lodash.pick.
#### docs
improved documentation:
- added CHANGELOG.md file.
- added TODO.md file.
- docs in the README.md file updated

## 1.4.0: features update
- `label` property API changed.
- `path` property added

## 1.3.0: bug fixes and features update
- now `startAnchor` and `endAnchor` can be offset from normal position. see `anchorCustomPositionType` type in types declaration to see how to offset anchors.
- a new powerful feature: `passProps` - now its possible to pass methods (such event handlers) or attributes to the inner components of Xarrow.
- `consoleWarning` default prop changed to `false`.
- bug fixes and inner optimizations(arrow head implemnted now purly using path element without marker elements).## 1.2.0 
added support for javascript projects that imported the lib locally. many changes to the repo folders structure.
#### 1.2.1
minor bug fix (intellij suggestinons did not apear)
#### 1.2.2
bug fixes(1#changing anchors refs without remounting broke the arrow. 2#other minors)

## 1.1.6
errors and warnings improved. smart adjustments for diffrent positioning style(of anchors elemntes and common ancestor element) . minor bug fixes

## 1.1.5
optimazed calculations and label positioning. (Buzier curve extrema point are calculated now using derivatives and not by interpolation) other improvements as well.

## 1.1.4
bug fixes, calculation optimizations, and smart svg canvas size adjusment.

## 1.1.3
an entirely new algorithm to calculate arrow path and curveness. now the arrow acting "smarter". this include bug fixes,improvements and some adjustments.
monitorDOMchanges prop default changed to true.

## 1.1.2
bug fix. (the first arrow fixed the headarrow style for all next comming arrows)

## 1.1.1
bug fix now labels not exceed the svg canvas. the headArrow is calcualted now . this means the line ends at the start at the arrow - and this is more natural looking(especially at large headarrows).

## 1.1.0 bug fixes and features update
props added:`label`, `dashness` and `advanced`.
`arrowStyle` removed and all his contained properties flattened to be props of xarrow directly. `strokeColor` renamed to `lineColor`.

## 1.0.0
initial release.

