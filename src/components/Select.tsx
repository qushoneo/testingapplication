import {
  Field,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import Image from "next/image";
import ArrowIcon from "@/app/assets/arrow_down.svg";
import ErrorSign from "@/app/assets/red_error_sign.svg";

interface Option {
  id: string | number | null;
  name: string;
}

interface SelectProps<T extends Option> {
  options: T[];
  label?: string;
  value: T | null;
  setValue: React.Dispatch<React.SetStateAction<T | null>>;
  hasError?: boolean;
  errorMessage?: string;
}

export const Select = <T extends Option>({
  options,
  label,
  value,
  setValue,
  hasError,
  errorMessage,
}: SelectProps<T>) => {
  return (
    <Field>
      <Listbox value={value} onChange={setValue}>
        {({ open }) => (
          <div>
            <p className="text-textPrimary mb-[4px] text-xs">{label}</p>
            <ListboxButton
              className={`w-[100%] h-[35px] text-left border ${
                hasError ? "border-red" : "border-gray"
              } rounded-[4px] px-[12px] flex items-center`}
            >
              {value?.name ? (
                <p className="text-sm text-textPrimary">{value.name}</p>
              ) : (
                <p className="opacity-[0.5] text-sm text-textPrimary">Select</p>
              )}

              <Image
                src={ArrowIcon}
                alt="arrow_down"
                className={`ml-auto transform transition-transform ${
                  open ? "rotate-180" : "rotate-0"
                }`}
              />
            </ListboxButton>

            {hasError && errorMessage && (
              <div className="flex items-center mt-[3px] gap-[3px]">
                <Image
                  src={ErrorSign}
                  className="w-[14px] h-[14px]"
                  alt="error"
                />
                <p className="text-red text-xs ">{errorMessage}</p>
              </div>
            )}

            <ListboxOptions
              className="w-[var(--button-width)] z-[1000] bg-white border border-gray mt-[4px] rounded-[4px] !max-h-[200px]"
              anchor="bottom"
            >
              {options.map((option: T) => (
                <ListboxOption
                  key={option.id}
                  value={option}
                  className="data-[focus]:bg-blue-100 w-[100%] px-[12px] py-[10px] cursor-pointer"
                >
                  <p className="text-sm text-textPrimary">{option.name}</p>
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        )}
      </Listbox>
    </Field>
  );
};
