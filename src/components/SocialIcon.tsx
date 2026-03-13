import { Box } from '@mui/material';
import { SiFacebook, SiInstagram, SiTripadvisor, SiYelp } from 'react-icons/si';

type SocialIconProps = {
  icon: string;
  size?: number;
};

const iconMap = {
  facebook: SiFacebook,
  instagram: SiInstagram,
  tripadvisor: SiTripadvisor,
  yelp: SiYelp,
} as const;

export default function SocialIcon({ icon, size = 16 }: SocialIconProps) {
  const IconComponent = iconMap[icon as keyof typeof iconMap];

  if (!IconComponent) {
    return null;
  }

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 0,
      }}
    >
      <IconComponent size={size} />
    </Box>
  );
}