import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
} from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SchoolIcon from '@mui/icons-material/School';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';

import { Link } from 'react-router-dom';
import NotificationPopup from './NotificationPopup';
import SettingPopup from './SettingPopup';

const CommonAppBar = ({ userName = 'user', pageName = '' }) => {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [settingOpen, setSettingOpen] = useState(false);

  const handleNavigationClick = (targetPage) => {
    console.log(`${targetPage} 페이지로 이동합니다.`);
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#22C0B8', color: '#fff' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* 좌측: 사용자 문구 */}
          <Typography variant="h6" component="div">
            {userName} 님의 {pageName} 입니다
          </Typography>

          {/* 우측: 여섯 개의 버튼 */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton color="inherit" component={Link} to="/main" onClick={() => handleNavigationClick('메인')}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <HomeIcon />
                <Typography variant="caption" sx={{ color: '#fff' }}>메인</Typography>
              </Box>
            </IconButton>

            <IconButton color="inherit" component={Link} to="/team" onClick={() => handleNavigationClick('팀')}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <GroupsIcon />
                <Typography variant="caption" sx={{ color: '#fff' }}>팀</Typography>
              </Box>
            </IconButton>

            <IconButton color="inherit" component={Link} to="/friends" onClick={() => handleNavigationClick('친구')}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <PersonAddIcon />
                <Typography variant="caption" sx={{ color: '#fff' }}>친구</Typography>
              </Box>
            </IconButton>

            <IconButton color="inherit" component={Link} to="/schooltime" onClick={() => handleNavigationClick('시간표')}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <SchoolIcon />
                <Typography variant="caption" sx={{ color: '#fff' }}>시간표</Typography>
              </Box>
            </IconButton>

            {/* 알림 버튼 */}
            <IconButton color="inherit" onClick={() => setNotificationOpen(true)}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <NotificationsIcon />
                <Typography variant="caption" sx={{ color: '#fff' }}>알림</Typography>
              </Box>
            </IconButton>

            {/* 설정 버튼 */}
            <IconButton color="inherit" onClick={() => setSettingOpen(true)}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <SettingsIcon />
                <Typography variant="caption" sx={{ color: '#fff' }}>설정</Typography>
              </Box>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* 알림 팝업 */}
      <NotificationPopup open={notificationOpen} onClose={() => setNotificationOpen(false)} />

      {/* 설정 팝업 */}
      <SettingPopup open={settingOpen} onClose={() => setSettingOpen(false)} />
    </>
  );
};

export default CommonAppBar;