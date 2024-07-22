import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Button } from '../component/Button';
import { Checkbox } from './Checkbox';

export default {
  title: 'Controls/Checkbox',
  component: Checkbox,
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
          <form className="flex w-max flex-col gap-4" autoCorrect={'off'} autoComplete={'off'} noValidate={true} onSubmit={handleSubmit(onSubmit)}>
            <Story />
            <Button className="blue">Submit</Button>
          </form>
          <pre className="paper mt-4 w-max min-w-64" data-testid="form-values">
            {JSON.stringify(data, null, 2)}
          </pre>
        </FormProvider>
      );
    },
  ],
} satisfies Meta<typeof Checkbox>;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    name: 'consent',
    label: 'Consent',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input: HTMLInputElement = canvas.getByLabelText('Consent', { selector: 'input' });
    await userEvent.click(input);
    await expect(input.checked).toEqual(true);

    // submit
    const submitBtn = canvas.getByText('Submit');
    await userEvent.click(submitBtn);
    const formValues = JSON.parse(canvas.getByTestId('form-values').innerText);
    await expect(formValues).toEqual({ consent: true });
  },
};
