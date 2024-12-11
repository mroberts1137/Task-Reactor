export const Resizable: React.FC<any> = ({ children, ...props }) => (
  <div data-testid='resizable' {...props}>
    {children}
  </div>
);
