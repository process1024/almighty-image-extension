import { useEffect, useRef, useState, type MutableRefObject } from 'react';

type ElementTarget<T extends Element = Element> = T | MutableRefObject<T | null>;

interface MousePosition {
  x: number;
  y: number;
}

interface DragPosition {
  start: MousePosition;
  end: MousePosition;
}

type DelayTimer = ReturnType<typeof setTimeout>;

const createInitialPosition = (): DragPosition => ({
  start: { x: 0, y: 0 },
  end: { x: 0, y: 0 },
});

function getTargetElement<T extends Element>(target: ElementTarget<T>) {
  return 'current' in target ? target.current : target;
}

export function useMouseMove(target: ElementTarget) {
  const [axis, setAxis] = useState({ x: 0, y: 0 });
  const [moving, setMoving] = useState(true);

  const handleMouse: EventListener = (event) => {
    const e = event as MouseEvent;
    setAxis({
      x: e.clientX,
      y: e.clientY,
    });
  };

  function handleEnter() {
    setMoving(true);
  }
  function handleOut() {
    setMoving(false);
  }

  useEffect(() => {
    const el = getTargetElement(target);
    if (!el) {
      return undefined;
    }

    el.addEventListener('mousemove', handleMouse);
    el.addEventListener('mouseenter', handleEnter);
    el.addEventListener('mouseout', handleOut);

    return () => {
      el.removeEventListener('mousemove', handleMouse);
      el.removeEventListener('mouseenter', handleEnter);
      el.removeEventListener('mouseout', handleOut);
    };
  }, [target]);

  return {
    axis,
    moving,
  };
}

export function useMouseDrag(target: ElementTarget) {
  const [position, setPosition] = useState(createInitialPosition);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const el = getTargetElement(target);
    if (!el) {
      return undefined;
    }

    const mouseMoveEv: EventListener = (event) => {
      const e = event as MouseEvent;
      const { pageX, pageY } = e;

      setDragging(true);
      setPosition((currentPosition) => ({
        start: { ...currentPosition.start },
        end: { x: pageX, y: pageY },
      }));
    };

    const onMouseDown: EventListener = (event) => {
      const e = event as MouseEvent;
      const { pageX, pageY } = e;
      setPosition({
        start: { x: pageX, y: pageY },
        end: { x: pageX, y: pageY },
      });
      el.addEventListener('mousemove', mouseMoveEv);
    };

    const onMouseUp = () => {
      setDragging(false);
      el.removeEventListener('mousemove', mouseMoveEv);
    };

    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('mouseup', onMouseUp);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      el.removeEventListener('mouseup', onMouseUp);
      setPosition(createInitialPosition());
    };
  }, [target]);

  return { position, dragging, setPosition };
}

export function useDelayState<T>(initial: T) {
  const [state, setState] = useState(initial);
  const timerQueueRef = useRef<DelayTimer[]>([]);

  function setStateDelay(value: T, time: number = 300) {
    const timer = setTimeout(() => {
      setState(value);
      timerQueueRef.current = timerQueueRef.current.filter((item) => item !== timer);
    }, time);
    timerQueueRef.current.push(timer);
  }

  function setStateImmediately(value: T) {
    timerQueueRef.current.forEach((timer) => {
      clearTimeout(timer);
    });
    timerQueueRef.current = [];
    setState(value);
  }

  return [state, setStateImmediately, setStateDelay];
}

/**
 * 监听按键是否正按着
 */
export function useKeyPressing(key: string, target: ElementTarget = document.body) {
  const [pressing, setPressing] = useState(false);

  const onKeydown: EventListener = (event) => {
    const e = event as KeyboardEvent;
    if (e.key === key) {
      setPressing(true);
    }
  };

  const onKeyup: EventListener = (event) => {
    const e = event as KeyboardEvent;
    if (e.key === key) {
      setPressing(false);
    }
  };

  useEffect(() => {
    const el = getTargetElement(target);
    if (!el) {
      return undefined;
    }

    el.addEventListener('keydown', onKeydown);
    el.addEventListener('keyup', onKeyup);

    return () => {
      el.removeEventListener('keydown', onKeydown);
      el.removeEventListener('keyup', onKeyup);
    };
  }, [key, target]);

  return [pressing];
}
