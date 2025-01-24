"use client";

import {
  Field,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import Image from "next/image";
import ArrowIcon from "@/app/assets/arrow_down.svg";

interface Option {
  id: number;
  name: string;
}

interface SelectProps {
  options: Option[];
  label?: string;
  value: Option | null;
  setValue: React.Dispatch<React.SetStateAction<Option | null>>;
}

export const Select: React.FC<SelectProps> = ({
  options,
  label,
  value,
  setValue,
}) => {
  return (
    <Field>
      <Listbox value={value} onChange={setValue}>
        {({ open }) => (
          <div>
            <p className="text-textPrimary mb-[4px] text-[12px]">{label}</p>
            <ListboxButton className="w-[100%] h-[35px] text-left border border-gray rounded-[4px] px-[12px] flex items-center">
              {value?.name ? (
                <p className="text-[14px] text-textPrimary">{value.name}</p>
              ) : (
                <p className="opacity-[0.5] text-[14px] text-textPrimary">
                  Select
                </p>
              )}

              <Image
                src={ArrowIcon}
                alt="arrow_down"
                className={`ml-auto transform transition-transform ${
                  open ? "rotate-180" : "rotate-0"
                }`}
              />
            </ListboxButton>

            <ListboxOptions
              className="w-[var(--button-width)] z-[1000] bg-white border border-gray mt-[4px] rounded-[4px]"
              anchor="bottom"
            >
              {options.map((option: Option) => (
                <ListboxOption
                  key={option.id}
                  value={option}
                  className="data-[focus]:bg-blue-100 w-[100%] px-[12px] py-[10px] cursor-pointer"
                >
                  <p className="text-[14px] text-textPrimary">{option.name}</p>
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        )}
      </Listbox>
    </Field>
  );
};
