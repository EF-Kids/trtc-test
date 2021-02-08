import TRTC from 'trtc-js-sdk';
import './lib-generate-test-usersig.min';

console.warn('trtcOptions', process.env.trtcOptions);

const {
  appId,
  sdkSecretKey,
  expire,
} = process.env.trtcOptions;

const {
  appId: sdkAppId,
  userId: localUserId,
  streamId: localStreamId,
  userDefineRecordId: localUserDefineRecordId,
  roomId,
  userSig: localUserSig,
  privateMapKey: localPrivateMapKey,
} = process.env.trtcOptions.local;

const {
  userId: remoteUserId,
  streamId: remoteStreamId,
  userDefineRecordId: remoteUserDefineRecordId,
  userSig: remoteUserSig,
  privateMapKey: remotePrivateMapKey,
} = process.env.trtcOptions.remote;

const createTrtcManager = () => {
  // https://github.com/tencentyun/TRTCSDK/blob/ffb1d5a/Web/TRTCSimpleDemo/js/debug/GenerateTestUserSig.js#L34
  // https://intl.cloud.tencent.com/document/product/647/35166
  let _generator = new window.LibGenerateTestUserSig(Number(appId), sdkSecretKey, expire);
  let _localClient = null;
  let _localStream = null;
  let _remoteClient = null;
  let _remoteStream = null;

  const getRemoteStream = () => _remoteStream;

  const _initRemoteClient = async () => {
    if (remoteStreamId.length > 64 || remoteUserDefineRecordId.length > 64) {
      console.warn('streamId / userDefineRecordId too long');
    }

    _remoteClient = TRTC.createClient({
      sdkAppId,
      userId: remoteUserId,
      userSig: remoteUserSig,
      mode: 'rtc',
      useStringRoomId: true,
      streamId: `r_${remoteStreamId.slice(0, 62)}`,
      userDefineRecordId: `r_${remoteUserDefineRecordId.slice(0, 62)}`,
    });
    _remoteClient.on('error', (err) => {
      console.warn('remote error', err, err.getCode());
    });
    _remoteClient.on('network-quality', (event) => {
      console.debug('remote network-quality', event.uplinkNetworkQuality, event.downlinkNetworkQuality);
    });
    _remoteClient.on('connection-state-changed', ({ prevState, state }) => {
      console.warn('remote connection-state-changed', prevState, state);
    });
    _remoteClient.on('stream-added', ({ stream }) => {
      console.warn('remote stream-added', stream.getId());
      _remoteClient.subscribe(stream);
    });
    _remoteClient.on('stream-updated', ({ stream }) => {
      console.warn('remote stream-updated', stream.getId());
    });
    _remoteClient.on('stream-removed', ({ stream }) => {
      console.warn('remote stream-removed', stream.getId());
    });
    _remoteClient.on('stream-subscribed', ({ stream }) => {
      console.warn('remote stream-subscribed', stream.getId());
      stream.play('remote_stream-' + stream.getId());
      _remoteStream = stream;
    });
    await _remoteClient.join({ roomId, privateMapKey: remotePrivateMapKey });
  };

  const _initLocalClient = async () => {
    if (localStreamId.length > 64 || localUserDefineRecordId.length > 64) {
      console.warn('streamId / userDefineRecordId too long');
    }
    _generator.genTestUserSig(localUserId);
    // https://trtc-1252463788.file.myqcloud.com/web/docs/TRTC.html#.createClient
    _localClient = TRTC.createClient({
      sdkAppId,
      userId: localUserId,
      userSig: localUserSig,
      mode: 'rtc',
      useStringRoomId: true,
      streamId: `l_${localStreamId.slice(0, 62)}`,
      userDefineRecordId: `l_${localUserDefineRecordId.slice(0, 62)}`,
    });
    _localClient.on('error', (err) => {
      console.warn('local error', err, err.getCode());
    });
    _localClient.on('network-quality', (event) => {
      console.debug('local network-quality', event.uplinkNetworkQuality, event.downlinkNetworkQuality);
    });
    _localClient.on('connection-state-changed', ({ prevState, state }) => {
      console.warn('local connection-state-changed', prevState, state);
    });
    await _localClient.join({ roomId, privateMapKey: localPrivateMapKey });
  };

  const poll = (cb, interval = 1000, times = 20) => new Promise((resolve, reject) => {
    let count = times;
    const _poll = () => {
      if (cb()) {
        return resolve();
      }
      if (count < 0) {
        return reject(Error(`Cannot poll within ${times} * ${interval}ms`));
      }
      count -= 1;
      setTimeout(_poll, interval);
    };
    _poll();
  });

  const _initLocalStream = async (getUserMediaConfig) => {
    // https://trtc-1252463788.file.myqcloud.com/web/docs/TRTC.html#.createStream
    const stream = await navigator.mediaDevices.getUserMedia(getUserMediaConfig);
    _localStream = TRTC.createStream({
      userId: localUserId,
      audio: undefined,
      video: undefined,
      screenAudio: false, // screenAudio must be false if audio is true
      audioSource: stream.getAudioTracks()[0],
      videoSource: stream.getVideoTracks()[0],
    });
    await _localStream.initialize();
    await _localClient.publish(_localStream);
  };

  const init = async (getUserMediaConfig) => {
    await _initRemoteClient();
    await _initLocalClient();
    await _initLocalStream(getUserMediaConfig);
    await poll(getRemoteStream).catch(console.error);
  };

  return {
    init,
    getRemoteStream,
  };
};

const trtcManager = createTrtcManager();

export default trtcManager;
