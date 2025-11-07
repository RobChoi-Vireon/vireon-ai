import React from "react";

const buttonVariants = (variant = 'default', size = 'default') => {
  const baseClasses = `
    inline-flex items-center justify-center whitespace-nowrap rounded-xl
    text-sm font-medium transition-all duration-150 ease-out
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
    disabled:pointer-events-none disabled:opacity-50
    min-h-[44px] min-w-[44px] tap-highlight-transparent
    active:scale-[0.98] hover:scale-[1.02]
    body:not(.reduce-motion) transition-transform
    body.reduce-motion:active:scale-100 body.reduce-motion:hover:scale-100
  `;

  const variants = {
    default: `
      bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg
      hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl
      focus-visible:ring-blue-500
    `,
    destructive: `
      bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg
      hover:from-red-600 hover:to-red-700 hover:shadow-xl
      focus-visible:ring-red-500
    `,
    outline: `
      border border-gray-200 bg-white hover:bg-gray-50 hover:text-gray-900
      dark:border-white/20 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:text-white
      focus-visible:ring-gray-400
    `,
    secondary: `
      bg-gray-100 text-gray-900 hover:bg-gray-200
      dark:bg-white/10 dark:text-white dark:hover:bg-white/15
      focus-visible:ring-gray-400
    `,
    ghost: `
      hover:bg-gray-100 hover:text-gray-900
      dark:hover:bg-white/10 dark:hover:text-white
      focus-visible:ring-gray-400
    `,
    link: `
      text-blue-600 underline-offset-4 hover:underline
      dark:text-blue-400
      focus-visible:ring-blue-500
    `
  };

  const sizes = {
    default: "h-11 px-6 py-2",
    sm: "h-9 rounded-lg px-4",
    lg: "h-12 rounded-xl px-8",
    icon: "h-11 w-11",
  };

  return `${baseClasses} ${variants[variant] || variants.default} ${sizes[size] || sizes.default}`;
};

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={`${buttonVariants(variant, size)} ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button };