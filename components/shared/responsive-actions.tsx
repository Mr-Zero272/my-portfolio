// components/shared/responsive-actions.tsx

import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

import { useIsMobile } from '@/hooks/use-mobile';

import { Button, ButtonProps, ButtonVariant } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Separator } from '../ui/separator';
import { Spinner } from '../ui/spinner';
import { ButtonWithTooltip } from './button-with-tooltip';

export interface ActionItem<T = void> {
  key: string;
  label: string;
  icon: React.ReactNode;
  onClick?: T extends void ? () => void | Promise<void> : (item: T) => void | Promise<void>;
  href?: string; // nếu có, render dạng Link thay vì button onClick
  target?: '_blank' | '_self';
  variant?: ButtonVariant;
  tooltip?: string; // fallback to label nếu không có
  loading?: boolean;
  disabled?: boolean;
  isInMenu?: boolean;
  /**
   * Actions có cùng `group` (và đứng liền kề nhau trong mảng `actions`) sẽ được
   * gom lại — có separator giữa các nhóm. Actions không có `group` được xem
   * là nhóm riêng lẻ của chính nó.
   */
  group?: string;
}

interface ResponsiveActionsProps<T = void> {
  context?: T;
  forceMode?: 'inline' | 'menu'; // force inline or menu
  actions: ActionItem<T>[];
}

/**
 * Gom các action liền kề có cùng `group` thành từng cụm, giữ nguyên thứ tự.
 * Lưu ý: chỉ gom các phần tử ĐỨNG LIỀN NHAU cùng group — caller cần tự sắp
 * xếp `actions` theo đúng thứ tự nhóm mong muốn.
 */
function groupConsecutive<T>(items: ActionItem<T>[]) {
  const groups: { group?: string; items: ActionItem<T>[] }[] = [];
  for (const item of items) {
    const last = groups.at(-1);
    if (last && last.group === item.group && item.group !== undefined) {
      last.items.push(item);
    } else {
      groups.push({ group: item.group, items: [item] });
    }
  }
  return groups;
}

export function ResponsiveActions<T = void>({
  context,
  actions,
  forceMode,
}: ResponsiveActionsProps<T>) {
  const isMobile = useIsMobile();

  if (!isMobile || forceMode === 'inline') {
    const inlineActions = actions.filter(
      (action) => !action.isInMenu && (action.onClick || action.href),
    );
    const menuActions = actions.filter(
      (action) => action.isInMenu && (action.onClick || action.href),
    );
    const inlineGroups = groupConsecutive(inlineActions);

    return (
      <div className="flex items-center justify-end gap-2">
        {inlineGroups.map((groupBlock, groupIndex) => (
          <div key={groupBlock.group ?? `group-${groupIndex}`} className="flex items-center gap-2">
            {groupIndex > 0 && <Separator orientation="vertical" className="h-6" />}
            <div className="flex items-center gap-2">
              {groupBlock.items.map(
                ({
                  key,
                  label,
                  icon,
                  loading,
                  onClick,
                  href,
                  target,
                  variant = 'outline',
                  tooltip,
                  disabled,
                }) => (
                  <ButtonWithTooltip
                    key={key}
                    tooltip={tooltip ?? label}
                    variant={variant as ButtonProps['variant']}
                    size="icon"
                    disabled={disabled || loading}
                    onClick={
                      !href
                        ? () => {
                            if (!onClick) return;

                            if (context !== undefined) {
                              void (onClick as (context: T) => void)(context);
                            } else {
                              void (onClick as () => void)();
                            }
                          }
                        : undefined
                    }
                    {...(href ? { render: <Link href={href} target={target} /> } : {})}
                  >
                    {icon ? loading ? <Spinner /> : icon : null}
                    <span className="sr-only">{label}</span>
                  </ButtonWithTooltip>
                ),
              )}
            </div>
          </div>
        ))}

        {menuActions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon" className="h-8 w-8" />}
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Mở menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                {groupConsecutive(menuActions).map((groupBlock, groupIndex) => (
                  <div key={groupBlock.group ?? `menu-group-${groupIndex}`}>
                    {groupIndex > 0 && <DropdownMenuSeparator />}
                    {groupBlock.items.map(
                      ({ key, label, icon, onClick, href, target, variant, disabled, loading }) => (
                        <DropdownMenuItem
                          key={key}
                          variant={variant === 'destructive' ? 'destructive' : 'default'}
                          disabled={disabled || loading}
                          onClick={
                            !href
                              ? () => {
                                  if (!onClick) return;

                                  if (context !== undefined) {
                                    void (onClick as (context: T) => void)(context);
                                  } else {
                                    void (onClick as () => void)();
                                  }
                                }
                              : undefined
                          }
                          {...(href ? { render: <Link href={href} target={target} /> } : {})}
                        >
                          {loading ? <Spinner /> : icon} {label}
                        </DropdownMenuItem>
                      ),
                    )}
                  </div>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    );
  }

  const mobileActions = actions.filter((action) => action.onClick || action.href);
  const mobileGroups = groupConsecutive(mobileActions);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">Mở menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {mobileGroups.map((groupBlock, groupIndex) => (
            <div key={groupBlock.group ?? `mobile-group-${groupIndex}`}>
              {groupIndex > 0 && <DropdownMenuSeparator />}
              {groupBlock.items.map(
                ({ key, label, icon, onClick, href, target, variant, disabled, loading }) => (
                  <DropdownMenuItem
                    key={key}
                    variant={variant === 'destructive' ? 'destructive' : 'default'}
                    disabled={disabled || loading}
                    onClick={
                      !href
                        ? () => {
                            if (!onClick) return;

                            if (context !== undefined) {
                              void (onClick as (context: T) => void)(context);
                            } else {
                              void (onClick as () => void)();
                            }
                          }
                        : undefined
                    }
                    {...(href ? { render: <Link href={href} target={target} /> } : {})}
                  >
                    {loading ? <Spinner /> : icon} {label}
                  </DropdownMenuItem>
                ),
              )}
            </div>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
