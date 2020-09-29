import * as React from 'react';
/* tslint:enable:no-unused-variable */

/**
 * {@docCategory Label}
 */
export interface ILabel {}

/**
 * {@docCategory Label}
 */
export interface ILabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /**
   * Whether the associated form field is required or not
   * @defaultvalue false
   */
  required?: boolean;

  /**
   * Renders the label as disabled.
   */
  disabled?: boolean;

}

/**
 * {@docCategory Label}
 */
export interface ILabelStyles {
  /**
   * Styles for the root element.
   */
}

/**
 * {@docCategory Label}
 */
export interface ILabelStyleProps {
  /**
   *
   */
  className?: string;
  disabled?: boolean;
  required?: boolean;
}
