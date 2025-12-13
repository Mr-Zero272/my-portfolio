import { useEffect, useRef } from 'react';

type Props = Record<string, unknown>;

interface ChangedPropInfo {
  from: unknown;
  to: unknown;
  refChanged: boolean;
  valueChanged: boolean;
  type: string;
  changeType: string;
}

/**
 * Hook debug props thay đổi giữa các re-render
 * Sẽ log ra cả value changes và reference/instance changes
 */
export function useWhyDidYouUpdate(name: string, props: Props) {
  const previousProps = useRef<Props>(null);
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current++;

    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changedProps: Record<string, ChangedPropInfo> = {};

      allKeys.forEach((key) => {
        const prevValue = previousProps.current![key];
        const currentValue = props[key];

        // Nếu reference khác nhau
        if (prevValue !== currentValue) {
          // Check xem value có bằng nhau không (dù reference khác)
          const valueEqual = JSON.stringify(prevValue) === JSON.stringify(currentValue);

          changedProps[key] = {
            from: prevValue,
            to: currentValue,
            refChanged: true,
            valueChanged: !valueEqual,
            type: typeof currentValue,
            // Thông tin chi tiết về loại thay đổi
            changeType: !valueEqual ? '❌ Value Changed' : '⚠️ Reference Changed',
          };
        }
      });

      if (Object.keys(changedProps).length > 0) {
        console.group(`%c[${name}] Re-render #${renderCount.current}`, 'color: #ff6b6b; font-weight: bold;');
        console.table(changedProps);

        // Log chi tiết từng prop
        Object.entries(changedProps).forEach(([key, info]) => {
          console.log(
            `%c${key}: %c${info.changeType}`,
            'color: #4ecdc4; font-weight: bold;',
            info.valueChanged ? 'color: #ff6b6b;' : 'color: #ffa502;',
          );
          console.log(`  From:`, info.from);
          console.log(`  To:`, info.to);
        });

        console.groupEnd();
      }
    }

    previousProps.current = props;
  });
}

// ============================================
// Hook bổ sung: useWhyDidYouUpdateDetailed
// Cho phép whitelist/blacklist props
// ============================================

interface DetailedOptions {
  include?: string[];
  exclude?: string[];
  verbose?: boolean;
}

export function useWhyDidYouUpdateDetailed(
  name: string,
  props: Props,
  { include = [], exclude = [], verbose = false }: DetailedOptions = {},
) {
  const previousProps = useRef<Props>(null);
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current++;

    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });

      // Filter props theo include/exclude
      let keysToCheck = allKeys;
      if (include.length > 0) {
        keysToCheck = allKeys.filter((k) => include.includes(k));
      }
      if (exclude.length > 0) {
        keysToCheck = keysToCheck.filter((k) => !exclude.includes(k));
      }

      const changedProps: Record<string, ChangedPropInfo> = {};

      keysToCheck.forEach((key) => {
        const prevValue = previousProps.current![key];
        const currentValue = props[key];

        if (prevValue !== currentValue) {
          const valueEqual = JSON.stringify(prevValue) === JSON.stringify(currentValue);

          changedProps[key] = {
            from: prevValue,
            to: currentValue,
            refChanged: true,
            valueChanged: !valueEqual,
            type: typeof currentValue,
            changeType: !valueEqual ? 'Value Changed' : 'Reference Changed',
          };
        }
      });

      if (Object.keys(changedProps).length > 0 || verbose) {
        console.group(`%c[${name}] Re-render #${renderCount.current}`, 'color: #667eea; font-weight: bold;');

        if (Object.keys(changedProps).length === 0) {
          console.log('%cNo props changed', 'color: #95e1d3;');
        } else {
          Object.entries(changedProps).forEach(([key, info]) => {
            const emoji = info.valueChanged ? '❌' : '⚠️';
            const color = info.valueChanged ? '#ff6b6b' : '#ffa502';
            console.log(`%c${emoji} ${key}%c (${info.type})`, `color: ${color}; font-weight: bold;`, 'color: #999;');
            console.log(`  Previous:`, info.from);
            console.log(`  Current:`, info.to);
          });
        }

        console.groupEnd();
      }
    }

    previousProps.current = props;
  });
}
