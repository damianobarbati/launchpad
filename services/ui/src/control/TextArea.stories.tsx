import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Button } from '@ui/component/Button';
import { TextArea } from './TextArea';

export default {
  title: 'Controls/TextArea',
  component: TextArea,
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
              <Button type="submit" className="blue" role="button">
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
} satisfies Meta<typeof TextArea>;

type Story = StoryObj<typeof TextArea>;

const textToType = `Two households, both alike in dignity,
In fair Verona, where we lay our scene,
From ancient grudge break to new mutiny,1
Where civil blood makes civil hands unclean.
From forth the fatal loins of these two foes
A pair of star-cross'd lovers take their life;
Whose misadventured piteous overthrows
Do with their death bury their parents' strife.
The fearful passage of their death-mark'd
love,
And the continuance of their parents' rage,
Which, but their children's end, nought could remove,
Is now the two hours' traffic of our stage;
The which if you with patient ears attend,
What here shall miss, our toil shall strive to mend.`;

export const Text: Story = {
  args: {
    name: 'story',
    label: 'Story',
    placeholder: 'Enter your book story here',
    description: 'Your next book story here',
    rows: 16,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input: HTMLTextAreaElement = canvas.getByLabelText('Story', { selector: 'textarea' });
    await userEvent.type(input, textToType, { delay: 10 });
    await expect(input.value).toEqual(textToType);
    const submit: HTMLButtonElement = canvas.getByRole('button');
    await userEvent.click(submit, { delay: 100 });
  },
};

const minLength = textToType.length + 1;
const maxLength = textToType.length * 2;

export const TextWithValidation: Story = {
  args: {
    name: 'story',
    label: 'Story',
    placeholder: 'Enter your book story here',
    description: 'Your next book story here',
    rows: 16,
    registerOptions: {
      validate: {
        minLength: (value) => value?.length >= minLength || `Minimum length must be ${minLength}.`,
        maxLength: (value) => value?.length <= maxLength || `Maximum length must be ${maxLength}.`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input: HTMLTextAreaElement = canvas.getByLabelText('Story', { selector: 'textarea' });
    await userEvent.type(input, textToType, { delay: 20 });
    await expect(input.value).toEqual(textToType);
    const submit: HTMLButtonElement = canvas.getByRole('button');
    await userEvent.click(submit);

    await expect(canvas.getByTestId('control-errors')).toHaveTextContent(`Minimum length must be ${minLength}.`);

    const formValues = JSON.parse(canvas.getByTestId('form-values').innerText);
    await expect(formValues).toEqual({});
  },
};

export const Disabled: Story = {
  args: {
    name: 'disabled',
    label: 'Disabled',
    placeholder: 'Disabled input',
    rows: 16,
    disabled: true,
  },
};
