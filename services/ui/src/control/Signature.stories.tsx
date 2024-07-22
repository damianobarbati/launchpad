import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@ui/component/Button';
import { Signature } from './Signature';

export default {
  title: 'Controls/Signature',
  component: Signature,
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
              <Button type="submit" className="mt-4">
                Submit
              </Button>
            </form>
            <pre className="paper mt-4 w-max min-w-64" data-testid="form-values">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </FormProvider>
      );
    },
  ],
} satisfies Meta<typeof Signature>;

type Story = StoryObj<typeof Signature>;

export const Sign: Story = {
  args: {
    name: 'signature',
    label: 'Signature',
  },
};

export const Disabled: Story = {
  args: {
    name: 'signature',
    label: 'Signature',
    disabled: true,
  },
};
