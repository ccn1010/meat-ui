import * as React from 'react';
import { NavBasicExample } from './examples/Nav.Basic.Example';
import { IDocPageProps } from '../DocPage.types';
import { NavFabricDemoAppExample } from './examples/Nav.FabricDemoApp.Example';
import { NavNestedExample } from './examples/Nav.Nested.Example';
import { NavCustomGroupHeadersExample } from './examples/Nav.CustomGroupHeaders.Example';

const NavBasicExampleCode = require('!raw-loader!./examples/Nav.Basic.Example.tsx').default;
const NavFabricDemoAppExampleCode = require('!raw-loader!./examples/Nav.FabricDemoApp.Example.tsx').default;
const NavNestedExampleCode = require('!raw-loader!./examples/Nav.Nested.Example.tsx').default;
const NavCustomGroupHeadersExampleCode = require('!raw-loader!./examples/Nav.CustomGroupHeaders.Example.tsx').default;
const requireContext = require.context('../../../api/Separator', false, /\w+\.md$/);
const mds = requireContext.keys().map(pagePath => {
  const pageName = pagePath.match(/(\w+\.\w+)\.md/)![1];
  console.log(pagePath, pageName)
  return require(`!raw-loader!../../../api/Separator/${pageName}.md`).default;
});
console.log("mds", mds)

export const NavPageProps: IDocPageProps = {
  title: 'Nav',
  componentName: 'Nav',
  componentUrl: 'https://github.com/OfficeDev/office-ui-fabric-react/tree/master/packages/office-ui-fabric-react/src/components/Nav',
  examples: [
    {
      title: 'Basic nav with sample links',
      code: NavBasicExampleCode,
      view: <NavBasicExample />
    },
    {
      title: 'Nav similar to the one in this demo app',
      code: NavFabricDemoAppExampleCode,
      view: <NavFabricDemoAppExample />
    },
    {
      title: 'Nav with nested links',
      code: NavNestedExampleCode,
      view: <NavNestedExample />
    },
    {
      title: 'Nav with custom group header',
      code: NavCustomGroupHeadersExampleCode,
      view: <NavCustomGroupHeadersExample />
    }
  ],
  propertiesTablesSources: [require<string>('!raw-loader!office-ui-fabric-react/src/components/Nav/Nav.types.ts')],
  overview: require('!raw-loader!office-ui-fabric-react/src/components/Nav/docs/NavOverview.md').default,
  bestPractices: '',
  dos: require('!raw-loader!office-ui-fabric-react/src/components/Nav/docs/NavDos.md').default,
  donts: require('!raw-loader!office-ui-fabric-react/src/components/Nav/docs/NavDonts.md').default,
  isHeaderVisible: true,
  isFeedbackVisible: true,
  api: mds
};
