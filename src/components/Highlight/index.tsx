import { Colors } from '@ht6/react-ui/dist/styles';
import { PropsWithChildren } from 'react';
import cx from 'classnames';
import styles from './Highlight.module.scss';

export interface HighlightProps {
  highlightColor: Colors;
}

export default function Highlight({
  highlightColor,
  children,
}: PropsWithChildren<HighlightProps>) {
  return (
    <span
      className={cx(styles[`highlight--${highlightColor}`], styles.highlight)}
    >
      {children}
    </span>
  );
}
