import * as React from 'react';
import { BasicExample } from './examples/Basic.Example';
import { IDocPageProps } from '../DocPage.types';

const BasicExampleCode = require('!raw-loader!./examples/Basic.Example.tsx').default;
const requireContext = require.context('../../../api/Separator', false, /\w+\.md$/);
const mds = requireContext.keys().map(pagePath => {
  const pageName = pagePath.match(/(\w+\.\w+)\.md/)![1];
  console.log(pagePath, pageName)
  return require(`!raw-loader!../../../api/Separator/${pageName}.md`).default;
});
console.log("mds", mds)

export const NavPageProps: IDocPageProps = {
  title: 'Collapse 折叠面板',
  componentName: '折叠面板',
  componentUrl: 'https://github.com/OfficeDev/office-ui-fabric-react/tree/master/packages/office-ui-fabric-react/src/components/Nav',
  examples: [
    {
      title: 'Basic nav with sample links',
      code: BasicExampleCode,
      view: <BasicExample />
    }
  ],
  overview: require('!raw-loader!office-ui-fabric-react/src/components/Nav/docs/NavOverview.md').default,
  dos: require('!raw-loader!office-ui-fabric-react/src/components/Nav/docs/NavDos.md').default,
  donts: require('!raw-loader!office-ui-fabric-react/src/components/Nav/docs/NavDonts.md').default,
  isHeaderVisible: true,
  isFeedbackVisible: true,
  api: mds
};
