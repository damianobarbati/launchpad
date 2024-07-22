import React from 'react';
import type { IconType } from 'react-icons';
import cx from 'clsx';
import { ICopy, IDone } from './Icons';
import { Tooltip } from './Tooltip';

type Props = {
  copyText: string;
  copyIcon?: IconType;
  copyIconClassname?: string;
  copiedIcon?: IconType;
  copiedIconClassname?: string;
  iconSize?: number;
  tooltipText?: string;
  iconPlacement?: 'left' | 'right';
  delay?: number;
  className?: string;
  children?: React.ReactNode;
};

export const CopyableText = ({
  copyText,
  copyIcon: CopyIcon = ICopy,
  copiedIcon: CopiedIcon = IDone,
  iconSize = 20,
  tooltipText,
  iconPlacement = 'right',
  delay = 500,
  className,
  children,
  ...otherProps
}: Props) => {
  const [copied, setCopied] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (copied) {
      const timeout = window.setTimeout(() => setCopied(false), delay);
      return () => clearTimeout(timeout);
    }
  }, [copied, delay]);

  const handleCopy = React.useCallback(
    async (event: React.MouseEvent<HTMLOrSVGElement>) => {
      event.stopPropagation();
      await navigator?.clipboard?.writeText(copyText);
      setCopied(true);
    },
    [copyText],
  );

  const CopyComponent = React.useMemo(() => {
    const copyElement = <CopyIcon className="flex-none cursor-pointer fill-gray-400 hover:fill-gray-600" size={iconSize} onClick={handleCopy} />;
    if (!tooltipText) return copyElement;
    return <Tooltip text={tooltipText || ''}>{copyElement}</Tooltip>;
  }, [tooltipText, iconSize, handleCopy, CopyIcon]);

  const CopiedComponent = <CopiedIcon className="flex-none cursor-default fill-gray-400" size={iconSize} />;

  return (
    <span className={cx('flex items-center gap-2 overflow-hidden', className)}>
      {iconPlacement === 'left' && (copied ? CopiedComponent : CopyComponent)}
      <span className="truncate uppercase" {...otherProps}>
        {children}
      </span>
      {iconPlacement === 'right' && (copied ? CopiedComponent : CopyComponent)}
    </span>
  );
};
