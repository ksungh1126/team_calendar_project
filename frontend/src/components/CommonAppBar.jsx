import { AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SchoolIcon from '@mui/icons-material/School';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link } from 'react-router-dom';

const CommonAppBar = ({ userName = 'user', pageName = '' }) => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2', color: '#fff' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* 좌측: 사용자 문구 */}
        <Typography variant="h6" component="div">
          {userName} 님의 {pageName} 입니다
        </Typography>
        {/* 우측: 여섯 개의 버튼 */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <IconButton color="inherit" component={Link} to="/main">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <HomeIcon />
              <Typography variant="caption" sx={{ color: '#fff' }}>메인</Typography>
            </Box>
          </IconButton>
          <IconButton color="inherit" component={Link} to="/team">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <GroupsIcon />
              <Typography variant="caption" sx={{ color: '#fff' }}>팀</Typography>
            </Box>
          </IconButton>
          <IconButton color="inherit" component={Link} to="/friends">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <PersonAddIcon />
              <Typography variant="caption" sx={{ color: '#fff' }}>친구</Typography>
            </Box>
          </IconButton>
          <IconButton color="inherit" component={Link} to="/schooltime">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <SchoolIcon />
              <Typography variant="caption" sx={{ color: '#fff' }}>시간표</Typography>
            </Box>
          </IconButton>
          <IconButton color="inherit">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <NotificationsIcon />
              <Typography variant="caption" sx={{ color: '#fff' }}>알림</Typography>
            </Box>
          </IconButton>
          <IconButton color="inherit">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <SettingsIcon />
              <Typography variant="caption" sx={{ color: '#fff' }}>설정</Typography>
            </Box>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default CommonAppBar; 