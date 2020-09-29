import * as React from 'react';
// react-syntax-highlighter has typings, but they're wrong aside from the props and missing many paths...
// tslint:disable no-any
import { SyntaxHighlighterProps } from 'react-syntax-highlighter';
import { vs as style } from 'react-syntax-highlighter/dist/esm/styles/prism';
import css from "classnames";
import classNames from './TypeScriptSnippet.module.scss';

const SyntaxHighlighter = require<{
  default: React.ComponentType<SyntaxHighlighterProps> & { registerLanguage: (lang: string, func: any) => void };
}>('react-syntax-highlighter/dist/esm/prism-light').default;
const ts = require<any>('react-syntax-highlighter/dist/esm/languages/prism/tsx').default;
// tslint:enable no-any

// Register languages
SyntaxHighlighter.registerLanguage('tsx', ts);

export interface ITypeScriptSnippetProps {
  className?: string;
}

const lineNumberStyle: React.CSSProperties = {
  color: '#237893', // matches Monaco
};

export const TypeScriptSnippet: React.FunctionComponent<ITypeScriptSnippetProps> = props => {
  console.log("props.children",props.children)
  return (
    <SyntaxHighlighter className={css(props.className, classNames.root)} language="tsx" style={style}
      showLineNumbers
      lineNumberStyle={lineNumberStyle}
    >
      {props.children}
    </SyntaxHighlighter>
  );
};
