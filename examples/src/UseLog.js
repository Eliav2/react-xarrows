import { useEffect, useRef } from "react";

const timeDiff = (prevTime) =>
  Math.round((performance.now() - prevTime) * 1000) / 1000;

export const useLog = (
  componentName = "",
  effect = useEffect,
  timeCalc = null
) => {
  // keep track of phase
  const render = useRef(0);
  const call = useRef(0);

  // keep track of how much time from update call to end of effect
  const execTime = useRef(performance.now());
  execTime.current = performance.now();

  // relative timing or absolute timing?
  const getTime = () =>
    timeCalc === "abs"
      ? Math.round(performance.now() * 1000) / 1000
      : timeDiff(execTime.current);

  const consoleState = () =>
    `{call:${call.current},render:${
      render.current
    }}(${componentName}) ${getTime()}ms`;
  const log = (...args) => console.log(...args, consoleState());

  effect(() => {
    render.current += 1;
    execTime.current = performance.now();
  });
  call.current += 1;

  return log;
};
