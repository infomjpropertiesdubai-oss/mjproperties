import React, { useState, useRef, useEffect } from "react";

interface CustomDropdownProps {
  title: string;
  placeholder: string;
  children: React.ReactNode;
  onSelect?: () => void;
  buttonClassName?: string;
}

const CustomDropdown = ({ 
  title, 
  placeholder, 
  children, 
  onSelect, 
  buttonClassName = "" 
  
}: CustomDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleItemClick = (callback: () => void) => {
        callback();
        setIsOpen(false);
        if (onSelect) onSelect();
    };

    // Clone children and add onClick handler to close dropdown
    const enhancedChildren = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
                onClick: (e: React.MouseEvent) => {
                    // Call the original onClick if it exists
                    if (child.props && typeof child.props === 'object' && 'onClick' in child.props && typeof child.props.onClick === 'function') {
                        (child.props as { onClick: (e: React.MouseEvent) => void }).onClick(e);
                    }
                    // Always close the dropdown and call onSelect
                    setIsOpen(false);
                    if (onSelect) onSelect();
                },
            });
        }
        return child;
    });

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                type="button"
                className={`w-full border border-mj-gold/20 hover:border-mj-gold/40 data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex items-center justify-between gap-2 rounded-md  bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-9 ${buttonClassName}`}
                onClick={handleToggle}
            >
                <span className="text-sm truncate line-clamp-1 flex items-center gap-2">{title || placeholder}</span>
                <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 border border-mj-gold/20  bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 max-h-60 min-w-[8rem] origin-top overflow-x-hidden overflow-y-auto rounded-md shadow-md">
                    <div className="p-1">{enhancedChildren}</div>
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;