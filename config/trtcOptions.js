const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') })
const { Api } = require('./TrtcSigApi');

const appId = process.env.TRTC_APP_ID;
const sdkSecretKey = process.env.TRTC_SECRET_KEY;
if (!appId || !sdkSecretKey) {
  throw Error('Please check TRTC_APP_ID and TRTC_SECRET_KEY');
}
const date = new Date().toISOString().replace(/[^\d]/g, '').slice(0, 8); // length: 8
const rand = Math.random().toString(36).substr(2, 7).padEnd(7, '0'); // length: 7
const seed = `${date}${rand}`; // length: 15
const expire = 7 * 24 * 60 * 60;
// https://cloud.tencent.com/document/product/647/32240#.E9.AB.98.E7.BA.A7.E6.9D.83.E9.99.90.E6.8E.A7.E5.88.B6.E7.9A.84.E5.8E.9F.E7.90.86
const privilegeMap = 255;
const api = new Api(appId, sdkSecretKey);

const roomId = `${seed}_roomId_room`;
const localUserId = `${seed}_userId_local`;
const localUserSig = api.genUserSig(localUserId, expire);
const localStreamId = `${seed}_streamId_local`;
const localUserDefineRecordId = `${seed}_userDefineRecordId_local`;
const localPrivateMapKey = api.genPrivateMapKeyWithStringRoomID(localUserId, expire, roomId, privilegeMap);
const remoteUserId = `${seed}_userId_remote`;
const remoteUserSig = api.genUserSig(remoteUserId, expire);
const remoteStreamId = `${seed}_streamId_remote`;
const remoteUserDefineRecordId = `${seed}_userDefineRecordId_remote`;
const remotePrivateMapKey = api.genPrivateMapKeyWithStringRoomID(remoteUserId, expire, roomId, privilegeMap);

const trtcOptions = {
  appId,
  sdkSecretKey,
  expire,
  local: Object.assign({}, {
    appId,
    roomId,
    userId: localUserId,
    userSig: localUserSig,
    privateMapKey: localPrivateMapKey,
    userDefineRecordId: localUserDefineRecordId,
    streamId: localStreamId,
  }, {}),
  remote: Object.assign({}, {
    appId,
    roomId,
    userId: remoteUserId,
    userSig: remoteUserSig,
    privateMapKey: remotePrivateMapKey,
    userDefineRecordId: remoteUserDefineRecordId,
    streamId: remoteStreamId,
  }, {}),
};

module.exports = trtcOptions;
