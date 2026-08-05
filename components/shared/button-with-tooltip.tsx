import { Button, ButtonProps } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface ButtonWithTooltipProps extends ButtonProps {
  tooltip?: string;
}

export const ButtonWithTooltip: React.FC<ButtonWithTooltipProps> = ({
  tooltip,
  ...buttonProps
}) => {
  if (!tooltip) {
    return <Button {...buttonProps} />;
  }

  return (
    <Tooltip>
      <TooltipTrigger render={<Button {...buttonProps} />} />
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
};
