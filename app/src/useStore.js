import { useEffect, useRef, useState } from 'react';
import { Store } from './store.js';

export function useStore() {
  const ref = useRef(null);
  if (!ref.current) ref.current = new Store();
  const [, setTick] = useState(0);
  useEffect(() => ref.current.subscribe(() => setTick((t) => t + 1)), []);
  return ref.current.getViewModel();
}
