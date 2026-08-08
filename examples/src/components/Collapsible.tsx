import type { CSSProperties, ReactNode } from 'react';

type CollapsibleProps = {
  children?: ReactNode;
  trigger?: ReactNode;
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  style?: CSSProperties;
  contentOuterStyle?: CSSProperties;
  contentInnerStyle?: CSSProperties;
  triggerStyle?: CSSProperties;
  containerElementProps?: { style?: CSSProperties };
  /** Accepted for call-site compatibility; <details> handles its own animation. */
  transitionTime?: number;
};

/**
 * Stand-in for the `react-collapsible` package, which declares support only up
 * to React 18. Built on <details>, so open/close state, keyboard access and
 * accessibility come from the platform rather than from JS.
 */
const Collapsible = ({
  children,
  trigger,
  open,
  onOpen,
  onClose,
  style = {},
  contentOuterStyle = {},
  contentInnerStyle = {},
  triggerStyle = {},
  containerElementProps = {},
}: CollapsibleProps) => (
  <details
    open={open}
    style={{ ...containerElementProps.style, ...style }}
    onToggle={(e) => ((e.currentTarget as HTMLDetailsElement).open ? onOpen?.() : onClose?.())}>
    <summary style={{ cursor: 'pointer', userSelect: 'none', ...triggerStyle }}>{trigger}</summary>
    <div style={contentOuterStyle}>
      <div style={contentInnerStyle}>{children}</div>
    </div>
  </details>
);

export default Collapsible;
