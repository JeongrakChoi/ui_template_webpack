# UI_TEMPLATE_WEBPACK
웹퍼블리셔 작업용 개발환경(Feat. Webpack)

## 개요
- 주 사용자 : 웹 퍼블리셔
- 설명  
  - 웹팩 기반의 자동화 라이브러리 사용
  - 빌드 시 css,js 압축된 산출물로 컴파일

## 설치
```
node, npm, git 설치 후
> npm init
> npm start (시작)
> npm run build (빌드)
```

## HTML 에 img 태그로 이미지 넣을시 경로
Src/img/test

## 하위폴더로 html 파일 생성
webpack.config.js 에서 `서브페이지` 로 검색

## 라이브러리 추가
- Src/libs 폴더에 사용 하고자 하는 라이브러리 삽입 후 HTML 에 연결
- `npm i [라이브러리명]` 으로 설치

## 리소스 업로드
html 파일을 제외한 나머지 리소스를 업로드 합니다.   
이미지 하나만 바뀌어도 이미지 해쉬값을 빌드된 css 파일에서도 컨트롤 하므로 **css도 같이 재업로드** 해야 합니다.
```css
/*
  build 된 css 파일에서도 다음과 같이 hash 값을 가지고 있기 때문에 이미지 하나만 바뀌여도 css 파일도 재업로드 필요
  이유는 사용자 입장에서 웹페이지를 볼때 이미지 캐쉬를 매번 날리지 않기 때문에 F5 키로 새로고침시 바로 반영이 되야 합니다.
  cdn 사용시 purge 순서는 이미지 -> CSS 순으로 권장드립니다.
*/
body{background:url(../img/common/test.jpg?3abb2aabb6c25140838b11ea8418c081) 0 0 no-repeat}
```