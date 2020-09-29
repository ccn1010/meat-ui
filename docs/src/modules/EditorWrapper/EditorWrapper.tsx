import * as React from 'react';
import { EditorPreview } from './EditorPreview';
import { IEditorWrapperProps } from './EditorWrapper.types';
import { TypeScriptSnippet } from './TypeScriptSnippet';

export const EditorWrapper: React.FunctionComponent<IEditorWrapperProps> = props => {
  const {
    code,
    isCodeVisible,
    editorClassName,
    previewClassName,
    children
  } = props;

  return (
    <div>
      <EditorPreview className={previewClassName}>{children}</EditorPreview>
      {isCodeVisible && (
        <div className={editorClassName}>
          <TypeScriptSnippet>{code}</TypeScriptSnippet>
        </div>
      )}
    </div>
  );
};

