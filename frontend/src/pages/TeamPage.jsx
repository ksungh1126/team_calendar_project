import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  ListItemSecondaryAction,
  IconButton,
  Autocomplete,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import CommonAppBar from '../components/CommonAppBar';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

const TeamPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [isCreateTeamDialogOpen, setIsCreateTeamDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    color: '#3788d8'
  });
  const [inviteEmail, setInviteEmail] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [invitedMembers, setInvitedMembers] = useState([]);

  // 팀 목록 가져오기
  const fetchTeams = async () => {
    try {
      const response = await api.get('/team');
      setTeams(response.data.teams);
    } catch (error) {
      console.error('팀 목록 가져오기 실패:', error);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // 팀 생성 다이얼로그 열기
  const handleOpenCreateTeamDialog = () => {
    setNewTeam({
      name: '',
      description: '',
      color: '#3788d8'
    });
    setIsCreateTeamDialogOpen(true);
  };

  // 팀 생성 다이얼로그 닫기
  const handleCloseCreateTeamDialog = () => {
    setIsCreateTeamDialogOpen(false);
  };

  // 팀 생성
  const handleCreateTeam = async () => {
    try {
      if (!newTeam.name) {
        alert('팀 이름은 필수 입력 항목입니다.');
        return;
      }

      const response = await api.post('/team', newTeam);
      handleCloseCreateTeamDialog();
      fetchTeams();
      
      // 팀 생성 후 바로 팀원 초대 다이얼로그 열기
      setSelectedTeam(response.data.team);
      setIsInviteDialogOpen(true);
    } catch (error) {
      console.error('팀 생성 실패:', error.response?.data || error.message);
      alert(error.response?.data?.error || '팀 생성에 실패했습니다.');
    }
  };

  // 팀원 초대 다이얼로그 열기
  const handleOpenInviteDialog = (team) => {
    setSelectedTeam(team);
    setInviteEmail('');
    setInvitedMembers([]);
    setIsInviteDialogOpen(true);
  };

  // 팀원 초대 다이얼로그 닫기
  const handleCloseInviteDialog = () => {
    setIsInviteDialogOpen(false);
    setSelectedTeam(null);
    setInviteEmail('');
    setInvitedMembers([]);
  };

  // 이메일 검색
  const handleSearchEmail = async (searchTerm) => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await api.get(`/user/search?email=${searchTerm}`);
      setSearchResults(response.data.users);
    } catch (error) {
      console.error('사용자 검색 실패:', error);
    }
  };

  // 팀원 초대
  const handleInviteMember = async () => {
    if (!inviteEmail) {
      alert('이메일을 입력해주세요.');
      return;
    }

    try {
      await api.post(`/team/${selectedTeam.id}/invite`, { email: inviteEmail });
      setInvitedMembers([...invitedMembers, inviteEmail]);
      setInviteEmail('');
      alert('초대가 완료되었습니다.');
    } catch (error) {
      console.error('팀원 초대 실패:', error.response?.data || error.message);
      alert(error.response?.data?.error || '팀원 초대에 실패했습니다.');
    }
  };

  // 초대된 팀원 제거
  const handleRemoveInvitedMember = (email) => {
    setInvitedMembers(invitedMembers.filter(member => member !== email));
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <CommonAppBar userName={user?.name || '사용자'} pageName="팀 페이지" />
      <Box
  sx={{
    mt: 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
  <img
    src="/team_image.jpg"
    alt="Team"
    style={{
      width: '200px',
      height: 'auto',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }}
  />
</Box>
      <Box sx={{ flex: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">내 팀</Typography>
          <Button
            variant="contained"
            startIcon={<GroupAddIcon />}
            onClick={handleOpenCreateTeamDialog}
          >
            팀 생성하기
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {teams.map((team) => (
            <Card
              key={team.id}
              sx={{
                width: 300,
                backgroundColor: 'white',
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: team.color,
                      mr: 2,
                    }}
                  />
                  <Typography variant="h6">{team.name}</Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {team.description}
                </Typography>

                {team.leader && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <Avatar
                      src={team.leader.avatar}
                      alt={team.leader.name}
                      sx={{ width: 32, height: 32, mr: 1 }}
                    />
                    <Typography variant="body2">
                      팀장: {team.leader.name}
                    </Typography>
                  </Box>
                )}

                {team.members && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    팀원 {team.members.length}명
                  </Typography>
                )}

                {team.events && team.events.length > 0 && (
                  <List dense sx={{ mt: 1 }}>
                    {team.events.map((event) => (
                      <ListItem key={event.id}>
                        <ListItemText
                          primary={event.title}
                          secondary={event.date}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>

              <CardActions>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate(`/team/${team.id}`)}
                >
                  팀스페이스 접속
                </Button>

                {/* 팀원 초대 버튼 */}
                <Box sx={{ mt: 2, width: '100%' }}>
                  <Button
                    variant="outlined"
                    startIcon={<PersonAddIcon />}
                    onClick={() => handleOpenInviteDialog(team)}
                    fullWidth
                  >
                    팀원 초대
                  </Button>
                </Box>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Box>

      {/* 팀 생성 다이얼로그 */}
      <Dialog open={isCreateTeamDialogOpen} onClose={handleCloseCreateTeamDialog} maxWidth="sm" fullWidth>
        <DialogTitle>새 팀 생성</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="팀 이름"
              value={newTeam.name}
              onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="팀 설명"
              value={newTeam.description}
              onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
              multiline
              rows={2}
              fullWidth
            />
            <TextField
              label="팀 색상"
              type="color"
              value={newTeam.color}
              onChange={(e) => setNewTeam({ ...newTeam, color: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateTeamDialog}>취소</Button>
          <Button onClick={handleCreateTeam} variant="contained" color="primary">
            생성
          </Button>
        </DialogActions>
      </Dialog>

      {/* 팀원 초대 다이얼로그 */}
      <Dialog open={isInviteDialogOpen} onClose={handleCloseInviteDialog} maxWidth="sm" fullWidth>
        <DialogTitle>팀원 초대</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Autocomplete
              freeSolo
              options={searchResults.map(user => user.email)}
              inputValue={inviteEmail}
              onInputChange={(event, newValue) => {
                setInviteEmail(newValue);
                handleSearchEmail(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="이메일"
                  fullWidth
                />
              )}
            />
            <Button
              variant="contained"
              onClick={handleInviteMember}
              disabled={!inviteEmail}
            >
              초대하기
            </Button>

            {invitedMembers.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  초대된 팀원
                </Typography>
                <List>
                  {invitedMembers.map((email) => (
                    <ListItem key={email}>
                      <ListItemText primary={email} />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveInvitedMember(email)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInviteDialog}>닫기</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeamPage;