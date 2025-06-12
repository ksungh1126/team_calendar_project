import { AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout'; // ✅ SchoolIcon 제거됨
import { Link, useNavigate } from 'react-router-dom';

const CommonAppBar = ({ userName = 'user', pageName = '' }) => {
  const navigate = useNavigate();

  const handleNavigationClick = (targetPage) => {
    console.log(`${targetPage} 페이지로 이동합니다.`);
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); // 로그인 정보 제거
    navigate('/login', { replace: true });
};
  return (
    <AppBar position="static" sx={{ backgroundColor: '#22C0B8', color: '#fff' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* 좌측: 사용자 문구 */}
        <Typography variant="h6" component="div">
          {userName} 님의 {pageName} 입니다
        </Typography>

        {/* 우측: 버튼들 */}
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

          {/* ✅ 시간표 버튼 제거됨 */}

          <IconButton color="inherit" onClick={handleLogout}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <LogoutIcon />
              <Typography variant="caption" sx={{ color: '#fff' }}>로그아웃</Typography>
            </Box>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default CommonAppBar;
