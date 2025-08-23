import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverProps {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  onIntersect?: () => void;
  enabled?: boolean;
}

/**
 * 交叉观察器钩子
 * 
 * 用于检测元素是否进入视口，可用于实现懒加载、无限滚动等功能
 * 
 * @param options 配置选项
 * @returns [ref, isIntersecting] - ref为要观察的元素引用，isIntersecting表示元素是否可见
 */
export function useIntersectionObserver({
  root = null,
  rootMargin = '0px',
  threshold = 0,
  onIntersect,
  enabled = true
}: UseIntersectionObserverProps = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!enabled || !window.IntersectionObserver) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsIntersecting(entry.isIntersecting);
          
          if (entry.isIntersecting && onIntersect) {
            onIntersect();
          }
        });
      },
      { root, rootMargin, threshold }
    );

    const currentTarget = targetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [root, rootMargin, threshold, onIntersect, enabled]);

  return [targetRef, isIntersecting] as const;
}