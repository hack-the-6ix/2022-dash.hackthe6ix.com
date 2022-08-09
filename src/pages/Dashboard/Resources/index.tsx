import { Typography } from '@ht6/react-ui';
import { useEffect, useRef } from 'react';

import styles from './Resources.module.scss';

function Resources() {
  const ref = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (ref.current) {
        ref.current.style.height = e.data + 'px';
      }
    };
    window.addEventListener('message', handler);
    return () => {
      window.removeEventListener('message', handler);
    };
  }, []);
  return (
    <div>
      <Typography textColor='primary-3' textType='heading3' as='h3'>
        NOTION
      </Typography>
      <iframe
        className={styles.content}
        src='/notion?id=1f51e615db27483381f4a3726e7f8cc3'
        title='HT6 Notion Renderer'
        ref={ref}
      />
    </div>
  );
}

export default Resources;
