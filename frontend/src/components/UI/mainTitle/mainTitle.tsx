import { Box, Container, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/system';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import BACKGROUND_IMAGE from './image/photo-bg6.png';

// Стили для контейнера с фоновым изображением
const BackgroundContainer = styled(Box)({
  backgroundImage: `url(${BACKGROUND_IMAGE})`, // Путь к изображению
  backgroundSize: 'cover', // Изображение покрывает контейнер
  backgroundPosition: 'center', // Центрирование изображения
  backgroundRepeat: 'no-repeat', // Изображение не повторяется
  height: '590px', // Высота контейнера
  width: '100%',
  display: 'flex',
  alignItems: 'flex-start', // Выравнивание текста по вертикали сверху
  justifyContent: 'flex-start', // Выравнивание текста по горизонтали слева
  margin: '0 auto',
  position: 'relative',
});

// Стили для кнопки-стрелки
const ArrowButton = styled(IconButton)({
  backgroundColor: '#6bbd45', // Зеленый цвет
  color: '#fff', // Цвет стрелки
  width: '40px',
  height: '40px',
  borderRadius: '50%', // Круглая форма
  left: 'calc(50% - 20px)', // Центрировать по горизонтали
  bottom: '-20px',
  // transform: 'translateX(10%)', // Центрирование
  '&:hover': {
    backgroundColor: '#5aa23b', // Изменение цвета при наведении
  },
  position: 'absolute',
});

const MainTitle = () => {
  const handleScroll = () => {
    const section = document.getElementById('submit-glacier'); // Ищем элемент по id
    if (section) {
      const offset = -120; // Задаем отступ (в пикселях) выше секции
      const elementPosition = section.getBoundingClientRect().top; // Позиция секции относительно видимой части экрана
      const offsetPosition = elementPosition + window.scrollY + offset; // Вычисляем итоговую позицию

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth', // Плавная прокрутка
      });
    }
  };

  return (
    <BackgroundContainer>
      <Container maxWidth="lg" sx={{ m: 'auto' }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: '48px',
            fontWeight: '400',
            color: '#fff',
            textAlign: 'left',
          }}
        >
          Artificial Glacier
          <br /> NFT Marketplace
        </Typography>
        <Typography
          variant="h3"
          sx={{
            fontSize: '16px',
            fontWeight: '400',
            color: '#fff',
            textAlign: 'left',
          }}
        >
          Proof of Ice — the Future of Water
        </Typography>
      </Container>
      <ArrowButton onClick={handleScroll}>
        <KeyboardArrowDownIcon fontSize="medium" />
      </ArrowButton>
    </BackgroundContainer>
  );
};

export default MainTitle;
