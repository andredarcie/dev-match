import { useRef, useCallback, useState } from "react";

interface SwipeState {
  offsetX: number;
  isSwiping: boolean;
}

interface UseSwipeOptions {
  threshold?: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export function useSwipe({ threshold = 100, onSwipeLeft, onSwipeRight }: UseSwipeOptions) {
  const startX = useRef(0);
  const [state, setState] = useState<SwipeState>({ offsetX: 0, isSwiping: false });

  const handleStart = useCallback((clientX: number) => {
    startX.current = clientX;
    setState({ offsetX: 0, isSwiping: true });
  }, []);

  const handleMove = useCallback((clientX: number) => {
    setState((prev) => {
      if (!prev.isSwiping) return prev;
      return { ...prev, offsetX: clientX - startX.current };
    });
  }, []);

  const handleEnd = useCallback(() => {
    setState((prev) => {
      if (!prev.isSwiping) return prev;
      if (prev.offsetX > threshold) {
        onSwipeRight();
      } else if (prev.offsetX < -threshold) {
        onSwipeLeft();
      }
      return { offsetX: 0, isSwiping: false };
    });
  }, [threshold, onSwipeLeft, onSwipeRight]);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => handleStart(e.touches[0].clientX),
    [handleStart]
  );
  const onTouchMove = useCallback(
    (e: React.TouchEvent) => handleMove(e.touches[0].clientX),
    [handleMove]
  );
  const onTouchEnd = useCallback(() => handleEnd(), [handleEnd]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      handleStart(e.clientX);
    },
    [handleStart]
  );
  const onMouseMove = useCallback(
    (e: React.MouseEvent) => handleMove(e.clientX),
    [handleMove]
  );
  const onMouseUp = useCallback(() => handleEnd(), [handleEnd]);
  const onMouseLeave = useCallback(() => {
    if (state.isSwiping) handleEnd();
  }, [state.isSwiping, handleEnd]);

  return {
    offsetX: state.offsetX,
    isSwiping: state.isSwiping,
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseLeave,
    },
  };
}
