import React from 'react';
import './table.css';

export function Table({ className = '', children, ...props }) {
  return (
    <div className="shadcn-table-container">
      <table className={`shadcn-table ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ className = '', children, ...props }) {
  return (
    <thead className={`shadcn-table-header ${className}`} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ className = '', children, ...props }) {
  return (
    <tbody className={`shadcn-table-body ${className}`} {...props}>
      {children}
    </tbody>
  );
}

export function TableFooter({ className = '', children, ...props }) {
  return (
    <tfoot className={`shadcn-table-footer ${className}`} {...props}>
      {children}
    </tfoot>
  );
}

export function TableRow({ className = '', children, ...props }) {
  return (
    <tr className={className} {...props}>
      {children}
    </tr>
  );
}

export function TableHead({ className = '', children, ...props }) {
  return (
    <th className={className} {...props}>
      {children}
    </th>
  );
}

export function TableCell({ className = '', children, ...props }) {
  return (
    <td className={className} {...props}>
      {children}
    </td>
  );
}

export function TableCaption({ className = '', children, ...props }) {
  return (
    <caption className={`shadcn-table-caption ${className}`} {...props}>
      {children}
    </caption>
  );
}
