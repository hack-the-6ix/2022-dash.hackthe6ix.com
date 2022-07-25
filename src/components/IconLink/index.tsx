import { Typography } from '@ht6/react-ui';

import styles from './IconLink.module.scss';

interface IconLinkProps {
  logo: string;
  title: string;
  description: string;
  link: string;
}

function IconLink({ logo, title, link, description }: IconLinkProps) {
  return (
    <div className={styles.container}>
      <a href={link}>
        <img alt={title} src={logo} width='70' height='70' />
      </a>
      <div>
        <Typography textColor='primary-3' textType='heading4' as='h4'>
          {title}
        </Typography>
        <Typography textColor='primary-3' textType='paragraph1' as='p'>
          {description}
        </Typography>
      </div>
    </div>
  );
}

export default IconLink;
