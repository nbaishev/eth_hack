import React, { useState } from 'react';
import { User } from '../../../types';
import { Menu, MenuItem, styled, Typography } from '@mui/material';
import { useAppDispatch } from '../../../app/hooks';
import { logout } from '../../../features/users/usersThunks.ts';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

interface Props {
  user: User;
}

const ButtonStyled = styled('button')({
  color: 'rgb(85, 85, 85)',
  fontSize: '14px',
  textDecoration: 'none',
  background: 'inherit',
  border: 'none',
  '&:hover': {
    color: '#000',
  },
  cursor: 'pointer',
});

const UserMenu: React.FC<Props> = ({ user }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <>
      <ButtonStyled onClick={handleClick}>
        <PersonIcon />
      </ButtonStyled>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            width: {
              xs: '100vw', // 100% ширины для маленьких экранов
              sm: '270px', // фиксированная ширина для экранов шире, чем 600px
            },
          },
        }}
      >
        <Typography sx={{ p: '6px 16px' }}>Hi, {user.displayName}!</Typography>
        <MenuItem onClick={handleClose}>
          <SettingsIcon sx={{ mr: 1 }} /> Manage Account
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1 }} /> Log out
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
