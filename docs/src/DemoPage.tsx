import { IDemoPageProps } from './DemoPage.types';
import * as React from 'react';
import css from 'classnames';
import styles from './DemoPage.module.scss';
import {ExampleCard} from './modules/ExampleCard';
import {Markdown} from './modules/Markdown';

export const DemoPage: React.StatelessComponent<IDemoPageProps> = demoPageProps => {
  const {
    examples,
    overview,
    dos,
    donts,
    api
  } = demoPageProps;
  const {title} = demoPageProps;
  console.log("overview", overview, typeof overview)
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.nav}></div>
      </div>
      <div>
        <div className={css(styles.overview, styles.section)}>
          <div className={styles.subHeading}>
            <h2>Overview</h2>
          </div>
          <div>
            <Markdown>{overview}</Markdown>
          </div>
        </div>

        <div className={css(styles.doSection, styles.section)}>
          <div className={styles.dosDontsSection}>
            <h3>Do</h3>
            <hr className={css(styles.dosDontsLine, styles.doLine)} />
            <Markdown>{dos}</Markdown>
          </div>
          <div className={styles.dosDontsSection}>
            <h3>Don&rsquo;t</h3>
            <hr className={css(styles.dosDontsLine, styles.dontsLine)} />
            <Markdown>{donts}</Markdown>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.subHeading}>
            <h3>代码演示</h3>
          </div>
          {
            examples && examples.map(example=>{
              const { view, ...cardProps } = example;
              return <ExampleCard key={example.title} {...cardProps}>
                {view}
              </ExampleCard>;
            })
          }
        </div>

        <div className={styles.section}>
          <div className={styles.subHeading}>
            <h3>接口</h3>
          </div>
          <div>
          {
            api.map((apiMd: any, index: number)=>{
              return <Markdown key={index}>{apiMd}</Markdown>;
            })
          }
          </div>
        </div>
      </div>
    </div>
  );
};
