import React from 'react';
import { INavLink, Nav } from 'office-ui-fabric-react/lib/Nav';
import { IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { IRenderFunction, IComponentAs } from 'office-ui-fabric-react/lib/Utilities';
import { HashRouter as Router, Route, Link } from "react-router-dom";
import classNames from './App.module.scss';
import { IAppDefinition } from './App.types';

const appDefinition: IAppDefinition = {
  appTitle: 'UI Fabric - Experiments',
  testPages: [],
  examplePages: [
    {
      links: [
        {
          component: require<any>('./container/NavPage').NavPage,
          key: 'Nav',
          name: 'Nav',
          url: '/examples/nav'
        }
      ]
    }
  ],
  headerLinks: []
};

export class App extends React.Component<{}, {}> {
  
  public componentDidMount() {
    document.title = appDefinition.appTitle.replace(' - ', ' ') + ' Examples';
  }

  public render(): JSX.Element {
    const clink: IComponentAs<IButtonProps> = (props: IButtonProps) => {console.log(props); return <Link to={{pathname: props.href}}>{props.title}</Link>}
    const nav = (
      <Nav
        linkAs={clink}
        groups={appDefinition.examplePages}
        onRenderLink={this._onRenderLink as IRenderFunction<INavLink>}
      />
    );

    return <Router>
        <div className={classNames.app}>
        <header className={classNames.header}>
          <div>meat-ui</div>
        </header>
        <div className={classNames.container}>
          <div className={classNames.leftNav}>
            {nav}
          </div>
          <div className={classNames.content}>
            {
              appDefinition.examplePages[0].links.map(item=>{
                return <Route key={item.url} path={item.url} component={item.component} />
              })
            }
          </div>
        </div>
      </div>
    </Router>
  }

  private _onRenderLink = (link: INavLink): JSX.Element => {

    // Nav-linkText is a class name from the Fabric nav
    return (
      <>
        <span key={1} className="Nav-linkText">
          {link.name}
        </span>
      </>
    );
  };
}

export default App;
