# Youtube Clone

- [ ] / -> Home
- [ ] /join -> Join
- [ ] /login -> Login
- [ ] /search -> Search

- [ ] /users/:id -> See User
- [ ] /users/logout -> Log out
- [ ] /users/edit -> Edit My Profile
- [ ] /users/delete -> Delete My Profile

- [ ] /videos/upload -> Upload Video
- [ ] /videos/:id -> See Video
- [ ] /videos/:id/edit -> Edit Video
- [ ] /videos/:id/delete -> Delete Video

---

### To DO list

- [x] CreatedAt 수정하기

경우의수 : 몇분 전, 몇시 전, 몇일 전, 몇주 전, 몇달 전, 몇년 전  
1시간 3600초 / 1일 86400초 / 1주 604800초 / 1달 2592000초(30일기준) /1년 31536000초

---

### CSS To Do List

- [x] Profile
- [x] Profile Edit
- [x] Change Password
- [x] Video Watch -> need Edit_Btn, Remove_Btn
- [x] Video Upload
- [x] Video Edit -> Edit/Upload Same structure -> Component (name: updateVideo ?)

---

### 생각,고민

#### - videoAutoPlay

새로고침시 autuPlay 오류가 발생 한다.  
video 볼륨이 muted된 상태라면 새로고침 하더라도 오류가 없긴 하다  
원한다면 promise를 사용해서 볼륨을 muted 상태로 놓지 않더라도 자동 재생이 되지만  
비디오 파일마다 소리가 다르고 볼륨이 높은 상태에서 자동 재생 된다면 불쾌한 경험이 될 수 있기에  
좋은 정책이라 생각이 들면서도 매번 사용자가 볼륨을 높여야하는 번거로움이 있어서 고민이 되는 부분이다.
https://developer.chrome.com/blog/autoplay/

#### - comment Delete

comment 삭제시 user와 video에 등록된 Obj ID를 모두 삭제 시켜주도록 작성했다.  
자연스럽게 video도 모든 comment를 삭제 시키려고 생각해보다가  
문득 video 삭제시 모든 comment를 찾아서 지우는게 맞을까?  
만약 극단적으로 댓글이 수천만개이상이 넘어갈때 모든 댓글이 다 삭제하는 것보다 연결만 끊는게 좋지 않을까 생각한다.  
(같은 예는 아니지만 카카오톡 메세지 삭제시 그냥 삭제된 메세지로만 보이는걸로 기억함)

#### - comment reload

댓글을 작성했을때 새로고침 없이 추가되도록 코드를 작성하다가 createElement와 appendChild등 길어지는 코드를 보다보니 가독성이 너무 좋지 않았다. 가독성을 위해 댓글을 추가 하면 새로고침 하도록 작성은 했지만 댓글 수가 많아 진다 생각하면 로딩하는 시간도 길어지고 불쾌한 경험이 될 것 같아 수정 하기로 결정했다. react나 vue를 아직 배우지 않아서 대체 할 수 있는 web-component를 사용해봤다. 여전히 가독성이 좋지 않아 lit을 한번 사용해보면 좋을 것 같다.

#### - avatar

유튜브와 똑같이 유저 이름과 랜던함 색상에 img를 만들려다보니 문제 발생  
구글에서는 Profile Image를 만들어서 제공 해주는 것 같은데 구현이 힘들 것 같아 이름과 랜덤 색상을 만들어서 비슷하게 구현했다.  
image파일이 아니다보니 배경색이 늘어날 수록 pug템플릿에 if가 많아져 배경색을 더 추가하는 것과 유지 보수가 어려울 것 같았다.  
많은 페이지에 Avatar가 존재하는데 하나의 페이지에서 작업하고 테스트하다보니 중복되는 부분이 있음에도 복사 붙여넣기를 했다.  
결국 mixin으로 묶어서 정리 했지만 처음 작성할때 조금 더 확장성을 고려해서 작성했으면 좋지 않았을까 하는 아쉬움이 있다.
