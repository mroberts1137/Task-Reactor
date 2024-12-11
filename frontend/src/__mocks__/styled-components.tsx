import React from 'react';
import { Theme, lightTheme as theme } from '../styles/themes/theme';

// Helper function to handle both strings and components
const styledComponent =
  (Component: string | React.ComponentType<any>) => () => (props: any) => {
    if (typeof Component === 'string') {
      return React.createElement(Component, props);
    }
    return <Component {...props} />;
  };

// Mock styled function
const styled = {
  button: styledComponent('button'),
  div: styledComponent('div'),
  span: styledComponent('span'),
  p: styledComponent('p'),
  h1: styledComponent('h1'),
  h2: styledComponent('h2'),
  h3: styledComponent('h3'),
  input: styledComponent('input'),
  form: styledComponent('form'),
  label: styledComponent('label'),
  table: styledComponent('table'),
  tr: styledComponent('tr'),
  td: styledComponent('td'),
  th: styledComponent('th'),
  thead: styledComponent('thead'),
  tbody: styledComponent('tbody')
};

// Make styled a function that can be called with a component
const styledFunction = (Component: string | React.ComponentType<any>) =>
  styledComponent(Component);

// Add all properties of styled to the function
Object.assign(styledFunction, styled);

// Helper function to create any HTML element
styledFunction.createElement = (tag: string) => styledComponent(tag);

// Export the function as default
export default new Proxy(styledFunction, {
  get(target, prop) {
    if (prop in target) {
      return target[prop as keyof typeof styled];
    }
    return target.createElement(prop as string);
  }
});

// Mock other exports from styled-components
const css = (...args: any[]) => JSON.stringify(args);
const createGlobalStyle = () => () => null;
const keyframes = () => '';
const ThemeProvider = ({
  children,
  theme
}: {
  children: React.ReactNode;
  theme: Theme;
}) => <>{children}</>;

export { css, createGlobalStyle, keyframes, ThemeProvider, theme };
