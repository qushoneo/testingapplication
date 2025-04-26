import Checkbox from '@/components/Checkbox';
import React, { ReactNode } from 'react';

interface TableField {
  value: string;
  name: string;
  width: string;
}

interface TableProps<T> {
  data: T[];
  fields: TableField[];
  isSelected?: (item: T) => boolean;
  onSelect?: (item: T) => void;
  onUnselect?: (item: T) => void;
  onRowClick?: (item: T) => void;
  renderCell: (item: T, fieldName: string, fieldWidth: string) => ReactNode;
  className?: string;
  sortField?: string;
}

export default function Table<T extends { id: number | string }>({
  data,
  fields,
  isSelected = () => false,
  onSelect,
  onUnselect,
  onRowClick,
  renderCell,
  className,
  sortField,
}: TableProps<T>) {
  return (
    <div
      className={`mt-[12px] flex flex-col gap-[4px] relative z-1 h-full w-full ${className}`}
    >
      {[...data]
        .sort((a, b) => {
          if (sortField) {
            const aValue = String(a[sortField as keyof T]).toLowerCase();
            const bValue = String(b[sortField as keyof T]).toLowerCase();
            return aValue.localeCompare(bValue);
          }

          return 0;
        })
        .map((item) => {
          const selected = isSelected(item);
          return (
            <div
              key={item.id}
              className={`flex gap-[12px] px-[32px] py-[4px] ${
                selected ? 'bg-lightgray' : ''
              } group cursor-pointer`}
              onClick={() => {
                if (onRowClick) onRowClick(item);
              }}
            >
              {(onSelect || onUnselect) && (
                <Checkbox
                  isActive={selected}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selected) {
                      onUnselect && onUnselect(item);
                    } else {
                      onSelect && onSelect(item);
                    }
                  }}
                  className={`absolute left-[8px] ${
                    selected ? 'block' : 'hidden'
                  } group-hover:block`}
                />
              )}

              {fields.map((field, j) => (
                <React.Fragment key={'col-' + j + '-' + field.value}>
                  {renderCell(item, field.value, field.width)}
                </React.Fragment>
              ))}
            </div>
          );
        })}
    </div>
  );
}
