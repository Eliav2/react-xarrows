## v1.6.0: 
- proptypes - typescript types issues fixed.
- now all pointer events enabled in the arrowhead by default ([#50](https://github.com/Eliav2/react-xarrows/issues/50))
- added properties: `SVGcanvasStyle` and `divContainerStyle` ([#42])(https://github.com/Eliav2/react-xarrows/issues/42)
- examples: bugfixes(playground) and examples update.
- a new feature! tail support!  new properties: `showHead`,`showTail`,`tailSize`,`tailColor`,`arrowTailProps` .
- renamed `extendSVGcanvas` to `_extendSVGcanvas`
- advanced customization support: newProperties: `_cpx1Offset`,`_cpy1Offset`,`_cpx2Offset`,`_cpy2Offset`.
- bugfix: in grid mode in some cases exceeded canvas.

## 1.5.0 
- properties that are completely removed and no longer supported: `consoleWarning`, `monitorDOMchanges` and `registerEvents`.
- issues related to jest and other issues has fixed.
- dependencies changed: prop-types added in lodash replaced with lodash.isequal and lodash.pick.
- v1.5.1 - minor code and docs updates. [DEPRECATED]
- v1.5.2 - debug element was published by mistake at v1.5.1. 

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

## 1.2.0 bug fixes and code structure changed
The lib not worked properly on js projects(only worked well on ts).  now working well on both.
- v1.2.1 - minor bug fix (intellij suggestinons did not apear)
- v1.2.2 - bug fixes(1#changing anchors refs without remounting broke the arrow. 2#other minors)


## 1.1.0 bug fixes and features update
props added:`label`, `dashness` and `advanced`.
`arrowStyle` removed and all his contained properties flattened to be props of xarrow directly. `strokeColor` renamed to `lineColor`.
- v1.1.1 - bug fix now labels not exceed the svg canvas. the headArrow is calcualted now . this means the line ends at the start at the arrow - and this is more natural looking(especially at large headarrows).
- v1.1.2 - bug fix. (the first arrow fixed the headarrow style for all next comming arrows)
- v1.1.3 - an entirely new algorithm to calculate arrow path and curveness. now the arrow acting "smarter". this include bug fixes,improvements and some adjustments.
           monitorDOMchanges prop default changed to true.
- v1.1.4 - bug fixes, calculation optimizations, and smart svg canvas size adjusment.
- v1.1.5 - optimazed calculations and label positioning. (Buzier curve extrema point are calculated now using derivatives and not by interpolation) other improvements as well.
- v1.1.6 - errors and warnings improved. smart adjustments for diffrent positioning style(of anchors elemntes and common ancestor element) . minor bug fixes

## 1.0.0
initial release.

