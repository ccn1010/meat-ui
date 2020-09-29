import { ILabelStyleProps, ILabelStyles } from './Label.types';

export const getStyles = (props: ILabelStyleProps): ILabelStyles => {
  const { className, disabled, required } = props;

  // Tokens

  return {
    root: [
      'ms-Label',
      {
        boxSizing: 'border-box',
        boxShadow: 'none',
        margin: 0,
        display: 'block',
        padding: '5px 0',
        wordWrap: 'break-word',
        overflowWrap: 'break-word'
      },
      disabled && {
        selectors: {
        }
      },
      required && {
        selectors: {
          '::after': {
            content: `' *'`,
            paddingRight: 12
          }
        }
      },
      className
    ]
  };
};
