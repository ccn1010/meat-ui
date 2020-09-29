import * as React from 'react';

/**
 * {@docCategory Separator}
 */
export interface ISeparator {}

/**
 * {@docCategory Separator}
 */
export interface ISeparatorProps extends React.HTMLAttributes<HTMLElement> {

  /**
   * Whether the element is a vertical separator.
   */
  vertical?: boolean;

  /**
   * Where the content should be aligned in the separator.
   * @defaultValue 'center'
   */
  alignContent?: 'start' | 'center' | 'end';
}

/**
 * {@docCategory Separator}
 */
export type ISeparatorStyleProps = Required<Pick<ISeparatorProps, 'vertical'>> &
  Pick<ISeparatorProps, 'className' | 'alignContent' | 'vertical'>;

/**
 * {@docCategory Separator}
 */
export interface ISeparatorStyles {
}
