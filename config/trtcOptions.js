const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') })
const TLSSigAPIv2 = require('./TLSSigAPIv2');

const seed = Math.random().toString(36).substr(2, 7).padEnd(7, '0');
const appId = process.env.TRTC_APP_ID;
const sdkSecretKey = process.env.TRTC_SECRET_KEY;
const userId = `${seed}_userId_mike`;
const streamId = `${seed}_streamId_mike_stream`;
const userDefineRecordId = `${seed}_userDefineRecordId_mike_record`;
const roomId = `${seed}_roomId_mike_room`;
const expire = 7 * 24 * 60 * 60;
const api = new TLSSigAPIv2.Api(appId, sdkSecretKey);
const userSig = api.genUserSig(userId, expire);
// https://cloud.tencent.com/document/product/647/32240#.E9.AB.98.E7.BA.A7.E6.9D.83.E9.99.90.E6.8E.A7.E5.88.B6.E7.9A.84.E5.8E.9F.E7.90.86
const privilegeMap = 255;
const privateMapKey = api.genPrivateMapKeyWithStringRoomID(userId, expire, roomId, privilegeMap);

const trtcOptions = Object.assign({
  appId,
  sdkSecretKey,
  seed,
  userId,
  streamId,
  userDefineRecordId,
  roomId,
  expire,
  userSig,
  privateMapKey
}, {
  local: {
    "appId": 1,
    "roomId": "",
    "userId": "",
    "userSig": "",
    "privateMapKey": "",
    "userDefineRecordId": "",
    "streamId": "",
    "videoOptions": {
      "width": 320,
      "height": 240,
      "framerate": 15,
      "bitrate": 400
    }
  },
  remote: {
    "appId": 1,
    "roomId": "",
    "userId": "",
    "userSig": "",
    "privateMapKey": "",
    "userDefineRecordId": "",
    "streamId": "",
    "videoOptions": {
      "width": 320,
      "height": 240,
      "framerate": 15,
      "bitrate": 400
    }
  }
});

module.exports = trtcOptions;
