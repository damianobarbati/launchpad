import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { Tag } from './Tag';

const Palette = ({ children }) => children;

export default {
  title: 'Styling/Colors',
  component: Palette,
} satisfies Meta<typeof Palette>;

type Story = StoryObj<typeof Palette>;

export const Main: Story = {
  render: () => (
    <div className="flex gap-24">
      <div className="grid max-w-max grid-cols-3 gap-2">
        <div className="bg-aqua flex size-32 items-center justify-center rounded-lg">aqua</div>
        <div className="bg-purple flex size-32 items-center justify-center rounded-lg">purple</div>
        <div />
        {/* yellow */}
        <div className="bg-yellow-light flex size-32 items-center justify-center rounded-lg">yellow-light</div>
        <div className="bg-yellow flex size-32 items-center justify-center rounded-lg">yellow</div>
        <div className="bg-yellow-dark flex size-32 items-center justify-center rounded-lg text-white">yellow-dark</div>
        {/* red */}
        <div className="bg-red-light flex size-32 items-center justify-center rounded-lg">red-light</div>
        <div className="bg-red flex size-32 items-center justify-center rounded-lg">red</div>
        <div className="bg-red-dark flex size-32 items-center justify-center rounded-lg text-white">red-dark</div>
        {/* green */}
        <div className="bg-green-light flex size-32 items-center justify-center rounded-lg">green-light</div>
        <div className="bg-green flex size-32 items-center justify-center rounded-lg">green</div>
        <div className="bg-green-dark flex size-32 items-center justify-center rounded-lg text-white">green-dark</div>
        {/* blue */}
        <div className="bg-blue-light flex size-32 items-center justify-center rounded-lg">blue-light</div>
        <div className="bg-blue flex size-32 items-center justify-center rounded-lg">blue</div>
        <div className="bg-blue-dark flex size-32 items-center justify-center rounded-lg text-white">blue-dark</div>
        {/* grey */}
        <div className="bg-grey-light flex size-32 items-center justify-center rounded-lg text-white">grey-light</div>
        <div className="bg-grey flex size-32 items-center justify-center rounded-lg text-white">grey</div>
        <div className="bg-grey-dark flex size-32 items-center justify-center rounded-lg text-white">grey-dark</div>
      </div>
      <div className="mt-12 flex w-max flex-col justify-center gap-8">
        <div className="flex flex-row items-center gap-4">
          <p>Lorem ipsum dolor amet.</p>
          <Button className="blue">Submit</Button>
          <Button className="blue-outlined">Submit</Button>
          <Tag className="blue border">Tracker alert</Tag>
        </div>
        <div className="flex flex-row items-center gap-4">
          <p className="orange">Lorem ipsum dolor amet.</p>
          <Button className="orange">Submit</Button>
          <Button className="orange-outlined">Submit</Button>
          <Tag className="orange border">Tracker alert</Tag>
        </div>
        <div className="flex flex-row items-center gap-4">
          <p className="red">Lorem ipsum dolor amet.</p>
          <Button className="red">Submit</Button>
          <Button className="red-outlined">Submit</Button>
          <Tag className="red border">Tracker alert</Tag>
        </div>
        <div className="flex flex-row items-center gap-4">
          <p className="grey">Lorem ipsum dolor amet.</p>
          <Button className="grey">Submit</Button>
          <Button className="grey-outlined">Submit</Button>
          <Tag className="grey border">Tracker alert</Tag>
        </div>
        <div className="flex flex-row items-center gap-4">
          <p className="green">Lorem ipsum dolor amet.</p>
          <Button className="green">Submit</Button>
          <Button className="green-outlined">Submit</Button>
          <Tag className="green border">Tracker alert</Tag>
        </div>
      </div>
    </div>
  ),
};
