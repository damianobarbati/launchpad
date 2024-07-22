import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const DisplayComponent = ({ children }) => children;

type Story = StoryObj<typeof DisplayComponent>;

export default {
  title: 'Styling/Typography',
  component: DisplayComponent,
} satisfies Meta<typeof DisplayComponent>;

export const Main: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <h1>{'<h1>The quick brown fox jumps over the lazy dog.</h1>'}</h1>
      <h2>{'<h2>The quick brown fox jumps over the lazy dog</h2>'}</h2>
      <h3>{'<h3>The quick brown fox jumps over the lazy dog.</h3>'}</h3>
      <p>{'<p>The quick brown fox jumps over the lazy dog.</p>'}</p>
      <span>{'<span>The quick brown fox jumps over the lazy dog.</span>'}</span>
      <small>{'<small>The quick brown fox jumps over the lazy dog.</small>'}</small>
      {/*
      <p className="subtitle1">{'The quick brown fox jumps over the lazy dog.'}</p>
      <p className="subtitle2">{'The quick brown fox jumps over the lazy dog.'}</p>
      <p className="body1">The quick brown fox jumps over the lazy dog.</p>
      <p className="body2">The quick brown fox jumps over the lazy dog.</p>
      <p className="body3">The quick brown fox jumps over the lazy dog.</p>
      <p className="body4">The quick brown fox jumps over the lazy dog.</p>
      <p className="caption">The quick brown fox jumps over the lazy dog.</p>
      <p className="caption2">The quick brown fox jumps over the lazy dog.</p>
      */}
    </div>
  ),
};
