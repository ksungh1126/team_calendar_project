# 팀 캘린더 프로젝트

## 프로젝트 구조
```
team_calendar_project/
├── frontend/          # React 프론트엔드
│   ├── public/        # 정적 파일
│   ├── src/          # 소스 코드
│   │   ├── components/  # 재사용 가능한 컴포넌트
│   │   ├── pages/      # 페이지 컴포넌트
│   │   ├── contexts/   # React Context
│   │   ├── utils/      # 유틸리티 함수
│   │   ├── App.js      # 메인 앱 컴포넌트
│   │   └── index.js    # 진입점
│   └── package.json   # 프론트엔드 의존성
│
└── backend/          # 백엔드 서버
    ├── src/          # 소스 코드
    │   ├── config/    # 설정 파일
    │   ├── models/    # 데이터베이스 모델
    │   ├── routes/    # API 라우트
    │   ├── controllers/ # 컨트롤러
    │   └── utils/     # 유틸리티 함수
    └── package.json  # 백엔드 의존성
```

## 데이터베이스 스키마

### Users 테이블
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(255),
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Teams 테이블
```sql
CREATE TABLE teams (
    id INT PRIMARY KEY AUTO_INCREMENT,
    team_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### Team_Members 테이블
```sql
CREATE TABLE team_members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    team_id INT NOT NULL,
    user_id INT NOT NULL,
    role ENUM('member', 'leader') DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_team_member (team_id, user_id)
);
```

### Schedules 테이블
```sql
CREATE TABLE schedules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    schedule_type ENUM('personal', 'team') NOT NULL,
    color VARCHAR(20) DEFAULT '#3788d8',
    is_all_day BOOLEAN DEFAULT false,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);
```

### Team_Schedules 테이블
```sql
CREATE TABLE team_schedules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    schedule_id INT NOT NULL,
    team_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);
```

## 환경 변수 설정

### 백엔드 (.env)
```env
# 서버 설정
PORT=3001
NODE_ENV=development

# 데이터베이스 설정
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=team_calendar_db
DB_PORT=3306

# JWT 설정
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# 기타 설정
CORS_ORIGIN=http://localhost:3000
```

### 프론트엔드 (.env)
```env
# API 설정
REACT_APP_API_URL=http://localhost:3001

# Firebase 설정 (필요한 경우)
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
```

## 데이터베이스 설정 방법

1. MySQL 서버 실행
2. 데이터베이스 생성:
```bash
mysql -u root -p < backend/src/config/database.sql
```

## 주요 API 엔드포인트

### 인증
- POST /api/auth/register - 회원가입
- POST /api/auth/login - 로그인
- GET /api/auth/me - 현재 사용자 정보

### 일정
- GET /api/schedules - 일정 목록 조회
- POST /api/schedules - 일정 생성
- GET /api/schedules/:id - 일정 상세 조회
- PUT /api/schedules/:id - 일정 수정
- DELETE /api/schedules/:id - 일정 삭제

### 팀
- GET /api/teams - 팀 목록 조회
- POST /api/teams - 팀 생성
- GET /api/teams/:id - 팀 상세 조회
- PUT /api/teams/:id - 팀 수정
- DELETE /api/teams/:id - 팀 삭제

### 팀 멤버
- GET /api/teams/:id/members - 팀 멤버 목록 조회
- POST /api/teams/:id/members - 팀 멤버 추가
- DELETE /api/teams/:id/members/:userId - 팀 멤버 제거 