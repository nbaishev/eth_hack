import { Box, Container, IconButton, Typography } from '@mui/material';
import GlacierMap from './GlacierMap.tsx';
import Grid from '@mui/material/Grid2';
import LandscapeIcon from '@mui/icons-material/Landscape';

const SubmitGlacier = () => {
  return (
    <Container maxWidth="lg" sx={{ pt: '60px', pb: '60px' }}>
      <Grid container maxWidth="lg" spacing={5}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography
            variant="h6"
            sx={{
              color: '#555',
              fontSize: '30px',
              fontWeight: 300,
              textAlign: 'left',
              marginBottom: { md: '80px' },
            }}
          >
            Map of Artificial Glaciers in the Kyrgyz Republic
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', marginBottom: '20px' }}>
            <IconButton
              sx={{
                backgroundColor: '#6bbd45', // Зеленый круг
                color: '#fff', // Белая иконка
                width: '40px',
                height: '40px',
                borderRadius: '50%', // Круглая форма
                marginRight: '10px',
                '&:hover': {
                  backgroundColor: '#5aa23b', // Изменение цвета при наведении
                },
              }}
            >
              <LandscapeIcon />
            </IconButton>
            <Typography
              variant="subtitle1"
              sx={{
                color: '#555',
                textAlign: 'left',
              }}
            >
              Request Glacier Installation
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ height: { xs: '300px' } }}>
            <GlacierMap />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SubmitGlacier;
