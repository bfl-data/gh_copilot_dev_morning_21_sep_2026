import { clearTimeout, setTimeout } from 'node:timers';

export type DebouncedFunction<T extends (...args: never[]) => unknown> = ((
  this: ThisParameterType<T>,
  ...args: Parameters<T>
) => void) & {
  cancel(): void;
};

/**
 * Delays invoking a function until calls have stopped for the given duration.
 */
export function debounce<T extends (...args: never[]) => unknown>(
  callback: T,
  delayMs: number,
): DebouncedFunction<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  function debounced(this: ThisParameterType<T>, ...args: Parameters<T>): void {
    if (timer !== undefined) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      timer = undefined;
      callback.apply(this, args);
    }, delayMs);
  }

  debounced.cancel = () => {
    if (timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }
  };

  return debounced;
}