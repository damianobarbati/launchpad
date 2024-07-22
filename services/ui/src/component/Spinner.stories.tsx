import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';

export default {
  title: 'Components/Spinner',
  component: Spinner,
} satisfies Meta<typeof Spinner>;

type Story = StoryObj<typeof Spinner>;

export const Blue: Story = {
  args: {
    blur: false,
    centered: false,
    overlay: false,
    className: 'text-blue',
  },
};

export const Purple: Story = {
  args: {
    blur: false,
    centered: false,
    overlay: false,
    className: 'text-purple',
  },
};

export const Overlay: Story = {
  args: {
    blur: false,
    centered: true,
    overlay: true,
  },
  render: (args) => (
    <p className="relative">
      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
      veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
      consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
      adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis
      nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea
      voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
      <Spinner {...args} />
    </p>
  ),
};
