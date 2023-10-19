import { useState, useRef, useCallback } from "preact/hooks";
type SetStateAction<T> = T | ((prevValue: T) => T);

export function useStateRef<T>(
  initialValue: T
): [T, (value: SetStateAction<T>) => void, { current: T }] {
  const stateRef = useRef<T>(initialValue);
  const [state, _setState] = useState<T>(initialValue);

  const setState = useCallback((newValue: SetStateAction<T>) => {
    if (typeof newValue === "function") {
      // Handle functional updates
      const updatedValue = (newValue as (prevValue: T) => T)(stateRef.current);
      stateRef.current = updatedValue;
      _setState(updatedValue);
    } else {
      stateRef.current = newValue;
      _setState(newValue);
    }
  }, []);

  return [state, setState, stateRef];
}
