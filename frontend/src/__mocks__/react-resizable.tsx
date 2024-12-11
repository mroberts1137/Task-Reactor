export const Resizable: React.FC<{ children: React.ReactNode }> = ({
  children,
  ...props
}) => (
  <div data-testid='resizable' {...props}>
    {children}
  </div>
);
