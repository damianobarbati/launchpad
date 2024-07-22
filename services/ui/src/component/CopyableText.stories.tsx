import type { Meta, StoryObj } from '@storybook/react';
import { CopyableText } from './CopyableText';
import { IEmail, IOutlineEmail } from './Icons';

export default {
  title: 'Components/CopyableText',
  component: CopyableText,
} satisfies Meta<typeof CopyableText>;

type Story = StoryObj<typeof CopyableText>;

export const Default: Story = {
  args: {
    children: 'admin@gmail.com',
  },
};

export const IconOnLeft: Story = {
  args: {
    children: 'admin@gmail.com',
    iconPlacement: 'left',
  },
};

export const Tooltip: Story = {
  args: {
    children: 'admin@gmail.com',
    tooltipText: 'Copy email',
  },
};

export const CustomIcons: Story = {
  args: {
    children: 'admin@gmail.com',
    copiedIcon: IEmail,
    copyIcon: IOutlineEmail,
  },
};

export const IncreasedDelay: Story = {
  args: {
    children: 'admin@gmail.com',
    delay: 2000,
  },
};

export const BiggerIcons: Story = {
  args: {
    children: 'admin@gmail.com',
    iconSize: 30,
  },
};

export const CustomClassname: Story = {
  args: {
    children: 'admin@gmail.com',
    className: '!gap-4 p-2 bg-blue-100 rounded-lg max-w-max border-2 border-blue-200 flex-row-reverse',
  },
};
