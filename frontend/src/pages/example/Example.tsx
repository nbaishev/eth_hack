import { useState } from 'react';
import { Box, Container } from '@mui/material';
import Spinner from '../../components/UI/Spinner/Spinner.tsx';

const Example = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  return (
    <Container maxWidth="lg" sx={{ pt: '32px', pb: '32px' }}>
      <Box
        sx={{
          position: 'relative',
          paddingTop: '56.25%', // Aspect ratio 16:9
          width: '100%',
          maxWidth: '100vw', // Maximum width set to 60% of the viewport
          maxHeight: '30vh', // Limit the maximum height to 40% of the viewport height
          height: 0,
          border: 'none',
          borderRadius: '24px',
          overflow: 'hidden',
          margin: '0 auto', // Center horizontally
        }}
      >
        {isLoading && <Spinner />}
        <iframe
          src="https://www.youtube.com/embed/vYuos4Y5Gv8"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={handleVideoLoad}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            display: isLoading ? 'none' : 'block',
          }}
        ></iframe>
      </Box>
    </Container>
  );
};

export default Example;
