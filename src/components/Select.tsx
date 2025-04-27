import React from 'react';
import {
  Field,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import Image from 'next/image';
import ArrowIcon from '@/app/../../public/assets/arrow_down.svg';
import ErrorSign from '@/app/../../public/assets/red_error_sign.svg';
import { Error } from '@/types/Error';

interface Option {
  id: string | number | null;
  name: string;
}

interface Icon {
  id: string | number | null;
  icon: React.ReactNode;
}

interface SelectProps<T extends Option> {
  options: T[];
  label?: string;
  value: T | null;
  setValue: React.Dispatch<React.SetStateAction<T | null>>;
  showIconsByValue?: boolean;
  icons?: Icon[];
  errors?: Error[];
  fieldName?: string;
}

export const Select = <T extends Option>({
  options,
  label,
  value,
  setValue,
  showIconsByValue,
  icons = [],
  errors = [],
  fieldName,
}: SelectProps<T>) => {
  const getIconById = (id: string | number | null) => {
    const icon = icons.find((icon) => icon.id === id);
    return icon?.icon;
  };

  const fieldError = errors.find((error: Error) => error.field === fieldName);

  return (
    <Field>
      <Listbox value={value} onChange={setValue}>
        {({ open }) => (
          <div>
            <p className='text-textPrimary mb-[4px] text-xs'>{label}</p>
            <ListboxButton
              className={`w-[100%] h-[35px] text-left border ${
                fieldError ? 'border-red' : 'border-gray'
              } rounded-[4px] px-[12px] flex items-center`}
            >
              {value?.name ? (
                <div className='flex gap-[12px] items-center'>
                  {showIconsByValue && <>{getIconById(value.id)}</>}
                  <p className='text-sm text-textPrimary'>{value.name}</p>
                </div>
              ) : (
                <p className='opacity-[0.5] text-sm text-textPrimary'>Select</p>
              )}

              <Image
                src={ArrowIcon}
                alt='arrow_down'
                className={`ml-auto transform transition-transform ${
                  open ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </ListboxButton>

            {fieldError && (
              <div className='flex items-center mt-[3px] gap-[3px]'>
                <Image
                  src={ErrorSign}
                  className='w-[14px] h-[14px]'
                  alt='error'
                />
                <p className='text-red text-xs '>{fieldError.message}</p>
              </div>
            )}

            <ListboxOptions
              className='w-[var(--button-width)] z-[1000] bg-white border border-gray mt-[4px] rounded-[4px] !max-h-[200px] px-[3px] flex flex-col gap-[2px]'
              anchor='bottom'
            >
              {options.map((option: T, i) => {
                const isSelected = option.id === value?.id;

                return (
                  <ListboxOption
                    key={`${option.id}-${i}`}
                    value={option}
                    className={` w-[100%] rounded-[4px] ${
                      isSelected ? 'bg-textPrimary ' : 'data-[focus]:bg-gray '
                    } px-[12px] py-[10px] cursor-pointer flex items-center gap-[12px]`}
                  >
                    {showIconsByValue && <>{getIconById(option.id)}</>}
                    <p
                      className={`text-sm ${
                        isSelected ? 'text-white' : 'text-black'
                      }`}
                    >
                      {option.name}
                    </p>
                  </ListboxOption>
                );
              })}
            </ListboxOptions>
          </div>
        )}
      </Listbox>
    </Field>
  );
};
