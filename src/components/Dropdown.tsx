import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ReactNode } from "react";

interface DropdownOption {
  label: string;
  onClick: () => void;
}

interface DropdownProps {
  children: ReactNode;
  options: DropdownOption[];
}

export default function Dropdown({ children, options }: DropdownProps) {
  return (
    <Menu>
      <MenuButton>{children}</MenuButton>
      <MenuItems
        anchor="bottom"
        className="w-[180px] bg-white border border-gray rounded-[4px] mt-[4px] ml-[90px]"
      >
        {options.map((option, i) => (
          <MenuItem key={i}>
            <div
              className="block hover:bg-textPrimary cursor-pointer px-[8px] py-[4px] group"
              onClick={option.onClick}
            >
              <p className="group-hover:text-white">{option.label}</p>
            </div>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}
