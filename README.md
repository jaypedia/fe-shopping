# Coupang Clone

##### 2022.3.14 ~ 3.18

---

![coupang1](https://user-images.githubusercontent.com/85419343/158559755-1e5444ea-449f-4aeb-bf80-a63f19b956f9.gif)

## Functional Requirements

### 1. Main page UI

- [x] SASS(SCSS) 활용

### 2. Search

- [x] mock data 생성 - search.json

#### 1) 최근 검색어

- [x] 검색창에 focus 주면 `최근 검색어` 노출
- [x] 검색창에 검색어 입력 시 `최근 검색어`는 사라지고 `추천 검색어` 노출
- [x] `최근 검색어`는 `localStorage`에 저장하고 불러오기
  - [x] 검색창에 검색어를 입력한 후 submit 하면 저장
  - [x] 검색어 기록 창 크기의 한계로 최대 8개까지 저장됨
  - [x] 최근에 검색한 순서대로 노출
  - [x] `전체삭제` 버튼 눌렀을 시 전체 삭제 반영

#### 2) 추천 검색어 (auto complete)

- [x] 500ms 이상 글자를 입력하지 않고 머물러 있을 때에만 서버에 데이터 요청
- [x] 검색어와 일치하는 글자 강조하기
- [x] 검색어를 입력 시와 한 글자씩 삭제 시에도 추천 검색어 노출
- [ ] 키보드 방향키 위/아래로 이동 시, 하나씩 이동하며 자동완성 글자가 선택되어 입력창에 보여짐
  - [ ] 무한 이동 시도 (예 - 맨 위 검색어에서 방향키 위 누를 시 맨 아래 검색어로 이동)

#### 3) 검색 카테고리

- [x] 카테고리 '전체' 클릭 시, 펼쳐지는 애니메이션 효과 적용
- [x] 카테고리 선택 시 적용하기

### 3. Carousel

- [ ] list에 마우스가 지나갈 시 이미지 변경
  - [ ] 마우스가 지나가는 시간이 짧다면 내용이 변경되지 않음
- [ ] 6개 이미지가 일정 시간 간격으로 자동으로 변경됨
  - [ ] 선택된 list item도 해당하는 이미지 것으로 함께 변경됨

## Programming Requirements

- [ ] prototype 활용

---

## Step1

### Questions

#### SCSS 디렉토리 구조

- [7-1 Sass Architecture](https://www.learnhowtoprogram.com/user-interfaces/building-layouts-preprocessors/7-1-sass-architecture)를 참고하여 구조를 만들어 보았습니다. 완전히 따라하지는 않고 현재 미션에 좀 더 최적화 해보았습니다. 확실히 구조화를 하니 나중에 유지보수할 때에 편하겠다는 생각이 들었습니다.

##### 각 디렉토리 설명

📂`base`: reset, normalize같이 UI를 초기화하는 파일들을 포함
📂`constants`: 색깔, 폰트 크기같이 변수로 저장해서 쓸 수 있는 것들을 포함
📂`layout`: 페이지의 container 레이아웃을 해 주는 파일 포함
📂`mixins`: 자주 활용하는 mixin들 포함
📂`components`: header, banner같은 컴포넌트 파일 포함
📂`modules`: 컴포넌트 내부의 요소들을 스타일링하는 파일 포함

<br>

- 위와 같이 디렉토리를 저의 생각대로 응용하여 구성해 보았는데, 괜찮은 방법인지 피드백을 받고 싶습니다.
- 또한 SASS를 처음 스스로 적용해 보았는데 아쉬운 점, 부족한 점이 보인다면 가차없는 피드백 부탁드립니다. 개선하도록 하겠습니다.

#### JS 설계와 구현의 순서

- 이번 미션의 핵심은 아무래도 모듈 단위로 개발하는 것, 그리고 prototype 기반 객체를 만들어서 활용하는 것인데, 아직 익숙하지 않아서 우선 익숙한 방식대로 구현하고, 그 후에 리팩토링을 하는 방식으로 진행해 보려고 합니다.
- 위와 같은 방식도 괜찮을지, 혹은 웬만하면 설계와 학습을 먼저 하고 구현은 나중에 하는 게 나을지 리뷰어분의 생각을 듣고 싶습니다.

---

## Step2

![coupang2](https://user-images.githubusercontent.com/85419343/159005274-35374ad0-7b00-4e75-abc7-2ab337b110ff.gif)

### 진행상황

- [x] 최근 검색어 개별 삭제 기능 추가
- [x] 500ms 이상 글자를 입력하지 않고 머물러 있을 때에만 서버에 데이터 요청
- [x] Core Component를 상속하여 기존 index.js 파일에 있던 로직 리팩토링
- [x] 검색 카테고리 펼친 후, 카테고리 영역 밖 클릭 시 접히도록 구현
- [x] 최근 검색어 저장 끄기 기능
- [ ] 키보드 위, 아래 방향키로 자동완성 키워드 탐색 - 진행 중

### 어려웠던 점 & 질문

- Core Component를 사용하는 식으로 리팩토링을 해나가면서 state는 어떤 컴포넌트에 위치시켜야 할지, 어디까지 state로 만들지 정하는 것이 어려웠습니다.
  - 예를 들어 검색 자동완성 구현 시 fetch로 받아오는 데이터도 state에 저장해야 할지 고민되었습니다.
- **리팩토링을 하다 보니 Search.js 파일이 비대해졌는데 메서드를 다른 하위 컴포넌트로 분리하는 게 나을까요?**
- 500ms 이상 가만히 input에서 머물러 있을 때만 서버에 데이터를 요청하는 로직을 짤 때 어려웠습니다. 처음엔 flag 변수를 사용해서 구현해 보려고 했는데 잘 되지 않았고, Stackoverflow를 결국 참고해서 구현했습니다.
- 키보드로 자동완성 검색어들을 이동하는 로직을 짜는 것이 쉽지 않았고 아직도 진행 중입니다.

### 향후 계획

- [ ] 키보드 위, 아래 방향키로 자동완성 키워드 탐색 기능 완성
- [ ] Carousel 완성

---

### Reference

- [Simple Component Examples](https://github.com/JunilHwang/simple-component)
- [stackoverflow | run-javascript-function-when-user-finishes-typing-instead-of-on-key-up](https://stackoverflow.com/questions/4220126/run-javascript-function-when-user-finishes-typing-instead-of-on-key-up)
