import * as React from 'react';
import { IMarkdownProps } from './Markdown.types';
import classNames from './Markdown.module.scss';
const ReactMarkdown = require('react-markdown/with-html');
const htmlParser = require('react-markdown/plugins/html-parser');
const parseHtml = htmlParser({
  isValidNode: (node: { type: string; }) => node.type !== 'script',
  processingInstructions: [/* ... */]
})

export const Markdown: React.StatelessComponent<IMarkdownProps> & { displayName?: string } = props => {
  const { children } = props;
  return (
      <ReactMarkdown className={classNames.md} source={children} escapeHtml={false}
        astPlugins={[parseHtml]} />
  );
};
Markdown.displayName = 'Markdown';
