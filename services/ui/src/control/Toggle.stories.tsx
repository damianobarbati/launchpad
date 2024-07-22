import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from './Toggle';

export default {
  title: 'Components/Toggle',
  component: Toggle,
} satisfies Meta<typeof Toggle>;

type Story = StoryObj<typeof Toggle>;

const ToggleWrapper = (args) => (
  <div className="flex max-w-max items-center justify-center gap-3">
    <span>Enable Notifications:</span>
    <Toggle {...args} />
  </div>
);

export const Base: Story = {
  args: {
    onChange: (value: boolean) => console.log('onChange', value),
  },
  render: (args) => <ToggleWrapper {...args} />,
};

export const Checked: Story = {
  args: {
    checked: true,
    onChange: (value: boolean) => console.log('onChange', value),
  },
  render: (args) => <ToggleWrapper {...args} />,
};
