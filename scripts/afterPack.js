/* eslint-disable @typescript-eslint/no-require-imports */

const { execSync } = require('child_process')
const path = require('path')

exports.default = async function (context) {
  const { appOutDir, packager } = context
  const appName = packager.appInfo.productFilename

  // macOS 빌드일 경우에만 실행
  if (process.platform !== 'darwin') {
    return
  }

  console.log('--- afterPack hook: Resigning native binaries ---')

  // 서명할 실행 파일들의 경로를 지정합니다.
  const apiPath = path.join(appOutDir, `${appName}.app/Contents/Resources/resources/mac/qgenie-api`)
  const aiPath = path.join(appOutDir, `${appName}.app/Contents/Resources/resources/mac/qgenie-ai`)

  const binaries = [apiPath, aiPath]

  for (const binaryPath of binaries) {
    try {
      console.log(`Removing existing signature from: ${binaryPath}`)
      execSync(`codesign --remove-signature "${binaryPath}"`)
    } catch (error) {
      console.warn(`Could not remove signature from ${binaryPath}: ${error.message}`)
    }

    try {
      console.log(`Applying ad-hoc signature to: ${binaryPath}`)
      // 애드혹 서명을 적용합니다.
      execSync(`codesign --sign - "${binaryPath}"`)
      console.log(`Successfully signed: ${binaryPath}`)
    } catch (error) {
      console.error(`Failed to sign ${binaryPath}: ${error.message}`)
      throw error // 서명 실패 시 빌드를 중단
    }
  }

  console.log('--- Finished resigning native binaries ---')
}
