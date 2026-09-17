import './Button.css';

export default function Button({
  variant = 'secondary',
  size = 'md',
  icon: Icon,
  children,
  className = '',
  ...props
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    size !== 'md' ? `btn-${size}` : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} {...props}>
      {Icon && <Icon size={size === 'sm' ? 14 : 16} />}
      {children}
    </button>
  );
}
