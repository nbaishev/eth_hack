// import { useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { Box, Button, Container, Typography } from '@mui/material';
// import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
// import { selectOneGlacier, selectOneGlacierLoading } from '../features/glacierGraph/glacierSlice.ts';
// import Spinner from '../components/UI/Spinner/Spinner.tsx';
// import GlacierGraph from '../features/glacierGraph/GlacierGraph.tsx';
// import { useAppDispatch, useAppSelector } from '../app/hooks.ts';
// import { fetchGlacierById } from '../features/glacierGraph/glacierThunks.ts';
//
// const GlacierPage = () => {
//   const { id } = useParams<{ id: string }>(); // Получаем ID ледника из URL
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();
//
//   // Получение данных о леднике и состояния загрузки
//   const glacierData = useAppSelector(selectOneGlacier);
//   const loading = useAppSelector(selectOneGlacierLoading);
//
//   useEffect(() => {
//     if (id) {
//       dispatch(fetchGlacierById(id)); // Выполняем запрос для получения данных о леднике
//     }
//   }, [dispatch, id]);
//
//   const handleBackClick = () => {
//     navigate('/'); // Переход на домашнюю страницу
//   };
//
//   // Если данные загружаются, показываем спиннер
//   if (loading) return <Spinner />;
//
//   // Если ледник не найден, отображаем сообщение
//   if (!glacierData || glacierData.length === 0) {
//     return (
//       <Box sx={{ padding: 4 }}>
//         <Typography variant="h5">Glacier not found</Typography>
//       </Box>
//     );
//   }
//
//   return (
//     <Container maxWidth="lg">
//       {/* Кнопка "Назад" */}
//       <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginTop: 2 }}>
//         <Button
//           variant="text"
//           startIcon={<ArrowBackIosNewIcon />}
//           onClick={handleBackClick}
//           sx={{
//             color: '#555',
//             '&:hover': {
//               backgroundColor: 'transparent',
//               color: '#111',
//             },
//           }}
//         ></Button>
//       </Box>
//
//       {/* График ледника */}
//       <Box sx={{ marginTop: 2 }}>
//         <GlacierGraph
//           glacierData={glacierData}
//           glacierId={glacierData[0]?.glacier_id} // Передаем ID ледника
//         />
//       </Box>
//     </Container>
//   );
// };
//
// export default GlacierPage;

import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import GlacierGraph from '../features/glacierGraph/GlacierGraph.tsx';
import { GlacierData } from '../features/glacierGraph/glacier.ts';
import { ethers } from 'ethers';
import contractABI from '../features/web3/abi/GlacierNFT.json';
import { useWeb3 } from '../features/web3/useWeb3.ts';


const CONTRACT_ADDRESS = '0x6880E3722DC8E014DcAD09706916b1884F4bb716'; 

const GlacierPage = () => {
  const { id } = useParams<{ id: string }>(); // Получаем ID ледника из URL
  const navigate = useNavigate();

  // Фильтрация данных по ID
  const glacierData = GlacierData.filter((data) => data.glacier_id === Number(id));

  const handleBackClick = () => {
    navigate('/'); // Переход на домашнюю страницу
  };

  // Если ледник не найден, отображаем сообщение
  if (glacierData.length === 0) {
    return (
      <Box sx={{ padding: 4 }}>
        <Typography variant="h5">Glacier not found</Typography>
      </Box>
    );
  }

  const { signer, account, connectWallet } = useWeb3();

  const handleBuyNFT = async () => {
    try {
       if (!signer || !account) {
        await connectWallet(); // пробуем подключиться
          if (!signer) {
            navigate("/error", { state: { message: "Кошелёк не подключен" } });
            return;
          }
        }

      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const tx = await contract.invest({
        value: ethers.parseEther('0.001'),
      });

      const receipt = await tx.wait();
      const txHash = receipt.transactionHash ?? receipt.hash ?? tx.hash;

      // переадресация на страницу успеха с передачей хеша
      navigate("/success", { state: { txHash } });
    } catch (err: any) {
      console.error("buy error", err);
      
      const message =
      err?.code === 4001
        ? "Вы отменили транзакцию"
        : err?.reason || "Произошла ошибка при транзакции";

    navigate("/error", { state: { message } });
    }
  }

  const glacier = glacierData[0];

  return (
    <Container maxWidth="lg">
      {/* Кнопка "Назад" */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginTop: 2 }}>
        <Button
          variant="text"
          startIcon={<ArrowBackIosNewIcon />}
          onClick={handleBackClick}
          sx={{
            color: '#555',
            '&:hover': {
              backgroundColor: 'transparent',
              color: '#111',
            },
          }}
        ></Button>
      </Box>

      {/* === Изображение ледника === */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <img
          src={glacier.image || '/assets/glacier1.jpg'}
          alt={glacier.name}
          style={{
            width: '100%',
            maxHeight: 400,
            objectFit: 'cover',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          }}
        />
        <Typography variant="caption" display="block" sx={{ mt: 1, color: 'gray' }}>
          Фото: {glacier.name}
        </Typography>
      </Box>

      {/* График ледника */}
      <Box sx={{ marginTop: 2 }}>
        <GlacierGraph
          glacierData={glacierData} // Передаем данные ледника
          glacierId={glacierData[0]?.glacier_id} // Передаем ID ледника
        />
      </Box>
      <Box sx={{ textAlign: 'center', marginTop: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleBuyNFT}
          sx={{
            backgroundColor: '#00AEEF',
            '&:hover': { backgroundColor: '#0088cc' },
          }}
        >
          Купить NFT ледника
        </Button>
      </Box>

    </Container>

  );
};

export default GlacierPage;
