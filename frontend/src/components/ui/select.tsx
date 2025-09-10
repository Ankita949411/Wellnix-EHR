import React from "react";

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  onValueChange?: (value: string) => void;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", children, onValueChange, ...props }, ref) => {
    const classes = `flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onValueChange) {
        onValueChange(e.target.value);
      }
    };

    return (
      <select ref={ref} className={classes} onChange={handleChange} {...props}>
        {children}
      </select>
    );
  }
);

Select.displayName = "Select";

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className = "", ...props }, ref) => {
    return <div ref={ref} className={className} {...props} />;
  }
);

SelectContent.displayName = "SelectContent";

interface SelectItemProps extends React.OptionHTMLAttributes<HTMLOptionElement> {}

export const SelectItem = React.forwardRef<HTMLOptionElement, SelectItemProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <option ref={ref} className={className} {...props}>
        {children}
      </option>
    );
  }
);

SelectItem.displayName = "SelectItem";

interface SelectTriggerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SelectTrigger = React.forwardRef<HTMLDivElement, SelectTriggerProps>(
  ({ className = "", ...props }, ref) => {
    return <div ref={ref} className={className} {...props} />;
  }
);

SelectTrigger.displayName = "SelectTrigger";

interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string;
}

export const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ className = "", placeholder, ...props }, ref) => {
    return (
      <span ref={ref} className={className} {...props}>
        {placeholder}
      </span>
    );
  }
);

SelectValue.displayName = "SelectValue";