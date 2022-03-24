# Coupang Clone

##### 2 weeks: 2022.3.14 ~ 3.25

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

## Step 3

### 진행상황

- [x] 키보드 위, 아래 방향키로 자동완성 키워드 탐색 기능 완성
  - [x] 아래 방향키 누를 때는 커서가 단어의 맨 끝에 있지만 위 방향키를 누를 땐 커서가 단어의 맨 앞으로 가는데, 커서가 항상 맨 끝에 있도록 할 수 없을지? - 해결 완료
- [x] Carousel 자동 슬라이딩 기능
  - [ ] Carousel에 debounce 적용

### 어려웠던 점 & 질문

#### (1) Carousel: Banner image 전환 시 "Dropped Frame" 발생 문제

![image](https://user-images.githubusercontent.com/85419343/159647441-30816aad-0de2-41da-92bc-2792fdc02bbc.png)

- 배너 이미지가 전환될 때마다 깜빡거리는 느낌이 들어서 성능이 별로 좋지 않다는 느낌이 들었습니다. 개발자 도구의 Performance 탭으로 성능을 측정해 본 결과 역시나 문제가 있었고 `Dropped Frame`이라는 것이 배너 이미지 전환 시 발생하고 있었습니다. 이것이 발생할 때는 Frame이 보이지 않아서 육안으로도 확인 가능한 깜빡임이 발생하는 것이었습니다.
- 하지만 왜 Dropped Frame이 발생하는 건지에 대해서는 잘 모르겠습니다. 현상은 대략적으로 분석이 되었는데 원인을 찾지 못했습니다.
- 혹시나 url link로 불러오는 것에서 지연이 발생하나 해서, 링크가 아닌 img 폴더에 jpg 파일을 넣어 그것을 불러오는 식으로도 시도했는데(예 - `url('./img/bannerImg.jpg') 같은 결과였습니다.

```js
  slideBanner() {
    setInterval(() => {
      if (this.isMouseover) return;
      this.slideBannerByIdx();
    }, this.bannerInterval);
  }

  slideBannerByIdx() {
   ...
      bannerImg.style.background = `url(${bannerData[this.bannerIdx++].banner}) center no-repeat`;
  }
```

- 현재 위와 같은 식으로 배너 이미지를 바꿔주고 있습니다. setInterval의 콜백 함수에 `slideBannerByIdx` 함수를 넣어 지정된 초마다 위 로직을 호출하고 있습니다. Dropped Frame이 발생할 만한 여지가 있을까요?

#### (2) 이벤트 다루는 로직 작성 시

```js
// 장황한 로직... (Search.js)
  scrollAutoComplete(key) {
  ...
    const direction = {
      ArrowUp: () => {
        ...
      },
      ArrowDown: () => {
      ...
      },
    };
    direction[key]();
  }
```

- 이번에는 Search.js의 `scrollAutoComplete` 함수, Banner.js의 `slideBannerByIdx` 함수를 주로 코딩했는데, 로직을 먼저 글로 정리해 보고 그것을 코드로 옮겼음에도 불구하고 코드가 굉장히 장황해지고 내부를 봤을 때 직관적으로 읽어내기 어려울 것 같다는 생각을 했습니다. if문으로 분기해야 하는 것도 많고요.
- 대안으로 객체를 이용해서 코드가 좀 더 깔끔하게 읽히게 하려고 했지만 근본적인 해결책은 아닌 것 같았습니다. 이럴 경우 함수를 최대한 여러 개로 만드는 게 좋은 방법일까요? 이 경우 컴포넌트 내부에 함수가 너무 많아지게 됩니다. 혹은 중첩된 함수로 만드는 것은 어떨까요?

#### (3) 카테고리 Dropdown animation 수정 (SCSS)

- 카테고리 드롭다운 클릭 시 삼각형 토글이 위, 아래로 움직이도록 했습니다. 사소한 디테일을 챙겨보았습니다.
- 카테고리 드롭다운 시 글자가 겹쳐져 애니메이션이 부자연스럽다고 생각되어 수정해 보았습니다.
- 그러나 또 다른 문제가 발생했는데, 패딩이 변경되면서 움직이고 있습니다. 여러 방법을 시도했지만 해결하지 못했습니다.

| Before                                                                                                                   | After                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| ![categoryBefore](https://user-images.githubusercontent.com/85419343/159675651-e741cff9-d057-43d6-a743-2dad1c145b2c.gif) | ![categoryAfter](https://user-images.githubusercontent.com/85419343/159682950-3c0de31b-e996-45bc-9def-f5d5a6a696ed.gif) |
| transform: scaleY() 사용                                                                                                 | height 조정                                                                                                             |
| 드롭다운 시 글자 겹쳐져 보임                                                                                             | list의 패딩이 움직임                                                                                                    |

---

### Reference

- [Simple Component Examples](https://github.com/JunilHwang/simple-component)
- [stackoverflow | run-javascript-function-when-user-finishes-typing-instead-of-on-key-up](https://stackoverflow.com/questions/4220126/run-javascript-function-when-user-finishes-typing-instead-of-on-key-up)
