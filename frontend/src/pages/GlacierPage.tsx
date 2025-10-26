import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import GlacierGraph from '../features/glacierGraph/GlacierGraph.tsx';
import { GlacierData } from '../features/glacierGraph/glacier.ts';
import { ethers } from 'ethers';
import contractABI from '../features/web3/abi/GlacierNFT.json';
import { useWeb3 } from '../features/web3/useWeb3.ts';
import Lednic from '../assets/glacier1.jpg';


const CONTRACT_ADDRESS = '0x7B5d6cda551D63570db3DF922b28B8f7b002C7Df';
const TOKEN_URI = "https://ipfs.io/ipfs/bafkreihx4mb5pzqcflve4gjfljkf73drwgfarlgtvukoxe7vrywuifkhvi";

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
            navigate("/error", { state: { message: "Wallet is not connected" } });
            return;
          }
        }
      }

      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const tx = await contract.mint(
        TOKEN_URI,
        { value: ethers.parseEther("0.01") }
      );

      const receipt = await tx.wait();
      const txHash = receipt.transactionHash ?? receipt.hash ?? tx.hash;

      // переадресация на страницу успеха с передачей хеша
      navigate('/success', { state: { txHash } });
    } catch (err: any) {
      console.error("buy error", err);
      
      const message =
      err?.code === 4001
        ? "You cancelled transaction"
        : err?.reason || "Error during transaction";

      const message = err?.code === 4001 ? 'Вы отменили транзакцию' : err?.reason || 'Произошла ошибка при транзакции';

      navigate('/error', { state: { message } });
    }
  };

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
           onClick={() => window.location.href = 'https://artificialglacier.netlify.app/'}
          src={Lednic}
          alt={`Glacier photo ${Lednic}`}
          style={{
            width: '100%',
            maxHeight: 400,
            objectFit: 'cover',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          }}
        />
        <Typography variant="caption" display="block" sx={{ mt: 1, color: 'gray' }}>
          Glacier
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
          Buy NFT glacier
        </Button>
      </Box>
    </Container>
  );
};

export default GlacierPage;
