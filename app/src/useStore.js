import { useEffect, useRef, useState } from 'react';
import { Store } from './store.js';

export function useStore() {
  const ref = useRef(null);
  if (!ref.current) ref.current = new Store();
  const [, setTick] = useState(0);
  useEffect(() => ref.current.subscribe(() => setTick((t) => t + 1)), []);

  // Stable imperative API for Pendo guides (and other integrations) to drive
  // the UI without brittle DOM selectors — a contract we control. From a guide
  // step's JavaScript you can call e.g. window.clearcomply.close() to close the
  // "+ New" modal as the step advances, or window.clearcomply.tab('project') to
  // switch the modal to the Project tab.
  useEffect(() => {
    const s = ref.current;
    window.clearcomply = {
      open: (mode) => s.openOnboard(mode || 'sub'), // open the "+ New" modal ('sub' | 'project')
      close: () => s.closeOnboard(),                 // close the "+ New" modal
      tab: (mode) => s.setOnboardMode(mode),         // switch modal tab: 'sub' | 'project'
      next: () => s.onboardNext(),                   // advance the onboarding wizard a step
      back: () => s.onboardBack(),                   // step back in the wizard
      nav: (view) => s.setNav(view),                 // navigate app: 'dashboard' | 'subs' | 'projects'
      home: () => s.goHome(),
    };
    return () => { if (window.clearcomply) delete window.clearcomply; };
  }, []);

  return ref.current.getViewModel();
}
