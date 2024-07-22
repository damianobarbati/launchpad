import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import type { Option } from 'react-multi-select-component';
import { MultiSelect } from 'react-multi-select-component';
import cx from 'clsx';
import { IClose } from '../component/Icons';

/**
 * This component provides the following capabilities:
 * - Select from a fixed list ONE value with autocomplete
 * - Select from a fixed list MANY values with autocomplete
 * - Select from a dynamic list ONE value with autocomplete
 * - Select from a dynamic list MANY values with autocomplete
 */

export type options_list = string[] | number[] | Record<string, string | number> | Map<string | number | boolean, string>;
export type options_getter = (args: void) => options_list | Promise<options_list>;

export type SelectMultiProps = {
  className?: string;
  name: string;
  label: string;
  placeholder?: string;
  options: options_list | options_getter;
  selectable: 'one' | 'many';
  maxValuesDisplayed?: number;
  filterOptions?: any;
  required?: boolean;
  dynamic?: boolean;
  searchDebounceDuration?: number;
  hasSelectAll?: boolean;
  hasClearAll?: boolean;
  closeOnChangedValue?: boolean;
  disableSearch?: boolean;
  children?: React.ReactNode;
};

export const SelectMulti = ({
  className,
  name,
  label,
  placeholder = 'Choose...',
  options: opts,
  selectable,
  maxValuesDisplayed,
  filterOptions,
  required,
  dynamic,
  searchDebounceDuration,
  hasSelectAll,
  hasClearAll,
  closeOnChangedValue,
  disableSearch,
  children,
}: SelectMultiProps) => {
  const { setValue, getValues, control } = useFormContext();
  // options provided by an async getter
  const [asyncOptions, setAsyncOptions] = React.useState<null | options_list>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  // options created on the fly by the user, only if dynamic=true
  const [optionsCreated, setOptionsCreated] = React.useState<string[]>([]);

  const asyncOptionsEnabled = typeof opts === 'function';
  const asyncOptionsLoading = typeof opts === 'function' && asyncOptions === null;

  React.useEffect(() => {
    if (!asyncOptionsEnabled) return;
    void (async () => {
      setIsLoading(true);
      const async_options = await opts();
      setIsLoading(false);
      setAsyncOptions(async_options);
    })();
  }, [opts, asyncOptionsEnabled]);

  // compute options available to user including: those provided by the async getter, those created on the fly, those converted from array or obj
  const options = React.useMemo(() => {
    const result: Option[] = [];

    // options created on the fly by the user
    if (optionsCreated.length) result.push(...toOptions(optionsCreated));

    // options provided by async getter
    if (asyncOptionsEnabled && !asyncOptionsLoading && asyncOptions) result.push(...toOptions(asyncOptions));

    // options provided as array or object
    if (opts && !asyncOptionsEnabled) result.push(...toOptions(opts));

    return result;
  }, [opts, optionsCreated, asyncOptionsEnabled, asyncOptionsLoading, asyncOptions]);

  /**
   * 1) do not render before values are returned: otherwise defaultValue of select will not be honored because options do not exist at initializing time
   * 2) tofix: component re-renders on submit, thus causing isValidating=true, thus returning spinner and unmounting multiselect, thus removing last selection
   */
  const validate = (value) => value.length > 0;
  const rules = !required ? undefined : { validate };

  const onCreateOption = (value: string) => {
    setOptionsCreated([...optionsCreated, value]);
    const currentValue = getValues(name) || [];
    const nextValue = [...currentValue, value];
    setValue(name, nextValue);
    return { label: value.trim(), value: value.trim() };
  };

  const unselect = (value) => (event) => {
    event.preventDefault();
    event.stopPropagation();
    const currentValue = getValues(name) || [];
    const index = currentValue.map(String).indexOf(String(value));
    if (index !== -1) {
      currentValue.splice(index, 1);
      setValue(name, currentValue);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { value, onChange } }) => {
        const currentValue =
          selectable === 'one'
            ? options.filter((option) => String(option.value) === String(value))
            : options.filter((option) => value?.map(String).includes(String(option.value)));

        return (
          <div className={className} data-testid={`control-${name}`}>
            {label && (
              <label className="text-grey-label ml-3 block" htmlFor={`input-${name}`}>
                {label}
              </label>
            )}

            <MultiSelect
              // style this component in the style.css using the .rmsc .dropdown-heading selector!
              labelledBy={`control-${name}`}
              isLoading={isLoading}
              options={options}
              filterOptions={filterOptions}
              isCreatable={dynamic}
              onCreateOption={onCreateOption}
              hasSelectAll={hasSelectAll}
              ClearSelectedIcon={hasClearAll ? <IClose /> : null}
              closeOnChangedValue={closeOnChangedValue}
              disableSearch={disableSearch}
              debounceDuration={searchDebounceDuration}
              overrideStrings={{ selectSomeItems: placeholder }}
              onChange={(options: Option[]) => {
                // if user can select only one, pick the last one chosen and remove the rest
                if (selectable === 'one') {
                  const values = options.slice(-1);
                  onChange(values[0]?.value ?? null);
                }
                // now map option to real values we want
                else {
                  const values = options.map((option) => option.value);
                  onChange(values);
                }
              }}
              value={currentValue}
              // isOpen={true}
              ItemRenderer={({ checked, option, onClick, disabled }) => (
                <OptionRenderer showCheckbox={selectable === 'many'} checked={checked} option={option} onClick={onClick} disabled={disabled} />
              )}
              valueRenderer={(selected, _options) => (
                <SelectionRenderer selectable={selectable} selected={selected} options={_options} unselect={unselect} maxValuesDisplayed={maxValuesDisplayed} />
              )}
            />
            {children}
          </div>
        );
      }}
    />
  );
};

const OptionRenderer = ({ showCheckbox = true, checked, option, onClick, disabled }) => {
  return (
    <div className={cx('flex items-center gap-2', disabled && 'pointer-events-none opacity-50')} onChange={onClick}>
      <input type="checkbox" className={cx(!showCheckbox && 'hidden')} checked={checked} tabIndex={-1} disabled={disabled} onChange={onClick} />
      <span className="block w-full">{option.label}</span>
    </div>
  );
};

const SelectionRenderer = ({ selectable, selected, options, unselect, maxValuesDisplayed }) => {
  maxValuesDisplayed = maxValuesDisplayed || options.length;

  if (selectable === 'one') {
    return (
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {!selected.length && <span className="text-grey-placeholder">Choose...</span>}
        {!!selected.length && <span>{selected[0].label}</span>}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {!selected.length && <span>Choose...</span>}
      {selected.length <= maxValuesDisplayed &&
        selected
          .sort((a, b) => a.label.localeCompare(b.label))
          .map(({ label, value }) => (
            <div key={value} className="flex h-7 cursor-pointer flex-row items-center gap-2 rounded-lg border-2 px-2 py-1 text-black">
              <span>{label}</span>
              {selectable === 'many' ? (
                <span onClick={unselect(value)}>
                  <IClose />
                </span>
              ) : null}
            </div>
          ))}
      {selected.length > maxValuesDisplayed && <span>{selected.length} items selected</span>}
    </div>
  );
};

const toOptions = (opts: options_list | Option[]): Option[] => {
  let result: Option[] = [];

  // user provided options as array of Option (eg: [{ value: 1, label: 'John Doe' }])
  if (Array.isArray(opts) && (opts as Option[]).every((item) => item.label !== undefined && item.value !== undefined)) {
    result = opts as Option[];
  }
  // user provided options as array of string or numbers (eg: [1,2,3]
  else if (Array.isArray(opts)) {
    result = opts.map((value) => ({ label: String(value), value }));
  }
  // user provided options as a Map (eg: new Map([[true, 'yes'], [false, 'no']]))
  else if (opts instanceof Map) {
    result = Array.from(opts.entries()).map(([value, label]) => ({
      label: String(label),
      value,
    }));
  }
  // user provided options as obj (eg: {"banana": "Banana", "berry": "Strawberry"})
  else {
    result = Object.entries(opts).map(([value, label]) => ({
      label: String(label),
      value,
    }));
  }

  return result;
};
