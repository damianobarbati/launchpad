import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Button } from '../component/Button';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Controls/Select',
  component: Select,
  decorators: [
    (Story) => {
      const formMethods = useForm({
        mode: 'onTouched',
        criteriaMode: 'all',
        shouldUnregister: true,
        shouldUseNativeValidation: false,
        shouldFocusError: true,
      });
      const [data, setData] = React.useState({});
      const { handleSubmit } = formMethods;
      const onSubmit = (data: any) => setData(data);

      return (
        <FormProvider {...formMethods}>
          <div className="flex flex-col gap-12">
            <form autoCorrect={'off'} autoComplete={'off'} noValidate={true} onSubmit={handleSubmit(onSubmit)}>
              <Story />
              <Button className="blue">Submit</Button>
            </form>
            <pre className="paper mt-4 w-max min-w-64" data-testid="form-values">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </FormProvider>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Main: Story = {
  args: {
    name: 'role',
    label: 'Role',
    placeholder: 'Choose...',
    description: 'The type of role to assign.',
    options: ['admin', 'agent', 'driver'],
  },
  render: (args) => <Select {...args}>{args.children}</Select>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const select: HTMLSelectElement = canvas.getByLabelText('Role', { selector: 'select' });

    await userEvent.click(canvas.queryByText('Submit') as HTMLButtonElement);
    const formValuesBefore = JSON.parse(canvas.getByTestId('form-values').innerText);
    await expect(formValuesBefore).toEqual({ role: '' });

    await userEvent.selectOptions(select, 'driver');
    await expect(select.value).toEqual('driver');

    await userEvent.click(canvas.queryByText('Submit') as HTMLButtonElement);
    const formValuesAfter = JSON.parse(canvas.getByTestId('form-values').innerText);
    await expect(formValuesAfter).toEqual({ role: 'driver' });
  },
};

export const Required: Story = {
  args: {
    name: 'role',
    label: 'Role',
    placeholder: 'Choose...',
    description: 'The type of role to assign.',
    options: { 1: 'admin', 2: 'agent', 3: 'driver' },
    registerOptions: { required: true },
  },
  render: (args) => <Select {...args}>{args.children}</Select>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const select: HTMLSelectElement = canvas.getByLabelText('Role', { selector: 'select' });

    await userEvent.click(canvas.queryByText('Submit') as HTMLButtonElement);
    const formValuesBefore = JSON.parse(canvas.getByTestId('form-values').innerText);
    await expect(formValuesBefore).toEqual({});

    await userEvent.selectOptions(select, 'driver');
    await expect(select.value).toEqual('3');

    await userEvent.click(canvas.queryByText('Submit') as HTMLButtonElement);
    const formValuesAfter = JSON.parse(canvas.getByTestId('form-values').innerText);
    await expect(formValuesAfter).toEqual({ role: '3' });
  },
};
