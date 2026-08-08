import { cloneElement, useRef, type ReactElement } from 'react';
import ReactDraggable, { type DraggableProps } from 'react-draggable';

/**
 * react-draggable resolves its DOM node through ReactDOM.findDOMNode unless a
 * `nodeRef` is supplied. React 19 removed findDOMNode outright, so without a
 * nodeRef every drag resolves to undefined and dragging silently stops working.
 *
 * Supplying `nodeRef` is the library's supported escape hatch. This wrapper
 * creates one and attaches it to the child, so call sites keep the shape they
 * already had. A ref the child already declares is preserved rather than
 * overwritten.
 */
const Draggable = ({ children, ...props }: Partial<DraggableProps> & { children: ReactElement }) => {
  const nodeRef = useRef<HTMLElement>(null);
  const childRef = (children.props as { ref?: React.Ref<HTMLElement> }).ref;

  const setRef = (node: HTMLElement | null) => {
    nodeRef.current = node;
    if (typeof childRef === 'function') childRef(node);
    else if (childRef && typeof childRef === 'object') (childRef as React.RefObject<HTMLElement | null>).current = node;
  };

  return (
    <ReactDraggable {...(props as DraggableProps)} nodeRef={nodeRef as React.RefObject<HTMLElement>}>
      {cloneElement(children, { ref: setRef } as never) as never}
    </ReactDraggable>
  );
};

export default Draggable;
