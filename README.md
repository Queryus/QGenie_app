# QGenie App

QGenie 데스크톱 애플리케이션입니다.

---

## 🚀 시작하기

### **1. 개발 환경 설정**

이 프로젝트는 `npm` 패키지 매니저와 `Node.js`가 필요합니다. `.nvmrc` 파일에 명시된 버전을 사용하는 것을 권장합니다.

```bash
# .nvmrc 파일에 맞는 Node.js 버전 사용
nvm use

# 프로젝트 의존성 설치
npm install
```

### **2. 개발 서버 실행**

다음 명령어를 실행하면 Electron 앱이 개발 모드로 실행됩니다. 소스 코드를 수정하면 자동으로 앱이 리로드됩니다.

```bash
npm run dev
```

---

## 📦 빌드 및 실행 파일 생성

이 프로젝트는 `electron-builder`를 사용하여 macOS, Windows, Linux용 실행 파일을 생성합니다. 모든 빌드 설정은 `electron-builder.yml` 파일에 정의되어 있습니다.

### **빌드 명령어**

각 운영체제에 맞는 빌드 명령어는 다음과 같습니다.

- **macOS (.dmg):**

  ```bash
  npm run build -- --mac
  ```

- **Windows (.exe):**

  ```bash
  npm run build -- --win
  ```

- **Linux (.AppImage, .deb):**
  ```bash
  npm run build -- --linux
  ```

빌드가 성공적으로 완료되면, 프로젝트 루트의 `dist/` 디렉토리에서 각 운영체제에 맞는 설치 파일을 찾을 수 있습니다.

---

### 🏗️ 빌드 설정 (`electron-builder.yml`)

`electron-builder.yml` 파일은 애플리케이션 빌드에 필요한 모든 설정을 정의합니다. 주요 설정 항목은 다음과 같습니다.

- **`appId`**: 애플리케이션의 고유 식별자입니다. (예: `com.Queryus.QGenie`)
- **`productName`**: 설치 파일 및 애플리케이션 이름으로 사용됩니다.
- **`directories`**:
  - `output`: 빌드 결과물(설치 파일)이 생성될 디렉토리입니다. (기본값: `dist`)
  - `buildResources`: 아이콘 등 빌드에 필요한 리소스 파일이 위치한 디렉토리입니다. (기본값: `build`)
- **`files`**: 최종 패키지에 포함될 파일 및 디렉토리 목록입니다. `electron-vite`를 사용하므로, 컴파일된 결과물이 담긴 `out/**` 폴더를 포함합니다.
- **`asarUnpack`**: `asar` 아카이브에 압축하지 않고 그대로 둘 파일 패턴을 지정합니다. `resources/**`에 포함된 외부 실행 파일들이 여기에 해당됩니다.
- **`win`, `mac`, `linux`**: 각 운영체제별 세부 빌드 설정을 정의합니다. (아이콘, 타겟 포맷, 권한 등)
- **`publish`**: GitHub Release 자동 업데이트를 위한 설정입니다. `provider: github`로 설정되어 있습니다.

---

## ⚙️ CI/CD (자동화된 빌드 및 배포)

이 프로젝트는 GitHub Actions를 통해 실행 파일 빌드 및 GitHub Release 배포가 자동화되어 있습니다.

### **워크플로우 개요 (`.github/workflows/build_executables.yaml`)**

- **트리거:** GitHub에서 새로운 릴리즈(Release)가 `published` 상태가 될 때 워크플로우가 실행됩니다.
- **주요 작업:**
  1.  **빌드 (Build):** `macos-latest`와 `windows-latest` 환경에서 각각 앱을 빌드하여 `.dmg`와 `.exe` 파일을 생성합니다.
  2.  **릴리즈 (Release):** 빌드된 실행 파일들을 해당 릴리즈의 에셋(Asset)으로 업로드합니다.
  3.  **Homebrew 업데이트:** macOS용 `.dmg` 파일이 릴리즈되면, `Queryus/homebrew-qgenie` 저장소로 디스패치 이벤트를 보내 Homebrew Cask가 자동으로 업데이트되도록 합니다.
  4.  **알림:** 파이프라인의 시작, 성공, 실패 여부를 디스코드 웹훅을 통해 알립니다.

### **배포 절차**

1.  모든 기능 개발과 테스트가 완료된 코드를 `master` 브랜치에 병합(Merge)합니다.
2.  GitHub 레포지토리의 **Releases** 탭으로 이동하여 **"Draft a new release"** 버튼을 클릭합니다.
3.  **"Select tag"** 드롭다운에서 새로운 버전 태그(예: `v1.0.0`)를 생성합니다.
4.  ⭐**중요)** **Target** 드롭다운 메뉴에서 반드시 `master` 브랜치를 선택합니다.
5.  제목에 버전을 입력하고 릴리즈 노트를 작성합니다.
6.  🚨**주의)** **Publish release** 버튼을 클릭합니다.
    릴리즈 발행은 되돌릴 수 없습니다. 잘못된 릴리즈는 서비스에 직접적인 영향을 줄 수 있으니, 반드시 팀의 승인을 받고 신중하게 진행해 주십시오.
7.  릴리즈가 발행되면 GitHub Actions 워크플로우가 자동으로 실행되어 빌드와 배포를 진행합니다.
    완료된 경우 `Releases` 탭에서 실행 파일을 확인할 수 있습니다.
8.  만약 실패하였다면 인프라 담당자에게 문의해주세요.

---

## 📦 패키지 매니저로 설치하기

### 💻 Homebrew로 설치하기 (macOS)

macOS 사용자는 Homebrew를 사용하여 QGenie를 간편하게 설치하고 관리할 수 있습니다.

0. **사전 준비: Homebrew 설치**

```bash
# Homebrew가 설치되어 있지 않다면, 먼저 터미널을 열고 아래 명령어를 실행하여 Homebrew를 설치해주세요.
/bin/bash -c "$(curl -fsSL [https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh](https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh))"
```

1.  **Homebrew Tap 등록 (최초 1회):**

```bash
#Homebrew가 QGenie의 설치 정보를 찾을 수 있도록, 저희의 공식 리포지토리(Tap)를 등록해야 합니다. 이 과정은 PC 당 최초 한 번만 실행하면 됩니다.
brew tap queryus/qgenie
```

2.  **QGenie 설치:**

```bash
# Tap을 추가했다면, 이제 brew install 명령어로 QGenie를 설치할 수 있습니다.
brew install --cask qgenie

# 설치가 완료되면 macOS의 응용 프로그램(Applications) 폴더에 QGenie.app이 추가됩니다.
```

3.  **업데이트 및 삭제:**

```bash
# QGenie의 새로운 버전이 출시되면, 아래 명령어로 간단하게 최신 버전으로 업데이트할 수 있습니다.
brew upgrade --cask qgenie

# QGenie를 시스템에서 제거하려면 uninstall 명령어를 사용합니다.
# 앱만 간단히 삭제하기
brew uninstall --cask qgenie

# 관련 설정 파일까지 모두 깨끗하게 삭제하기
brew uninstall --cask --zap qgenie

# tap 제거
brew untap queryus/qgenie
```
