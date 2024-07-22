import React from 'react';
import ReactDOM from 'react-dom';
import type { TooltipRefProps } from 'react-tooltip';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import cx from 'clsx';

type Props = {
  className?: string;
  text: string;
  children: React.ReactNode;
  tooltipProps?: TooltipRefProps;
  otherProps?: React.HTMLProps<HTMLDivElement>;
};

export const BodyPortal = ({ children }) => {
  const element = React.useRef(document.createElement('div'));

  React.useEffect(() => {
    const node = element.current;
    node.classList.add('body-portal');
    document.body.appendChild(node);
    return () => {
      document.body.removeChild(node);
    };
  }, []);

  return ReactDOM.createPortal(children, element.current);
};

export const Tooltip: React.FC<Props> = ({ className, text, children, tooltipProps, ...otherProps }: Props) => {
  return (
    <span className={cx(className)} {...otherProps} data-tooltip-id="tooltip" data-tooltip-content={text}>
      <BodyPortal>
        {/*type="light" effect="solid"*/}
        <ReactTooltip id="tooltip" className="max-w-64 !text-[10px]" {...tooltipProps} />
      </BodyPortal>
      {children}
    </span>
  );
};
