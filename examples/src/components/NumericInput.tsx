import type { CSSProperties } from 'react';

type NumericInputProps = {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  style?: { input?: CSSProperties };
};

/**
 * Drop-in stand-in for the `react-numeric-input` package, which peaks at React 16
 * and so cannot be installed alongside React 19. Keeps the same call signature
 * the examples already use: `onChange` receives the parsed number directly.
 */
const NumericInput = ({ value, onChange, min, max, step = 1, style = {} }: NumericInputProps) => (
  <input
    type="number"
    value={value ?? ''}
    min={min}
    max={max}
    step={step}
    onChange={(e) => {
      const parsed = Number(e.target.value);
      onChange?.(Number.isNaN(parsed) ? 0 : parsed);
    }}
    style={{ width: 60, ...style.input }}
  />
);

export default NumericInput;
