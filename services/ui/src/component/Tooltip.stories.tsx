import type { Meta, StoryObj } from '@storybook/react';
import { IInfo } from './Icons';
import { Tooltip } from './Tooltip';

const DisplayComponent = ({ children }) => children;

type Story = StoryObj<typeof DisplayComponent>;

export default {
  title: 'Styling/Tooltip',
  component: DisplayComponent,
} satisfies Meta<typeof DisplayComponent>;

export const Main: Story = {
  render: () => (
    <p className={'flex items-center gap-2'}>
      <span>Active tracker alerts</span>
      <Tooltip text="This KPI display the alerts emitted by the tracker provider but not read yet.">
        <IInfo size={16} />
      </Tooltip>
    </p>
  ),
};
