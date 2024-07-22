import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { ISearch } from '../component/Icons';
import { Input } from './Input';

export default {
  title: 'Controls/Input',
  component: Input,
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
            </form>
            <pre className="paper mt-4 w-max min-w-64" data-testid="form-values">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </FormProvider>
      );
    },
  ],
} satisfies Meta<typeof Input>;

type Story = StoryObj<typeof Input>;

export const Text: Story = {
  args: {
    name: 'email',
    type: 'text',
    label: 'Email',
    placeholder: 'Enter your email',
    description: 'The email you used to register on the service.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input: HTMLInputElement = canvas.getByLabelText('Email', { selector: 'input' });
    await userEvent.type(input, 'jonh.doe@gmail.com', { delay: 50 });
    await expect(input.value).toEqual('jonh.doe@gmail.com');
    // submit
    await userEvent.type(input, '{enter}');
    const formValues = JSON.parse(canvas.getByTestId('form-values').innerText);
    await expect(formValues).toEqual({ email: 'jonh.doe@gmail.com' });
  },
};

export const TextWithValidation: Story = {
  args: {
    name: 'email',
    type: 'text',
    label: 'Email',
    placeholder: 'Enter your email',
    description: 'The email you used to register on the service.',
    registerOptions: {
      validate: {
        pattern: (value) => value?.match(/@/) || 'Email is not valid.',
        minLength: (value) => value?.length >= 8 || 'Minimum length must be 8.',
        maxLength: (value) => value?.length <= 20 || 'Maximum length must be 20.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input: HTMLInputElement = canvas.getByLabelText('Email', { selector: 'input' });
    await userEvent.type(input, 'jonh.doe@gmail.com', { delay: 50 });
    await expect(input.value).toEqual('jonh.doe@gmail.com');
    await userEvent.type(input, '{enter}');

    await expect(canvas.getByTestId('control-errors')).toHaveTextContent('Email is not valid.');
    await expect(canvas.getByTestId('control-errors')).toHaveTextContent('Minimum length must be 8.');

    const formValues = JSON.parse(canvas.getByTestId('form-values').innerText);
    await expect(formValues).toEqual({});
  },
};

export const Password: Story = {
  args: {
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    description: 'The password you used to register on the service.',
    registerOptions: {
      validate: {
        minLength: (value) => value?.length >= 8 || 'Minimum length must be 8.',
        maxLength: (value) => value?.length <= 20 || 'Maximum length must be 20.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input: HTMLInputElement = canvas.getByLabelText('Password', { selector: 'input' });
    await userEvent.type(input, 'p4ss4w0rd', { delay: 50 });
    await expect(input.value).toEqual('p4ss4w0rd');
    await userEvent.type(input, '{enter}');
    const formValues = JSON.parse(canvas.getByTestId('form-values').innerText);
    await expect(formValues).toEqual({ password: 'p4ss4w0rd' });
  },
};

export const Number: Story = {
  args: {
    name: 'age',
    type: 'number',
    label: 'Age',
    step: 0.1,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input: HTMLInputElement = canvas.getByLabelText('Age', { selector: 'input' });
    await userEvent.type(input, '1', { delay: 50 });
    await expect(input.value).toEqual('1');
    await userEvent.keyboard('{ArrowUp}'); // tofix: not incrementing the input
    await userEvent.type(input, '{enter}');
    const formValues = JSON.parse(canvas.getByTestId('form-values').innerText);
    await expect(formValues).toEqual({ age: 1.1 });
  },
};

export const Date: Story = {
  args: {
    name: 'datetime',
    type: 'datetime-local',
    label: 'Date',
    placeholder: 'Pick a date',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input: HTMLInputElement = canvas.getByTestId('input');
    await userEvent.type(input, '2024-02-20T12:00'); // tofix: warnings in console
    await expect(input.value).toEqual('2024-02-20T12:00');
    await userEvent.type(input, '{enter}');
    const formValues = JSON.parse(canvas.getByTestId('form-values').innerText);
    await expect(formValues).toEqual({ datetime: '2024-02-20T12:00:00Z' });
  },
};

export const Search: Story = {
  args: {
    name: 'search',
    type: 'text',
    label: 'Search',
    placeholder: 'Type any ID, name or email.',
    RightIcon: ISearch,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input: HTMLInputElement = canvas.getByLabelText('Search', { selector: 'input' });
    await userEvent.type(input, 'john', { delay: 50 });
    await expect(input.value).toEqual('john');
    await userEvent.type(input, '{enter}');
    const formValues = JSON.parse(canvas.getByTestId('form-values').innerText);
    await expect(formValues).toEqual({ email: 'john' });
  },
};

export const Disabled: Story = {
  args: {
    name: 'disabled',
    label: 'Disabled',
    placeholder: 'Disabled input',
    disabled: true,
  },
};
