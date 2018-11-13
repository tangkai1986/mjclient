
curdate=`DATE +%Y%m%d%H%M%p`
git co @~2
git_version=`git log -1 --format="%h"`
git co -

rm -rf ../build/jsb-binary/'js backups (useful for debugging)'
rm -rf ../build/jsb-binary/res
rm -rf ../build/jsb-binary/src
rm -rf ../build/newversion
rm ../build/jsb-binary/main.js
rm ../build/jsb-binary/project.json
rm ../build/jsb-binary/md5dic.json
rm ../build/jsb-binary/version.json

debug="true"
inlineSpriteFrames="true"
packageName="com.bamingmajiangshijie.wmwb"
encryptJs="true"
xxteaKey="0fb239d5-a288-4f"
zipCompressJs="true"
useDebugKeystore="false"
keystorePath="/Volumes/Data/data/home/admin/project/maindev/bin/maindev-debug/build/jsb-binary/frameworks/runtime-src/proj.android-studio/wmdzwp.keystore"
keystorePassword="wmdzwp"
keystoreAlias="wmdzwp"
keystoreAliasPassword="wmdzwp"
apiLevel="android-19"
appABIs="['armeabi-v7a','x86']"
androidStudio="true"
template="binary"

/Applications/CocosCreator.app/Contents/MacOS/CocosCreator \
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

node createmanifest.js
cp ../main.js ../build/jsb-binary/
zip -r ../../maindev-share/maindev-all-debug/$curdate-$git_version-newversion.zip ../build/newversion

cd ../build/jsb-binary/frameworks/runtime-src/proj.android-studio/\
    && gradle assemblerelease
cd ../../../../../buildtools
iosProjName="hello_world-mobile"
cd ../build/jsb-binary/frameworks/runtime-src/proj.ios_mac/\
    && xcodebuild -target $iosProjName build\
    && cd build/Release-iphoneos\
    && xcrun \
        -sdk iphoneos PackageApplication \
        -v ./$iosProjName.app \
        -o `pwd`/$iosProjName.ipa
cd ../../../../../../../buildtools
cp ../build/jsb-binary/frameworks/runtime-src/proj.android-studio/app/build/outputs/apk/release/dzwp-release.apk \
    ../../maindev-share/maindev-all-debug/$curdate-$git_version-dzwp-debug.apk
cp ../build/jsb-binary/frameworks/runtime-src/proj.ios_mac/build/Release-iphoneos/hello_world-mobile.ipa \
    ../../maindev-share/maindev-all-debug/$curdate-$git_version-dzwp-debug.ipa

echo "操作完成 ..."
