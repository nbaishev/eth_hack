import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Container,
  IconButton,
  styled,
  Toolbar,
  SwipeableDrawer,
  List,
  ListItemText,
  ButtonBase,
  Button,
} from '@mui/material';
import { Close as CloseIcon, Menu as MenuIcon } from '@mui/icons-material';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../app/hooks.ts';
import { selectUser } from '../../../features/users/usersSlice.ts';
import UserMenu from './UserMenu.tsx';
import logo from '../../../assets/logo-usta.jpg';
import './AppToolbar.css';
import { useWeb3 } from '../../../features/web3/useWeb3.ts';

const NavLinkStyled = styled(NavLink)<{ to: string }>({
  color: 'rgb(85, 85, 85)',
  fontSize: '14px',
  textDecoration: 'none',
  marginLeft: '20px',
  cursor: 'pointer',
  '&:hover': {
    color: '#000',
  },
});

const AppToolbar = () => {
  const user = useAppSelector(selectUser);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { connectWallet, account } = useWeb3();

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleNavigation = (section: string) => {
    if (location.pathname !== '/') {
      navigate('/'); // Переключаемся на главную страницу
      setTimeout(() => {
        scrollToSection(section); // Делаем прокрутку после перехода на главную
      }, 500); // Небольшая задержка для обеспечения корректного выполнения
    } else {
      scrollToSection(section);
    }
  };

  const scrollToSection = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      const offset = -60; // Добавьте отступ, если есть фиксированное меню
      const elementPosition = element.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth',
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const menuItems = ['about', 'calculator', 'about'];

  const drawerList = () => (
    <Box
      sx={{
        width: '100vw',
        height: 'calc(100vh - 65px)',
        overflow: 'hidden',
        borderTop: '1px solid #eceee8',
      }}
      role="presentation"
    >
      <IconButton onClick={() => setDrawerOpen(false)} sx={{ alignSelf: 'flex-end', margin: '16px' }}>
        <CloseIcon />
      </IconButton>
      <List sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {menuItems.map((item) => (
          <ButtonBase
            key={item}
            sx={{ borderBottom: '1px solid #eceee8', width: '100%', textAlign: 'left', padding: '16px' }}
            onClick={() => {
              setDrawerOpen(false);
              handleNavigation(item); // Обновим функцию перехода и прокрутки
            }}
          >
            <ListItemText primary={item} />
          </ButtonBase>
        ))}
        <Box sx={{ mt: 'auto', p: '0 16px 70px 16px' }}>
          <ButtonBase
            sx={{
              backgroundColor: '#6bbd45',
              color: '#fff',
              fontFamily: 'Fira Sans, sans-serif',
              fontSize: '16px',
              fontWeight: 500,
              justifyContent: 'center',
              borderRadius: '10px',
              py: 2,
              width: '100%',
            }}
            onClick={() => {
              setDrawerOpen(false);
              navigate('/request'); // Перейти к форме установки ледника
            }}
          >
            Request glacier installation
          </ButtonBase>
        </Box>
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#fff', boxShadow: 'none' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ flex: 1, justifyContent: 'space-between' }}>
          <IconButton
            edge="start"
            aria-label="menu"
            onClick={toggleDrawer(!drawerOpen)}
            sx={{ display: { xs: 'block', md: 'none', color: '#000' } }}
          >
            {drawerOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>

          <Box component={NavLink} to="/" onClick={scrollToTop} sx={{ textDecoration: 'none', cursor: 'pointer' }}>
            <img src={logo} alt="Logo" style={{ height: '60px' }} />
          </Box>

          <Box display={{ xs: 'none', md: 'flex' }} justifyContent="center">
            <NavLinkStyled to="/" onClick={() => handleNavigation('about')}>
              ABOUT
            </NavLinkStyled>
            <NavLinkStyled to="/" onClick={() => handleNavigation('calculator')}>
              CALCULATOR
            </NavLinkStyled>
            <NavLinkStyled to="/" onClick={() => handleNavigation('examples')}>
              EXAMPLES
            </NavLinkStyled>
          </Box>

          <Box display="flex" alignItems="center">
            {account ? (
                <Button variant="outlined">{account.slice(0, 6)}...{account.slice(-4)}</Button>
              ) : (
                <Button variant="contained" onClick={connectWallet}>
                  Подключить кошелёк
                </Button>
              )}
            {user ? <UserMenu user={user} /> : <NavLinkStyled to="/login">SIGN IN</NavLinkStyled>}
          </Box>
        </Toolbar>
      </Container>

      {/* Добавляем SwipeableDrawer */}
      <SwipeableDrawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
        {drawerList()}
      </SwipeableDrawer>
    </AppBar>
  );
};

export default AppToolbar;
