import { Box, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import aboutPic from './image/about-pic.jpg';

const About = () => {
  return (
    <Container maxWidth="lg" sx={{ pb: '24px' }}>
      <Grid container spacing={5} sx={{ flexGrow: 1 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            variant="h6"
            sx={{
              color: '#555',
              fontSize: '30px',
              fontWeight: 300,
              textAlign: 'left',
              marginBottom: '24px',
            }}
          >
            About project
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#555',
              fontSize: '18px',
              fontWeight: 300,
              textAlign: 'left',
              marginBottom: '16px',
            }}
          >
            The project introduces engineering and IT approaches to solve the problem of agriculture and food security
            in mountainous areas of Kyrgyzstan by creating a methodology for implementing the life cycle of artificial
            glaciers
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#555',
              fontSize: '18px',
              fontWeight: 300,
              textAlign: 'left',
            }}
          >
            The project aims to save villages and hamlets located far from natural water bodies and river beds. This
            will create a comfortable habitat for farm animals and land users
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            component="img"
            src={aboutPic}
            alt="Illustration of the project"
            sx={{
              width: '100%', // Занимает всю ширину родителя
              height: 'auto', // Сохраняет пропорции
              display: 'block',
              mt: { md: '60px' },
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default About;
