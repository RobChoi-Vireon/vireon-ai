import React from "react";

const badgeVariants = (variant = 'default') => {
  const baseClasses = `
    inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
    transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
  `;

  const variants = {
    default: `
      bg-primary text-primary-foreground hover:bg-primary/80
      bg-gray-900 text-white hover:bg-gray-800
      dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200
    `,
    secondary: `
      bg-secondary text-secondary-foreground hover:bg-secondary/80
      bg-gray-100 text-gray-900 hover:bg-gray-200
      dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700
    `,
    destructive: `
      bg-destructive text-destructive-foreground hover:bg-destructive/80
      bg-red-500 text-white hover:bg-red-600
      dark:bg-red-900 dark:text-red-50 dark:hover:bg-red-800
    `,
    outline: `
      text-foreground border border-input bg-background hover:bg-accent hover:text-accent-foreground
      border-gray-200 text-gray-900 hover:bg-gray-100
      dark:border-gray-800 dark:text-gray-50 dark:hover:bg-gray-800
    `,
  };

  return `${baseClasses} ${variants[variant] || variants.default}`;
};

const Badge = ({ className, variant, ...props }) => {
  return (
    <div className={`${badgeVariants(variant)} ${className}`} {...props} />
  );
};

export { Badge };