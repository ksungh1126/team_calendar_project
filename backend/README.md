## 기능 설명 (Short Description)
- 사용자의 로그인 및 회원가입을 처리하는 API를 개발합니다.
- JWT 토큰을 이용한 인증 방식 구현을 담당합니다.

## 사용 기술 및 도구 (Technologies and Tools)
- Node.js + Express.js (백엔드 프레임워크)
- MySQL (사용자 정보 저장)
- JWT (JSON Web Token, 인증 토큰 발급 및 검증)
- bcrypt (비밀번호 암호화)

## 기능적 요구사항 (Functional Requirements)
- 사용자는 이메일(ID)과 비밀번호로 로그인할 수 있어야 함
- 회원가입 시 입력값 유효성 검사 (이메일 형식, 비밀번호 최소 길이 등)
- 로그인 성공 시 JWT 발급
- 로그인 실패 시 적절한 에러 메시지 반환
- 로그인한 사용자만 접근 가능한 보호된 API 라우터 구현

## 비기능적 요구사항 (Non-Functional Requirements)
- 비밀번호는 bcrypt로 해시 처리되어 DB에 저장되어야 함
- JWT는 환경변수 기반의 시크릿 키로 서명되어야 함
- 민감한 정보는 `.env` 파일을 통해 관리
- API 응답은 일관된 JSON 포맷으로 제공
