import * as React from 'react';
import { ISeparatorProps } from './Separator.types';

export const SeparatorBase: React.StatelessComponent<ISeparatorProps> = (props: ISeparatorProps): JSX.Element => {
  const { vertical } = props;

  return (
    <div>
      <div role="separator" aria-orientation={vertical ? 'vertical' : 'horizontal'}>
        {props.children}
      </div>
    </div>
  );
};
