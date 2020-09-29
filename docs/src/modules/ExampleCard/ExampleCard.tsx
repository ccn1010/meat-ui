import * as React from 'react';
import classNames from './ExampleCard.module.scss';
import { EditorWrapper } from '../EditorWrapper';
import { IExampleCardProps } from './ExampleCard.types';

export interface IExampleCardState {
  isCodeVisible?: boolean;
}

export class ExampleCard extends React.Component<IExampleCardProps, IExampleCardState> {

  constructor(props: IExampleCardProps) {
    super(props);
    this.state = {
      isCodeVisible: false
    };
  }

  public render(): JSX.Element {
    const { title, code, children } = this.props;
    const { isCodeVisible = this.state.isCodeVisible } = this.props;

    return (
      <div className={classNames.root}>
        <div className={classNames.header}>
          <span className={classNames.title}>{title}</span>
          <div className={classNames.toggleButtons}>
            {code && (
              <button type="button"
                onClick={this._onToggleCodeClick}
              >
                {isCodeVisible ? 'Hide code' : 'Show code'}
              </button>
            )}
          </div>
        </div>
        <EditorWrapper
          code={code!}
          isCodeVisible={!!isCodeVisible}
          editorClassName={classNames.code}
          height={1000}
          width="auto"
          previewClassName={classNames.example}
        >
          {children}
        </EditorWrapper>
      </div>
    );
  }

  private _onToggleCodeClick = () => {
    this.setState({
      isCodeVisible: !this.state.isCodeVisible
    });
  };
}
