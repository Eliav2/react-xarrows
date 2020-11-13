This doc describes suggested changes for this repo in the future. 

## Features
#### Properties
Suggested Properties that can be added to enhance component's flexibility:
- `AvoidSelf` - property which will instruct arrows to not attach from the inner sides of the containers.
- `flipStart` and `flipEnd` - property which will instruct arrows to not attach from the inner sides of the containers.
- `label` - change current api to accept numbers keys on passed object in range of 0-1 that will placed from start(0) to end(1).
#### Behavior 
- when `path='smooth'` add 2 more curves possibilities to make path pretty when connection are from the opposite sides of the anchors.

## Documentation
The documentation on this repo is examples based. A detailed description of the behavior of the arrow should be added, which will also help possible contributors understand the code of the repo better.
for example:
- how the path curves is choose on different anchors?
- how the different anchors are choose by default?

#### interactive demos
interactive demos should be added to the README.md and will be showed in the github pages version of the repo..
 
## Code
the index.tsx file is to big and hard to read and will be split to different files.

## issues
issues that yet to be fixed.
- fix https://github.com/Eliav2/react-xarrows/issues/29 (crash portal)
