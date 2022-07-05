// Import React
import React, {useState} from 'react';
import axios from 'axios';
// Import required components
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as IntentLauncher from "expo-intent-launcher";

import {
  launchCamera,
  launchImageLibraryAsync
} from 'expo-image-picker';


// Check you python hosting server I have gon mad for this one day
const url = 'http://192.168.0.101:5000/image-from-app'
const d_url = 'http://192.168.0.101:5000/download'

const sendFile = (data)=>{
  return new Promise((resolve, reject)=>{
    axios.post(url, data)
      .then(resp => resolve(resp.data))
      .catch(err=>{
        console.log(err)
        reject()
      })
  })
}

const App = () => {
  
  const [file, setFile] = useState({});
  const [file_link, setFileLink] = useState('')
 

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  // const captureImage = async (type) => {
  //   let options = {
  //     mediaType: type,
  //     maxWidth: 300,
  //     maxHeight: 550,
  //     quality: 1,
  //     videoQuality: 'low',
  //     durationLimit: 30, //Video max duration in seconds
  //     saveToPhotos: true,
  //   };
  //   let isCameraPermitted = await requestCameraPermission();
  //   let isStoragePermitted = await requestExternalWritePermission();
  //   if (isCameraPermitted && isStoragePermitted) {
  //     launchCamera(options, (response) => {
  //       console.log('Response = ', response);

  //       if (response.didCancel) {
  //         alert('User cancelled camera picker');
  //         return;
  //       } else if (response.errorCode == 'camera_unavailable') {
  //         alert('Camera not available on device');
  //         return;
  //       } else if (response.errorCode == 'permission') {
  //         alert('Permission not satisfied');
  //         return;
  //       } else if (response.errorCode == 'others') {
  //         alert(response.errorMessage);
  //         return;
  //       }
  //       console.log('base64 -> ', response.base64);
  //       console.log('uri -> ', response.uri);
  //       console.log('width -> ', response.width);
  //       console.log('height -> ', response.height);
  //       console.log('fileSize -> ', response.fileSize);
  //       console.log('type -> ', response.type);
  //       console.log('fileName -> ', response.fileName);
  //       setFilePath(response);
  //     });
  //   }
  // };

  const chooseFile = async (type) => {
    let options = {
      mediaType: type,
      quality: 1,
      base64:true
    };
    let image = await launchImageLibraryAsync(options)
    
    setFile(image)
    // await launchImageLibraryAsync(options, (response) => {
    //   console.log('Response = ', response);

      // if (response.didCancel) {
      //   alert('User cancelled camera picker');
      //   return;
      // } else if (response.errorCode == 'camera_unavailable') {
      //   alert('Camera not available on device');
      //   return;
      // } else if (response.errorCode == 'permission') {
      //   alert('Permission not satisfied');
      //   return;
      // } else if (response.errorCode == 'others') {
      //   alert(response.errorMessage);
      //   return;
      // }
      // console.log('base64 -> ', response.base64);
      // console.log('uri -> ', response.uri);
      // console.log('width -> ', response.width);
      // console.log('height -> ', response.height);
      // console.log('fileSize -> ', response.fileSize);
      // console.log('type -> ', response.type);
      // console.log('fileName -> ', response.fileName);
      // setFilePath(response);
    // });
  };

  const handleUploadFile = ()=>{
    sendFile(file)
      .then(resp => {
        setFileLink(resp)
        alert('File Upload successful.')
      })
      console.log(file_link);
  }

  const handleDownload = ()=>
  {
    axios.get(`${d_url}/${file_link}`)
    console.log(file_link);
      
  
  }

  // const handleDownload = async () => {
  //   const { status } = await MediaLibrary.requestPermissionsAsync();
  //   const filesDirectory = FileSystem.cacheDirectory + "ExampleFolder";
  //   //pdf doesnt work
  //   const fileSource =  axios.get(`${d_url}/${file_link}`)
  //   const fileName = file_link
  //   //image works
  //   // const fileSource = "https://irefindex.vib.be/wiki/images/a/a9/Example.jpg";
  //   // const fileName = "example.jpg";

  //   try {
  //     if (status === "granted") {
  //       const folder = await FileSystem.getInfoAsync(filesDirectory);

  //       if (!folder.exists) {
  //         await FileSystem.makeDirectoryAsync(filesDirectory);
  //       }
  //       const download = await FileSystem.downloadAsync(
  //         fileSource,
  //         `${filesDirectory}/${fileName}`
  //       );
  //       console.log("download", download);
  //       console.log(
  //         "passing this to create asset",
  //         `${filesDirectory}/${fileName}`
  //       );
  //       const asset = await MediaLibrary.createAssetAsync(
  //         `${filesDirectory}/${fileName}`
  //       );
  //       console.log("asset", asset);

  //       const fileInfo = await FileSystem.getInfoAsync(
  //         `${filesDirectory}/${fileName}`
  //       );
  //       console.log("fileInfo", fileInfo);

  //       if (Platform.OS === "android") {
  //         FileSystem.getContentUriAsync(fileInfo.uri).then((uri) => {
  //           IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
  //             data: uri,
  //             flags: 1,
  //           });
  //         });
  //       } else {
  //         console.log("ios");
  //       }
  //     }
  //   } catch (err) {
  //     console.log("FS Err: ", err);
  //   }
  // };

// const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
// if (!permissions.granted) {
//     return;
// }

// const base64Data = 'my base 64 data';

// try {
//     await StorageAccessFramework.createFileAsync(permissions.directoryUri, fileName, 'application/pdf')
//         .then(async(uri) => {
//             await FileSystem.writeAsStringAsync(uri, base64Data, { encoding: FileSystem.EncodingType.Base64 });
//         })
//         .catch((e) => {
//             console.log(e);
//         });
// } catch (e) {
//     throw new Error(e);
// }

    

  // async function handleDownload(){

  //   const callback = downloadProgress => {
  //     const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
  //     setDownloadProgress(progress * 100);
  //   };
    
  //   const downloadResumable = FileSystem.createDownloadResumable(
  //     axios.get(`${d_url}/${file_link}`),
  //     FileSystem.documentDirectory + `${file}`,
  //     {},
  //     callback
  //   );
    
  //   try {
  //     const { uri } = await downloadResumable.downloadAsync();
  //     console.log('Finished downloading to ', uri);
  //     setDocument(uri);
  //   } catch (e) {
  //     console.error(e);
  //   }
    
    
  // }

  return (
    <SafeAreaView style={{flex: 1}}>
      <Text style={styles.titleText}>
        Fras
      </Text>
      <View style={styles.container}>
      
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => chooseFile('photo')}>
          <Text style={styles.textStyle}>Choose Image</Text>
        </TouchableOpacity>
      
        <TouchableOpacity onPress={handleUploadFile}>
          <Text style={styles.buttonStyle}>Upload Now</Text>
        </TouchableOpacity>

        {file_link ?
          <TouchableOpacity onPress={()=>alert("file downloaded")}>
            <Text style={styles.buttonStyle}>Download PDF</Text>
          </TouchableOpacity> : null
        }
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  textStyle: {
    padding: 10,
    color: 'black',
    textAlign: 'center',
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 5,
    marginVertical: 10,
    width: 250,
  },
  imageStyle: {
    width: 200,
    height: 200,
    margin: 5,
  },
});
