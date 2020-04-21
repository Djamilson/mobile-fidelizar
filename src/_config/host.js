import {Platform} from 'react-native';
import {NetworkInfo} from 'react-native-network-info';

// let url = '159.203.144.228';
let url = 'www.ofertadodia.palmas.br';

if (__DEV__) {
  // Get Local IP
  const ip = NetworkInfo.getIPAddress();

  url = Platform.OS === 'android' ? '10.0.2.2' : ip;
  require('react-devtools');
}

export default {
  LOCALHOST: '192.168.10.105',
  PORT: 3001,
  WEBHOST: url,
};
