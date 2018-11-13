# 由于 link 模板不适合 ios 出包
# 所以改模板下的 android 工程已合并到 binary 模板
# 请用 binary 模板打包

# windows 平台一键打包 APK 脚本
# 提供给各位开发人员打 debug 测试包
# 默认不包括热更新
# 如需要热更测试请把 87、88行的 # 去掉

#	打包环境:
#		nodejs:
#			version: v8.9.4
#		ndk:
#			version: android-ndk-r10e
#			path: D:\android-ndk-r10e
#		sdk:
#			path: D:\Android-SDK
#		ant:
#			version: apache-ant-1.10.1
#			path: D:\apache-ant-1.10.1
#		gradle:
#			version: gradle-4.5.1
#			path: D:\gradle-4.5.1
#		CocosCreator:
#			version: 1.9
#			path: D:\CocosCreator
#		maindev:
#			path: E:\p2\maindev-client-debug
#	
#	安装 nodejs 依赖库 shelljs:
#		npm install shelljs -g
#
#	检查以下文件里配置的路径是否符合本地项目实际路径
#		build/jsb-link/frameworks/runtime-src/proj.android-studio/app/build.gradle
#		build/jsb-link/frameworks/runtime-src/proj.android-studio/app/local.properties
#		build/jsb-link/frameworks/runtime-src/proj.android-studio/app/project.properties
#		build/jsb-link/frameworks/runtime-src/proj.android-studio/build-cfg.json
#		build/jsb-link/frameworks/runtime-src/proj.android-studio/gradle.properties
#		build/jsb-link/frameworks/runtime-src/proj.android-studio/local.properties
#		build/jsb-link/frameworks/runtime-src/proj.android-studio/settings.gradle
#		build/jsb-link/frameworks/runtime-src/proj.android/ant.properties
#
#	运行 node build-for-win.js 语句执行一键打包脚本, APK 将生成在当前目录

curdate=`DATE +%Y%m%d%H%M%p`
rm -rf ../build/jsb-binary/'js backups (useful for debugging)'
rm -rf ../build/jsb-binary/res
rm -rf ../build/jsb-binary/src
rm -rf ../build/newversion
rm ../build/jsb-binary/main.js
rm ../build/jsb-binary/project.json
rm ../build/jsb-binary/md5dic.json
rm ../build/jsb-binary/version.json
cp ../build/jsb-binary/frameworks/runtime-src/proj.android-studio/local.properties ./

debug="false"
inlineSpriteFrames="true"
packageName="com.bamingmajiangshijie.wmwb"
encryptJs="true"
xxteaKey="0fb239d5-a288-4f"
zipCompressJs="true"
useDebugKeystore="false"
keystorePath="bamingmajiangshijie.keystore"
keystorePassword="bamingmajiangshijie"
keystoreAlias="bamingmajiangshijie"
keystoreAliasPassword="bamingmajiangshijie"
apiLevel="android-19"
appABIs="['armeabi-v7a','x86']"
androidStudio="true"
template="binary"

/c/CocosCreator/CocosCreator.exe \
--path ../ --build \
"platform=android;\
debug=$debug;\
inlineSpriteFrames=$inlineSpriteFrames;\
packageName=$packageName;\
template=$template;\
useDebugKeystore=$useDebugKeystore;\
keystorePath=$keystorePath;\
keystorePassword=$keystorePassword;\
keystoreAlias=$keystoreAlias;\
keystoreAliasPassword=$keystoreAliasPassword;\
apiLevel=$apiLevel;\
appABIs=$appABIs;\
androidStudio=$androidStudio;\
encryptJs=$encryptJs;\
zipCompressJs=$zipCompressJs"

cp ./local.properties ../build/jsb-binary/frameworks/runtime-src/proj.android-studio/
cp ./bamingmajiangshijie.keystore ../build/jsb-binary/frameworks/runtime-src/proj.android-studio/app
node createmanifest.js
cp ../main.js ../build/jsb-binary/

