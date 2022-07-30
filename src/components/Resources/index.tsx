import { Typography } from '@ht6/react-ui';
import { NotionAPI } from 'notion-client';
import { ExtendedRecordMap } from 'notion-types';
import { useState } from 'react';
import { NotionRenderer } from 'react-notion-x';

function Resources() {
  const [recordMap, setRecordMap] = useState<ExtendedRecordMap | null>(null);

  async function getNotion() {
    const notion = new NotionAPI();
    notion
      .getPage('bc662143f2ba4d4abd8908de322df5d9')
      .then((res) => setRecordMap(res));
  }

  return (
    <div className={''}>
      <Typography textColor='primary-3' textType='heading3' as='h3'>
        NOTION
      </Typography>
      {recordMap && (
        <NotionRenderer
          recordMap={recordMap}
          fullPage={true}
          darkMode={false}
        />
      )}
    </div>
  );
}

export default Resources;
