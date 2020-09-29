import * as React from 'react';
import { DemoPage } from '../DemoPage';
import { NavPageProps } from '../components/Nav/Nav.doc';

export const NavPage = (props: { isHeaderVisible: boolean }) => (
  <DemoPage {...{ ...NavPageProps, ...props }} />
);
