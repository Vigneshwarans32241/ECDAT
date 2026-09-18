import React, { forwardRef } from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';
import './checkbox.css';

export const Checkbox = forwardRef(({ className = '', checked, indeterminate, ...props }, ref) => {
  const isChecked = indeterminate ? 'indeterminate' : checked;

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={`shadcn-checkbox-root ${className}`}
      checked={isChecked}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="shadcn-checkbox-indicator">
        {indeterminate ? (
          <Minus size={12} strokeWidth={3} />
        ) : (
          <Check size={12} strokeWidth={3} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});

Checkbox.displayName = 'Checkbox';
export default Checkbox;
