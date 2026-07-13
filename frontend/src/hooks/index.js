import { useCallback, useRef, useState } from 'react';

/**
 * useCountdown — counts from `from` to 0, calls onComplete when done.
 * @param {number}   from         Starting value
 * @param {function} onComplete   Called when countdown reaches 0
 * @returns {{ count, start, reset, running }}
 */
export function useCountdown(from, onComplete) {
  const [count,   setCount]   = useState(from);
  const [running, setRunning] = useState(false);
  const timerRef              = useRef(null);

  const start = useCallback(() => {
    if (running) return;
    setCount(from);
    setRunning(true);

    let remaining = from;
    timerRef.current = setInterval(() => {
      remaining -= 1;
      setCount(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        setRunning(false);
        onComplete?.();
      }
    }, 1000);
  }, [from, onComplete, running]);

  const reset = useCallback(() => {
    clearInterval(timerRef.current);
    setRunning(false);
    setCount(from);
  }, [from]);

  return { count, start, reset, running };
}

/**
 * useToggle — simple boolean toggle.
 * @param {boolean} initial
 * @returns {[boolean, function]}
 */
export function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle];
}

/**
 * useMultiSelect — manage a set of selected items.
 * @param {any[]} initial
 * @returns {{ selected, toggle, has, clear, set }}
 */
export function useMultiSelect(initial = []) {
  const [selected, setSelected] = useState(initial);

  const toggle = useCallback((item) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  }, []);

  const has   = useCallback((item) => selected.includes(item), [selected]);
  const clear = useCallback(() => setSelected([]), []);
  const set   = useCallback((items) => setSelected(items), []);

  return { selected, toggle, has, clear, set };
}

/**
 * usePrevious — track previous value of a variable.
 * @param {any} value
 * @returns {any}
 */
export function usePrevious(value) {
  const ref = useRef(undefined);
  const prev = ref.current;
  ref.current = value;
  return prev;
}
