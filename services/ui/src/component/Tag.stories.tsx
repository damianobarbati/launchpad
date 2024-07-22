import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ITruck } from './Icons';
import { Tag } from './Tag';

export default {
  title: 'Components/Tag',
  component: Tag,
} satisfies Meta<typeof Tag>;

type Story = StoryObj<typeof Tag>;

export const Blue: Story = {
  args: {
    children: 'Blue',
    className: 'blue',
  },
};

export const Orange: Story = {
  args: {
    children: 'Orange',
    className: 'orange',
  },
};

export const Red: Story = {
  args: {
    children: 'Red',
    className: 'red',
  },
};

export const Icon: Story = {
  render: () => (
    <div className="flex w-32 gap-2">
      <Tag className={'red !border-0'}>
        <ITruck size={32} />
      </Tag>
      <Tag className={'green !border-0'}>
        <ITruck size={32} />
      </Tag>
      <Tag className={'blue !border-0'}>
        <ITruck size={32} />
      </Tag>
    </div>
  ),
};
