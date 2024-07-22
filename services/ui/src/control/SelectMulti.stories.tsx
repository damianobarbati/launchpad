import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { Option } from 'react-multi-select-component';
import { sleep } from '@common/helpers';
import { faker } from '@faker-js/faker';
import type { Meta } from '@storybook/react';
import { expect, fireEvent, userEvent, waitFor, waitForElementToBeRemoved, within } from '@storybook/test';
import { Button } from '../component/Button';
import { SelectMulti } from './SelectMulti';

export default {
  title: 'Controls / SelectMulti',
  component: SelectMulti,
  decorators: [
    (Story, { parameters }) => {
      const formMethods = useForm({ defaultValues: parameters.defaultValues });
      const [data, setData] = React.useState();
      const { handleSubmit } = formMethods;
      const onSubmit = (data) => setData(data);

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
} satisfies Meta<typeof SelectMulti>;

export const One = {
  args: {
    name: 'fruit',
    label: 'Fruit',
    options: ['apple', 'banana', 'pear', 'strawberry', 'lemon', 'orange'],
    hasSelectAll: false,
    hasClearAll: true,
    closeOnChangedValue: true,
    showCheckbox: false,
    disableSearch: true,
    selectable: 'one',
  },
  parameters: { expectedFormValues: { fruit: 'orange' } },
  play: async ({ canvasElement, args, parameters }) => {
    const canvas = within(canvasElement);

    const openArrow = canvas.getByTestId('control-fruit').querySelector('svg') as SVGElement;
    await userEvent.click(openArrow, { delay: 500 });

    await expect(canvas.getByText('apple')).toBeInTheDocument();
    await expect(canvas.getByText('orange')).toBeInTheDocument();

    // select apple
    await userEvent.click(canvas.getByText('apple'), { delay: 100 });
    // open again the option list
    if (args.closeOnChangedValue) await userEvent.click(openArrow, { delay: 500 });
    // select orange
    await userEvent.click(canvas.getByText('orange'), { delay: 100 });

    const submitBtn = canvas.getByText('Submit');
    await userEvent.click(submitBtn);
    const formValues = JSON.parse(canvas.getByTestId('form-values').innerText);
    await expect(formValues).toEqual(parameters.expectedFormValues);
  },
};

export const Many = {
  args: {
    name: 'fruit',
    label: 'Fruit',
    options: ['apple', 'banana', 'pear', 'strawberry', 'lemon', 'orange'],
    maxValuesDisplayed: 3,
    hasSelectAll: false,
    hasClearAll: false,
    closeOnChangedValue: false,
    showCheckbox: true,
    disableSearch: true,
    selectable: 'many',
  },
  parameters: { expectedFormValues: { fruit: ['apple', 'orange'] } },
  play: One.play,
};

export const AutocompleteArr = {
  args: {
    name: 'fruit',
    label: 'Fruit',
    options: ['apple', 'banana', 'pear', 'strawberry', 'lemon', 'orange'],
    debounceDuration: 0,
  },
  parameters: { expectedFormValues: { fruit: ['apple', 'banana'] } },
  play: async ({ canvasElement, parameters }) => {
    const canvas = within(canvasElement);

    const openArrow = canvas.getByTestId('control-fruit').querySelector('svg') as SVGElement;
    await userEvent.click(openArrow, { delay: 500 });
    await userEvent.click(canvas.getByText('apple'), { delay: 100 });

    const searchInput = canvas.getByPlaceholderText('Search');
    await fireEvent.change(searchInput, { target: { value: 'ba' } }); // trigger onChange event/handler
    await sleep(50); // sleep until debounceDuration + search time is passed by
    await expect(canvas.getByText('banana')).toBeInTheDocument();
    await expect(canvas.queryByText('orange')).toBeNull();
    await userEvent.click(canvas.getByText('banana'), { delay: 100 });

    const submitBtn = canvas.getByText('Submit');
    await userEvent.click(submitBtn);
    const formValues = JSON.parse(canvas.getByTestId('form-values').innerText);
    await expect(formValues).toEqual(parameters.expectedFormValues);
  },
};

export const AutocompleteObj = {
  args: {
    name: 'fruit',
    label: 'Fruit',
    options: { 1: 'apple', 2: 'banana', 3: 'pear', 4: 'strawberry', 5: 'lemon', 6: 'orange' },
    debounceDuration: 0,
  },
  parameters: { expectedFormValues: { fruit: ['1', '2'] } },
  play: AutocompleteArr.play,
};

const users = faker.helpers.multiple(
  () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
  }),
  { count: 100 },
);
users.unshift({ id: '5e0251e0-3dc0-4fbf-b8e0-4bb055a95299', name: 'Clark Kent' });
users.push({ id: 'cc0b610a-167e-4b03-92c7-adfcc9884a03', name: 'Lex Luthor' });
users.push({ id: faker.string.uuid(), name: 'Bruce Wayne' });
users.push({ id: faker.string.uuid(), name: 'Lois Lane' });
users.push({ id: faker.string.uuid(), name: 'Diana Prince' });

const getUsers = async (filter?: string) => {
  const result = filter ? users.filter((user) => user.name.toLowerCase().includes(filter.toLowerCase())) : users;
  await sleep(1000);
  return result;
};

export const Async = {
  args: {
    name: 'users',
    label: 'Users',
    debounceDuration: 100,
    maxValuesDisplayed: 5,
    options: async () => {
      // get result from API
      const users = await getUsers();
      // convert result to expected format for options: [] or {}
      const options = {};
      for (const user of users) options[user.id] = user.name;
      return options;
    },
    filterOptions: async (currentOptions: Option[], filter: string) => {
      if (!filter) return currentOptions;
      // get filtered result from API
      const users = await getUsers(filter);
      // convert result to expect format for filterOptions: [{ label, value }]
      const options: Option[] = users.map((user) => ({ label: user.name, value: user.id }));
      return options;
    },
  },
  parameters: {
    expectedFormValues: {
      users: ['5e0251e0-3dc0-4fbf-b8e0-4bb055a95299', 'cc0b610a-167e-4b03-92c7-adfcc9884a03'],
    },
  },
  play: async ({ canvasElement, parameters }) => {
    const canvas = within(canvasElement);

    // wait loading
    await waitFor(() => expect(canvas.getByTestId('control-users').querySelector('svg.spinner')).toBeInTheDocument(), { timeout: 5000 });
    await waitForElementToBeRemoved(canvas.getByTestId('control-users').querySelector('svg.spinner'), { timeout: 5000 });

    const openArrow = canvas.getByTestId('control-users').querySelector('svg:not(.spinner)') as SVGElement;

    await userEvent.click(openArrow, { delay: 500 });
    await userEvent.click(canvas.getByText('Clark Kent'), { delay: 100 });

    const searchInput = canvas.getByPlaceholderText('Search');
    await sleep(1000);
    await fireEvent.change(searchInput, { target: { value: 'luthor' } }); // trigger onChange event/handler

    // wait loading (filterOptions is not showing the spinner right now: https://github.com/hc-oss/react-multi-select-component/issues/721)
    // await waitForElementToBeRemoved(() => canvas.getByTestId('control-users').querySelector('svg.spinner'), { timeout: 5000 });
    await sleep(2000);

    await expect(canvas.getByText('Lex Luthor')).toBeInTheDocument();

    await userEvent.click(canvas.getByLabelText('Lex Luthor'), { delay: 100 });
    await userEvent.click(openArrow, { delay: 500 });

    const submitBtn = canvas.getByText('Submit');
    await userEvent.click(submitBtn);
    const formValues = JSON.parse(canvas.getByTestId('form-values').innerText);
    await expect(formValues).toEqual(parameters.expectedFormValues);
  },
};
