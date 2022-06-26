import { Typography, useTwoWayState } from '@ht6/react-ui';
import { ReactNode } from 'react';
import cx from 'classnames';
import Card from '../Card';
import Section from '../Section';
import styles from './TabSection.module.scss';

export type Tab = {
  label: ReactNode;
  element: ReactNode;
};

export interface TabSectionProps<T extends Tab> extends ComponentProps<'div'> {
  onChange?: (tab: T, idx: number, tabs: T[]) => void;
  className?: string;
  lazy?: boolean;
  value?: number;
  tabs: T[];
}

function TabSection<T extends Tab>({
  onChange = () => {},
  value: _value = 0,
  className,
  lazy,
  tabs,
  ...props
}: TabSectionProps<T>) {
  const [value] = useTwoWayState(_value);
  return (
    <Section
      {...props}
      className={cx(className, styles.root)}
      type='form'
      as='div'
    >
      <ul className={styles.tabs}>
        {tabs.map((tab, idx) => (
          <Card
            className={cx(idx === value && styles['tab--selected'], styles.tab)}
            key={idx}
            as='li'
          >
            <Typography
              onClick={() => onChange(tabs[idx], idx, tabs)}
              className={styles.tabText}
              textColor='copy-dark'
              textType='heading4'
              type='button'
              as='button'
            >
              {tab.label}
            </Typography>
          </Card>
        ))}
      </ul>
      <Card className={styles.content}>
        {lazy
          ? tabs[value]?.element
          : tabs.map((tab, idx) => (
              <div key={idx} hidden={value !== idx}>
                {tab.element}
              </div>
            ))}
      </Card>
    </Section>
  );
}

export default TabSection;
