// Import React
import React, {useState} from 'react';
import axios from 'axios';
import * as Print from 'expo-print';
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

import {
  launchCamera,
  launchImageLibraryAsync
} from 'expo-image-picker';


// Check you python hosting server I have gon mad for this one day
const url = 'http://192.168.0.103:5000/image-from-app'
const d_url = 'http://192.168.0.103:5000/download'

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
  const [file_link, setFileLink] = useState(null)
  const [allStudent,setAllStudent] = useState([])

  const arrayTOHtml = (largeAr) => {
    return largeAr.map(
      (si) => `<tr>
        <th scope="row">${si.index}</th>
        <td>${si.studentId}</td>
        <td>${si.studentName}</td>
        <td>${si.status}</td>
      </tr>`
    );
  };
  
const html = `
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous">
  </head>
  <body>
  <div class="container">
  <h1 class="text-primary text-center">Attendance Report</h1>
  <div class="w-75 mx-auto font-monospace" >
  <table class="table table-striped">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Id</th>
      <th scope="col">Name</th>
      <th scope="col">Status</th>
    </tr>
  </thead>
  <tbody>
   ${arrayTOHtml(allStudent)}
  </tbody>
</table>
 
  </div>
  <h4 class="text-success" > This report is genereated by srabon the kaga </h4>
  </body>
</html>
`;

 

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
        console.log(resp)
        alert('File Upload successful.')
      })
      
  }
// #################################################################
  const handleDownload = async ()=>
  { 
    
    const files = await JSON.parse(file_link)
    await setAllStudent(files)

    await Print.printAsync({
      html,
      printerUrl: selectedPrinter?.url, // iOS only
    });
    setFile({})
    setFileLink(null)
    setAllStudent([])
    

    // setFileLink(file_link);
    // file_link?.response_json.map(si=>console.log(si))

    // alert("fileDownloaded")
    // const urlDownload = `${d_url}/${file_link}`
    // await RNPrint.print({ filePath: urlDownload })
    // axios.get(urlDownload)
    //   .then(resp => {
    //     const file = new File([resp.data], {type: 'application/pdf'})
    //     // const obj = URL.createObjectURL();
    //     console.log(file)
    //   })
    //   .catch(err=>console.log(err.message))
  } 
  // ###################do no changes##########################################
 
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
          <TouchableOpacity onPress={handleDownload}>
            <Text style={styles.buttonStyle}>Save PDF</Text>
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
