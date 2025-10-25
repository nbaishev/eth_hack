import { Box, Grid, IconButton, Typography, Tooltip } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TelegramIcon from '@mui/icons-material/Telegram';
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#eceee8',
        padding: '30px 0',
        textAlign: 'center',
      }}
    >
      <Grid container justifyContent="center" spacing={2} sx={{ marginBottom: '50px' }}>
        {[
          {
            icon: <InstagramIcon fontSize="medium" />,
            href: 'https://www.instagram.com/usta_international/?igsh=MWx0YjZvamZhazR4Nw%3D%3D',
          },
          {
            icon: <YouTubeIcon fontSize="medium" />,
            href: 'https://www.youtube.com/@usta_international',
          },
          {
            icon: <TelegramIcon fontSize="medium" />,
            href: 'https://t.me/usta_media',
          },
          {
            icon: <EmailIcon fontSize="medium" />,
            href: 'mailto:usta.community@gmail.com',
            tooltip: 'usta.community@gmail.com',
          },
        ].map(({ icon, href, tooltip }, index) => (
          <Grid item key={index}>
            <Tooltip title={tooltip || ''} arrow>
              <IconButton
                href={href}
                target="_blank"
                sx={{
                  color: '#333',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  border: 'solid 1px #97be32',
                  transition: 'color 0.3s, background-color 0.3s',
                  '&:hover': {
                    backgroundColor: '#fff',
                  },
                }}
              >
                {icon}
              </IconButton>
            </Tooltip>
          </Grid>
        ))}
      </Grid>

      {/* Добавление текста "SUBSCRIBE" */}
      <Typography
        sx={{
          color: '#333',
          fontSize: '30px',
          lineHeight: '30px',
          fontWeight: 700,
          marginBottom: '20px',
        }}
      >
        SUBSCRIBE
      </Typography>

      {/* Дополнительный текст */}
      <Typography
        sx={{
          color: '#999',
          fontSize: '12px',
          marginTop: '10px',
        }}
      >
        Copyright © 2024. All Rights Reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
