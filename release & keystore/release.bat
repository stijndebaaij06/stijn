ECHO OFF
CLS
ECHO Please make sure the versioncode and version is updated in config.xml!
SET /P versionnum=Enter Version Number(x.x.x):
ECHO %versionnum%
SET filename=buurtmobielplanner_v%versionnum%.apk
echo %filename%
CD ../cordova
SET /P keystore=Enter Keystore pass:
CLS
CALL cordova build --release android
cd platforms/android/build/outputs/apk
CLS
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -storepass %keystore% -keystore buurtmobielplanner.keystore android-release-unsigned.apk buurtmobielplanner
CLS
zipalign -v 4 android-release-unsigned.apk %filename%
CLS
ECHO building done, dont forget to move built APK from platforms/android/build/outputs/apk to releases folder.
PAUSE
