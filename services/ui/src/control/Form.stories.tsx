import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { MdVisibilityOff } from 'react-icons/md';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../component/Button';
import { Checkbox } from './Checkbox';
import { Input } from './Input';
import { SelectMulti } from './SelectMulti';

const DisplayComponent = ({ children }) => children;

type Story = StoryObj<typeof DisplayComponent>;

export default {
  title: 'Controls/Form',
  component: DisplayComponent,
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
          <form autoCorrect={'off'} autoComplete={'off'} noValidate={true} onSubmit={handleSubmit(onSubmit)}>
            <div className="paper relative flex flex-col gap-6">
              <Story />
              <div className="absolute right-8 top-8">
                <pre className="paper w-max min-w-64" data-testid="form-values">
                  Values:&nbsp;
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            </div>
          </form>
        </FormProvider>
      );
    },
  ],
} satisfies Meta<typeof DisplayComponent>;

export const Main: Story = {
  render: () => {
    return (
      <div className="flex max-w-[450px] flex-col gap-6">
        <Input
          name={'name'}
          className="min-w-96"
          type={'text'}
          label={'Full Name:'}
          registerOptions={{
            validate: {
              pattern: (value) => (value?.match(/^[\p{L}'][ \p{L}'-]*\p{L}$/u) ? undefined : 'Name can only contain letters.'),
              minLength: (value) => (value?.length >= 8 ? undefined : 'Minimum length must be 2.'),
              maxLength: (value) => (value?.length <= 20 ? undefined : 'Maximum length must be 20.'),
            },
          }}
        />

        <Input
          name={'email'}
          className="min-w-96"
          type={'text'}
          label={'Email address:'}
          description={
            <span className="flex items-center gap-1">
              <MdVisibilityOff className="fill-grey-light size-8 w-6" />
              We won&apos;t share your email with anyone.
            </span>
          }
          registerOptions={{
            validate: {
              pattern: (value) => (value?.match(/.+@.+\..+/) ? undefined : 'Email is not valid.'),
              minLength: (value) => (value?.length >= 8 ? undefined : 'Minimum length must be 8.'),
              maxLength: (value) => (value?.length <= 20 ? undefined : 'Maximum length must be 20.'),
            },
          }}
        />

        <Input
          name={'birthdate'}
          type={'date'}
          className="min-w-64"
          label={'Date of birth:'}
          registerOptions={{
            required: true,
          }}
        />

        <Input
          name={'years_experience'}
          type={'number'}
          className="min-w-64"
          disabled={true}
          label={'Years of experience:'}
          description={'Years you worked in the sector.'}
          min={0}
          max={100}
          step={1}
          registerOptions={{
            required: true,
          }}
        />

        <SelectMulti
          label={'Role'}
          name={'role'}
          options={['admin', 'agent', 'driver']}
          selectable={'one'}
          disableSearch={true}
          required={true}
          closeOnChangedValue={true}
        />

        <SelectMulti
          name={'fruit'}
          label={'Favourite fruits:'}
          options={{ 1: 'apple', 2: 'banana', 3: 'pear', 4: 'strawberry', 5: 'lemon', 6: 'orange' }}
          selectable={'many'}
        />

        <Checkbox name={'consent'} label={'I agree with terms and conditions'} />

        <div className="mt-6 flex justify-between gap-3">
          <Button className="red-outlined">Cancel</Button>
          <Button className="blue">Submit</Button>
        </div>
      </div>
    );
  },
};
