import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Button } from './Button';
import { IArchive, IArrowBack, IArrowForward, IWhatsapp } from './Icons';

const ButtonWrapper: React.FC<any> = ({ children, ...props }) => {
  const [loading, setLoading] = React.useState(false);
  const toggleLoading = () => setLoading(!loading);

  return (
    <Button data-testid={'button-loading'} {...props} onClick={toggleLoading} loading={loading}>
      {children}
    </Button>
  );
};

export default {
  title: 'Components/Button',
  component: ButtonWrapper,
} satisfies Meta<typeof Button>;

type Story = StoryObj<typeof Button>;

export const Blue: Story = {
  args: {
    children: 'Login',
  },
  render: (args) => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-row gap-2">
        <Button RightIcon={IArchive} className="blue" {...args}>
          {args.children}
        </Button>
        <Button RightIcon={IArchive} className="blue" disabled={true} {...args}>
          {args.children}
        </Button>
        <Button RightIcon={IArchive} className="blue" loading={true} {...args}>
          {args.children}
        </Button>
      </div>
      <div className="flex flex-row gap-2">
        <Button RightIcon={IArchive} className="blue-outlined" {...args}>
          {args.children}
        </Button>
        <Button RightIcon={IArchive} className="blue-outlined" disabled={true} {...args}>
          {args.children}
        </Button>
        <Button RightIcon={IArchive} className="blue-outlined" loading={true} spinnerClassname={'fill-blue'} {...args}>
          {args.children}
        </Button>
      </div>
    </div>
  ),
};

export const Green: Story = {
  args: {
    children: 'Live chat',
    className: 'green',
    LeftIcon: IWhatsapp,
  },
};

export const Red: Story = {
  args: {
    children: 'Archive',
    className: 'red',
    RightIcon: IArchive,
  },
};

export const LeftIcon: Story = {
  args: {
    children: 'Login',
    className: 'blue',
    LeftIcon: IArrowBack,
  },
};

export const RightIcon: Story = {
  args: {
    children: 'Login',
    className: 'blue',
    RightIcon: IArrowForward,
  },
};

export const Loading: Story = {
  args: {
    children: 'Submit',
    className: 'blue',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = canvas.getByTestId('button-loading');
    await expect(canvas.getByTestId('spinner')).toBeInTheDocument();

    await userEvent.click(button, { delay: 750 });
    await expect(canvas.getByTestId('spinner')).toBeVisible();

    await userEvent.click(button, { delay: 2000 });
    await expect(canvas.getByTestId('spinner')).not.toBeVisible();
  },
};
