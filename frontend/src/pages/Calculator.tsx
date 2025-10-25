import {
  Box,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useEffect, useState } from 'react';

const soilTypes = ['sand', 'clay', 'gravel', 'rocky', 'loam'];
const climates = ['cold', 'moderate', 'hot'];

const commonTextFieldStyles = {
  m: '8px 0',
  '& .MuiFilledInput-root': {
    backgroundColor: '#f6f7f8', // Принудительно светлый фон
    border: '1px solid #f6f7f8',
    borderRadius: '12px', // Добавляем закругленные углы
    '&:hover': {
      backgroundColor: '#ebebeb', // Цвет фона при наведении
      borderColor: '#ebebeb', // Добавляем рамку при фокусе
    },
    '&:before': {
      borderBottom: 'none', // Убираем нижнюю границу по умолчанию
    },
    '&:hover:before': {
      borderBottom: 'none', // Убираем нижнюю границу при наведении
    },
    '&:after': {
      borderBottom: 'none', // Убираем нижнюю границу при фокусе
    },
    '&.Mui-focused': {
      backgroundColor: '#fff', // Белый фон при фокусе
      borderColor: '#555', // Добавляем рамку при фокусе
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#111', // Цвет текста при фокусе
  },
  // Убираем стрелки в числовых полях
  '& input[type=number]': {
    MozAppearance: 'textfield',
    appearance: 'textfield',
  },
  '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
    WebkitAppearance: 'none', // Убираем стрелки в Chrome, Safari и Edge
    margin: 0,
  },
  // Отключение автозаполнения и фона для браузеров
  '& input:-webkit-autofill': {
    WebkitBoxShadow: '0 0 0 100px white inset',
  },
  '& input:-webkit-autofill:focus': {
    WebkitBoxShadow: '0 0 0 100px white inset',
  },
};

const commonFormControlStyles = {
  marginBottom: { xs: '32px' },
  '& .MuiFormLabel-root': {
    fontWeight: 'bold',
    color: '#555',
    textAlign: 'left',
    '&.Mui-focused': {
      color: '#555',
    },
  },
  '& .MuiRadio-root': {
    color: '#555', // Цвет радиокнопки по умолчанию
    '&.Mui-checked': {
      color: '#6bbd45', // Цвет радиокнопки при выборе
    },
  },
};

const getSoilPermeability = (soilType: string) => {
  const permeabilityMap: Record<string, number> = {
    sand: 0.001,
    clay: 0.000001,
    gravel: 0.01,
    rocky: 0.00001,
    loam: 0.0001,
  };
  if (!(soilType in permeabilityMap)) {
    throw new Error(`Unknown soil type: ${soilType}`);
  }
  return permeabilityMap[soilType];
};

const getAnimalClimateFactor = (climate: string) => {
  const climateMap: Record<string, number> = {
    cold: 1,
    moderate: 1.1,
    hot: 1.3,
  };
  if (!(climate in climateMap)) {
    throw new Error(`Unknown climate: ${climate}`);
  }
  return climateMap[climate];
};

const getIrrigationClimateFactor = (climate: string) => {
  const climateMap: Record<string, number> = {
    cold: 1.1,
    moderate: 1.2,
    hot: 1.5,
  };
  if (!(climate in climateMap)) {
    throw new Error(`Unknown climate: ${climate}`);
  }
  return climateMap[climate];
};

const Calculator = () => {
  const [formData, setFormData] = useState({
    totalLength: 0,
    averageWidth: 0,
    soilType: 'sand',
    cattle: 0,
    sheep: 0,
    horses: 0,
    poultry: 0,
    climateAnimal: 'cold',
    grassArea: 0,
    wheatArea: 0,
    climateIrrigation: 'cold',
    glacierCount: 0,
  });

  const [requiredGlaciers, setRequiredGlaciers] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    // Проверяем тип поля: если тип "number", обрабатываем только если поле не пустое
    const newValue = type === 'number' && value !== '' ? Math.abs(Number(value)) : value;

    // Обновляем состояние формы
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  // Обработка потери фокуса (если поле пустое, ставим 0)
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Если поле пустое после потери фокуса, устанавливаем 0
    if (value === '') {
      setFormData((prev) => ({
        ...prev,
        [name]: 0,
      }));
    }
  };

  const calculateGlacierCount = () => {
    const requiredFields = [
      formData.totalLength,
      formData.averageWidth,
      formData.soilType,
      formData.grassArea,
      formData.wheatArea,
      formData.climateIrrigation,
    ];

    // Проверка заполнения всех обязательных полей
    const allFieldsFilled = requiredFields.every((field) => field !== '');

    if (!allFieldsFilled) {
      setRequiredGlaciers(0); // Устанавливаем результат в 0, если поля не заполнены
      return;
    }

    try {
      const totalLength = formData.totalLength;
      const averageWidth = formData.averageWidth;
      const grassArea = formData.grassArea;
      const wheatArea = formData.wheatArea;

      const soilPermeability = getSoilPermeability(formData.soilType);
      const animalClimateFactor = getAnimalClimateFactor(formData.climateAnimal);
      const irrigationClimateFactor = getIrrigationClimateFactor(formData.climateIrrigation);

      const totalWaterLoss = totalLength * averageWidth * soilPermeability * 90 * 24;

      console.log('totalWaterLoss', totalWaterLoss);

      const animalWaterConsumption =
        (formData.cattle * 50 * 1.2 * 90 * animalClimateFactor) / 1000 +
        (formData.sheep * 10 * 1.2 * 90 * animalClimateFactor) / 1000 +
        (formData.horses * 45 * 1.2 * 90 * animalClimateFactor) / 1000 +
        (formData.poultry * 2 * 1.2 * 90 * animalClimateFactor) / 1000;

      console.log('animalWaterConsumption', animalWaterConsumption);

      const irrigationWaterConsumption =
        (grassArea * 500000 * 1.5 * 90 * irrigationClimateFactor) / 1000 +
        (wheatArea * 35000 * 1.5 * 90 * irrigationClimateFactor) / 1000;

      console.log('irrigationWaterConsumption', irrigationWaterConsumption);

      const totalWaterNeed = totalWaterLoss + animalWaterConsumption + irrigationWaterConsumption;

      console.log('totalWaterNeed', totalWaterNeed);

      const glaciersNeeded = (totalWaterNeed * 0.15) / 5425.92;

      setRequiredGlaciers(Math.ceil(glaciersNeeded));
    } catch (error) {
      // Приведение типа ошибки
      if (error instanceof Error) {
        console.error('Error calculating glaciers:', error.message); // Выводим сообщение ошибки в консоль
      } else {
        console.error('Unknown error occurred'); // Обработка неизвестных ошибок
      }
    }
  };

  // Автоматический пересчёт при изменении данных
  useEffect(() => {
    calculateGlacierCount();
  }, [formData]); // Следит за изменениями в formData

  return (
    <Box sx={{ background: '#eceee8' }}>
      <Container maxWidth="lg" sx={{ paddingTop: '24px', paddingBottom: '24px' }}>
        <Typography
          variant="h2"
          gutterBottom
          sx={{
            textAlign: 'center',
            color: '555',
            fontSize: {
              lg: '2rem',
              xs: '1.5rem',
            },
            marginBottom: '32px',
          }}
        >
          Artificial Glacier Requirement Calculator
        </Typography>
        <Container
          sx={{
            maxWidth: 'lg',
            background: '#fff',
            borderRadius: '24px',
            boxShadow:
              '0 12px 12px rgb(0 0 0/10%), 0 12px 12px rgb(0 0 0/4%), 0 12px 20px rgb(0 0 0/4%), 0 6px 5px rgb(0 0 0/4%), inset 0 5px 0 #3e4757',
          }}
        >
          <Grid
            container
            sx={{ maxWidth: '824px', padding: '64px 0 52px 0', margin: '0 auto', position: 'relative' }}
            spacing={5}
          >
            <Grid size={{ xs: 12, sm: 8 }}>
              <Typography
                variant="h5"
                gutterBottom
                align="left"
                sx={{ fontWeight: 'bold', fontSize: '16px', mb: '16px' }}
              >
                Water loss in canal
              </Typography>

              <TextField
                label="Total Length of Canal"
                name="totalLength"
                value={formData.totalLength}
                onChange={handleInputChange}
                onBlur={handleInputBlur} // Добавляем обработку потери фокуса
                type="number"
                fullWidth
                sx={commonTextFieldStyles}
                variant="filled"
                slotProps={{
                  input: {
                    endAdornment: <InputAdornment position="end">m</InputAdornment>,
                  },
                }}
              />

              <TextField
                label="Average Width of Canal"
                name="averageWidth"
                value={formData.averageWidth}
                onChange={handleInputChange}
                onBlur={handleInputBlur} // Добавляем обработку потери фокуса
                type="number"
                fullWidth
                sx={commonTextFieldStyles}
                variant="filled"
                slotProps={{
                  input: {
                    endAdornment: <InputAdornment position="end">m</InputAdornment>,
                  },
                }}
              />

              <FormControl margin="dense" fullWidth sx={commonFormControlStyles}>
                <FormLabel sx={{ fontWeight: 40 }}>Soil type</FormLabel>
                <RadioGroup row name="soilType" value={formData.soilType} onChange={handleInputChange}>
                  {soilTypes.map((option) => (
                    <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
                  ))}
                </RadioGroup>
              </FormControl>

              <Typography
                variant="h5"
                gutterBottom
                align="left"
                sx={{ fontWeight: 'bold', fontSize: '16px', mb: '16px' }}
              >
                Animal water consumption
              </Typography>

              <TextField
                label="Number of Cattle"
                name="cattle"
                value={formData.cattle}
                onChange={handleInputChange}
                onBlur={handleInputBlur} // Добавляем обработку потери фокуса
                type="number"
                fullWidth
                variant="filled"
                sx={commonTextFieldStyles}
              />

              <TextField
                label="Number of Sheep, Goats"
                name="sheep"
                value={formData.sheep}
                onChange={handleInputChange}
                type="number"
                variant="filled"
                fullWidth
                sx={commonTextFieldStyles}
              />

              <TextField
                label="Number of Horses"
                name="horses"
                value={formData.horses}
                onChange={handleInputChange}
                onBlur={handleInputBlur} // Добавляем обработку потери фокуса
                type="number"
                variant="filled"
                fullWidth
                sx={commonTextFieldStyles}
              />

              <TextField
                label="Number of Poultry"
                name="poultry"
                value={formData.poultry}
                onChange={handleInputChange}
                onBlur={handleInputBlur} // Добавляем обработку потери фокуса
                type="number"
                fullWidth
                variant="filled"
                sx={commonTextFieldStyles}
              />

              <FormControl margin="dense" fullWidth sx={commonFormControlStyles}>
                <FormLabel sx={{ fontWeight: 40 }}>Climate</FormLabel>
                <RadioGroup row name="climateAnimal" value={formData.climateAnimal} onChange={handleInputChange}>
                  {climates.map((option) => (
                    <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
                  ))}
                </RadioGroup>
              </FormControl>

              <Typography
                variant="h5"
                gutterBottom
                align="left"
                sx={{ fontWeight: 'bold', fontSize: '16px', mb: '16px' }}
              >
                Irrigation water consumption
              </Typography>

              <TextField
                label="Grass Area"
                name="grassArea"
                value={formData.grassArea}
                onChange={handleInputChange}
                onBlur={handleInputBlur} // Добавляем обработку потери фокуса
                type="number"
                variant="filled"
                fullWidth
                sx={commonTextFieldStyles}
                slotProps={{
                  input: {
                    endAdornment: <InputAdornment position="end">hectare</InputAdornment>,
                  },
                }}
              />

              <TextField
                label="Wheat Area"
                name="wheatArea"
                value={formData.wheatArea}
                onChange={handleInputChange}
                onBlur={handleInputBlur} // Добавляем обработку потери фокуса
                type="number"
                variant="filled"
                fullWidth
                sx={commonTextFieldStyles}
                slotProps={{
                  input: {
                    endAdornment: <InputAdornment position="end">hectare</InputAdornment>,
                  },
                }}
              />

              <FormControl margin="dense" fullWidth sx={commonFormControlStyles}>
                <FormLabel sx={{ fontWeight: 40 }}>Climate</FormLabel>
                <RadioGroup
                  row
                  name="climateIrrigation"
                  value={formData.climateIrrigation}
                  onChange={handleInputChange}
                >
                  {climates.map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={
                        <Radio
                          sx={{
                            color: '#555', // Цвет по умолчанию
                            '&.Mui-checked': {
                              color: '#6bbd45', // Зеленый цвет при выборе
                            },
                          }}
                        />
                      }
                      label={option}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }} sx={{ position: 'sticky', top: '80px', alignSelf: 'flex-start' }}>
              <Box sx={{ border: '1px solid #e7e8ea', p: 3, borderRadius: '8px' }}>
                <Typography variant="h6" sx={{ fontSize: '13px', marginBottom: '12px' }}>
                  Required number of glaciers
                </Typography>
                <Typography variant="h6" sx={{ fontSize: '28px' }}>
                  {requiredGlaciers}
                </Typography>
                {/*<Button*/}
                {/*  sx={{*/}
                {/*    background: '#6bbd45',*/}
                {/*    color: '#fff',*/}
                {/*    fontWeight: '400',*/}
                {/*    fontSize: '15px',*/}
                {/*    textTransform: 'none',*/}
                {/*    borderRadius: '12px',*/}
                {/*    p: '6px 16px',*/}
                {/*  }}*/}
                {/*>*/}
                {/*  Request*/}
                {/*</Button>*/}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Container>
    </Box>
  );
};
export default Calculator;

// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   FormControl,
//   FormLabel,
//   SwipeableDrawer,
//   Container,
// } from '@mui/material';
// import Grid from '@mui/material/Grid2';
// import React, { useState } from 'react';
// import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
//
// const soilTypes = ['sand', 'clay', 'gravel', 'rocky', 'loam'];
// const climates = ['cold', 'moderate', 'hot'];
//
// const center = {
//   lat: 41.365334,
//   lng: 71.043201,
// };
//
// const Calculator = () => {
//   const [formData, setFormData] = useState({
//     totalLength: '',
//     averageWidth: '',
//     soilType: '',
//     cattle: '',
//     sheep: '',
//     horses: '',
//     poultry: '',
//     climateAnimal: '',
//     grassArea: '',
//     wheatArea: '',
//     climateIrrigation: '',
//     glacierCount: '',
//   });
//
//   const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
//   const [tempCoordinates, setTempCoordinates] = useState<{ lat: number; lng: number } | null>(null); // Для временного хранения координат
//   const [openDrawer, setOpenDrawer] = useState(false);
//   const [requiredGlaciers, setRequiredGlaciers] = useState<number | null>(null);
//
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };
//
//   const calculateGlacierCount = () => {
//     const totalWaterLoss =
//       parseFloat(formData.totalLength) * parseFloat(formData.averageWidth) * getSoilPermeability(formData.soilType);
//
//     const animalWaterConsumption =
//       parseInt(formData.cattle) * 50 +
//       parseInt(formData.sheep) * 10 +
//       parseInt(formData.horses) * 45 +
//       parseInt(formData.poultry) * 2;
//
//     const irrigationWaterConsumption = parseFloat(formData.grassArea) * 8 + parseFloat(formData.wheatArea) * 4;
//
//     const totalWaterNeed = totalWaterLoss + animalWaterConsumption + irrigationWaterConsumption;
//
//     const glaciersNeeded = totalWaterNeed / (totalWaterNeed * 0.15);
//
//     setRequiredGlaciers(Math.ceil(glaciersNeeded));
//   };
//
//   const getSoilPermeability = (soilType: string) => {
//     const permeabilityMap: Record<string, number> = {
//       sand: 0.001,
//       clay: 0.000001,
//       gravel: 0.01,
//       rocky: 0.00001,
//       loam: 0.0001,
//     };
//     return permeabilityMap[soilType] || 0;
//   };
//
//   const handleMapClick = (event: google.maps.MapMouseEvent) => {
//     if (event.latLng) {
//       const lat = event.latLng.lat();
//       const lng = event.latLng.lng();
//       setTempCoordinates({ lat, lng }); // Обновляем временные координаты
//     }
//   };
//
//   const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
//     if (
//       event &&
//       event.type === 'keydown' &&
//       ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
//     ) {
//       return;
//     }
//     setOpenDrawer(open);
//   };
//
//   const handleSelectCoordinates = () => {
//     setCoordinates(tempCoordinates); // Копируем временные координаты на страницу
//     setOpenDrawer(false);
//   };
//
//   return (
//     <Container maxWidth="lg">
//       <Typography variant="h4" gutterBottom>
//         Water Consumption Calculator
//       </Typography>
//
//       <Grid container spacing={5}>
//         {/* Left column with the form */}
//         <Grid size={{ xs: 12, md: 8 }}>
//           <Typography variant="h5" gutterBottom align="left" sx={{ fontWeight: 'bold' }}>
//             Water Loss in Canal
//           </Typography>
//           <TextField
//             label="Total Length of Canal (m)"
//             name="totalLength"
//             defaultValue="0"
//             value={formData.totalLength}
//             onChange={handleInputChange}
//             fullWidth
//             sx={{ m: '8px 0' }}
//           />
//           <TextField
//             label="Average Width of Canal (m)"
//             name="averageWidth"
//             value={formData.averageWidth}
//             onChange={handleInputChange}
//             fullWidth
//             sx={{ m: '8px 0' }}
//           />
//
//           <FormControl margin="dense" fullWidth sx={{ marginBottom: { xs: '16px', md: '24px' } }}>
//             <FormLabel sx={{ fontWeight: 'bold', textAlign: 'left' }}>Soil Type</FormLabel>
//             <RadioGroup row name="soilType" value={formData.soilType} onChange={handleInputChange}>
//               {soilTypes.map((option) => (
//                 <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
//               ))}
//             </RadioGroup>
//           </FormControl>
//
//           <Typography variant="h5" gutterBottom align="left" sx={{ fontWeight: 'bold' }}>
//             Animal Water Consumption
//           </Typography>
//           <TextField
//             label="Number of Cattle"
//             name="cattle"
//             value={formData.cattle}
//             onChange={handleInputChange}
//             fullWidth
//             sx={{ m: '8px 0' }}
//           />
//           <TextField
//             label="Number of Sheep"
//             name="sheep"
//             value={formData.sheep}
//             onChange={handleInputChange}
//             fullWidth
//             sx={{ m: '8px 0' }}
//           />
//           <TextField
//             label="Number of Horses"
//             name="horses"
//             value={formData.horses}
//             onChange={handleInputChange}
//             fullWidth
//             sx={{ m: '8px 0' }}
//           />
//           <TextField
//             label="Number of Poultry"
//             name="poultry"
//             value={formData.poultry}
//             onChange={handleInputChange}
//             fullWidth
//             sx={{ m: '8px 0' }}
//           />
//
//           <FormControl margin="dense" fullWidth sx={{ marginBottom: { xs: '16px', md: '24px' } }}>
//             <FormLabel sx={{ fontWeight: 'bold', textAlign: 'left' }}>Climate (Animals)</FormLabel>
//             <RadioGroup row name="climateAnimal" value={formData.climateAnimal} onChange={handleInputChange}>
//               {climates.map((option) => (
//                 <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
//               ))}
//             </RadioGroup>
//           </FormControl>
//
//           <Typography variant="h5" gutterBottom align="left" sx={{ fontWeight: 'bold' }}>
//             Irrigation Water Consumption
//           </Typography>
//           <TextField
//             label="Grass Area (m²)"
//             name="grassArea"
//             value={formData.grassArea}
//             onChange={handleInputChange}
//             fullWidth
//             sx={{ m: '8px 0' }}
//           />
//           <TextField
//             label="Wheat Area (m²)"
//             name="wheatArea"
//             value={formData.wheatArea}
//             onChange={handleInputChange}
//             fullWidth
//             sx={{ m: '8px 0' }}
//           />
//
//           <FormControl margin="dense" fullWidth sx={{ marginBottom: { xs: '16px', md: '24px' } }}>
//             <FormLabel sx={{ fontWeight: 'bold', textAlign: 'left' }}>Climate (Irrigation)</FormLabel>
//             <RadioGroup row name="climateIrrigation" value={formData.climateIrrigation} onChange={handleInputChange}>
//               {climates.map((option) => (
//                 <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
//               ))}
//             </RadioGroup>
//           </FormControl>
//
//           {/* Для мобильных экранов - показываем Drawer */}
//           <Box
//             sx={{
//               display: { xs: 'block', md: 'none' }, // Показываем кнопку только на мобильных экранах
//             }}
//           >
//             <Button variant="contained" color="primary" onClick={toggleDrawer(true)} sx={{ mt: 3 }}>
//               {coordinates ? 'Изменить координаты' : 'Select Coordinates for Glacier Installation'}
//             </Button>
//
//             <SwipeableDrawer
//               anchor="bottom"
//               open={openDrawer}
//               onClose={toggleDrawer(false)}
//               onOpen={toggleDrawer(true)}
//               sx={{
//                 '& .MuiDrawer-paper': {
//                   height: '100%',
//                 },
//               }}
//             >
//               <Container maxWidth="lg" sx={{ pt: 3, pb: 3 }}>
//                 <Grid container maxWidth="lg" spacing={5}>
//                   <Grid size={{ xs: 12, md: 4 }}>
//                     <Typography variant="h6" id="select-coordinates-title" gutterBottom>
//                       Select Coordinates on the Map
//                     </Typography>
//                     {tempCoordinates && (
//                       <Box mt={2}>
//                         <Typography>Latitude: {tempCoordinates.lat}</Typography>
//                         <Typography>Longitude: {tempCoordinates.lng}</Typography>
//                       </Box>
//                     )}
//                     {tempCoordinates && (
//                       <Button variant="contained" color="primary" onClick={handleSelectCoordinates} sx={{ mt: 2 }}>
//                         Выбрать координаты
//                       </Button>
//                     )}
//                   </Grid>
//                   <Grid size={{ xs: 12, md: 8 }}>
//                     <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
//                       <GoogleMap
//                         mapContainerStyle={{ width: '100%', height: '600px' }}
//                         center={center}
//                         zoom={10}
//                         onClick={handleMapClick}
//                       >
//                         {tempCoordinates && <Marker position={tempCoordinates} />}
//                       </GoogleMap>
//                     </LoadScript>
//                   </Grid>
//                 </Grid>
//               </Container>
//             </SwipeableDrawer>
//           </Box>
//
//           {/* Для больших экранов - сразу показываем карту */}
//           <Box
//             sx={{
//               display: { xs: 'none', md: 'block' }, // Показываем карту только на больших экранах
//             }}
//           >
//             <Typography variant="h6" gutterBottom>
//               Select Coordinates on the Map
//             </Typography>
//             <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
//               <GoogleMap
//                 mapContainerStyle={{ width: '100%', height: '600px' }}
//                 center={center}
//                 zoom={10}
//                 onClick={handleMapClick}
//               >
//                 {tempCoordinates && <Marker position={tempCoordinates} />}
//               </GoogleMap>
//             </LoadScript>
//             {tempCoordinates && (
//               <Box mt={2}>
//                 <Typography>Latitude: {tempCoordinates.lat}</Typography>
//                 <Typography>Longitude: {tempCoordinates.lng}</Typography>
//                 <Button variant="contained" color="primary" onClick={handleSelectCoordinates} sx={{ mt: 2 }}>
//                   Выбрать координаты
//                 </Button>
//               </Box>
//             )}
//           </Box>
//         </Grid>
//
//         {/* Right column with the result */}
//         <Grid size={{ xs: 12, md: 4 }}>
//           <Box sx={{ backgroundColor: '#f9f9f9', p: 3, borderRadius: '8px' }}>
//             <Typography variant="h5" gutterBottom>
//               Calculation Result
//             </Typography>
//             {requiredGlaciers !== null ? (
//               <Typography variant="h6">Required number of glaciers: {requiredGlaciers}</Typography>
//             ) : (
//               <Typography>No calculation yet.</Typography>
//             )}
//           </Box>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };
//
// export default Calculator;
