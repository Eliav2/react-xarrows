import { useState } from 'react';

export const useRerender = () => {
  const [, setRender] = useState({});
  const reRender = () => setRender({});
  return reRender;
};
