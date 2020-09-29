import * as React from 'react';
import { ILabelProps } from './Label.types';

export class LabelBase extends React.Component<ILabelProps, {}> {
  public render(): JSX.Element {
    const { children } = this.props;
    return (
      <div>
        {children}
      </div>
    );
  }
}
