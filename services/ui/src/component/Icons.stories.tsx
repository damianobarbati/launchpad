import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import * as icons from './Icons';

const DisplayComponent = () => (
  <div className="grid max-w-max grid-cols-5 gap-1">
    {Object.entries(icons).map(([key, Icon], index) => (
      <div key={key} className="flex flex-col gap-2">
        <div key={index} className="bg-blue max-w-max p-3 text-3xl text-white">
          <Icon />
        </div>
        <span className="body3">{key}</span>
      </div>
    ))}
  </div>
);

type IconType = (typeof icons)[keyof typeof icons];

export default {
  title: 'Components/Icons',
  component: DisplayComponent,
} satisfies Meta<IconType>;

type Story = StoryObj<IconType>;

export const Icons: Story = {
  render: () => <DisplayComponent />,
};
