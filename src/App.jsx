import React, { useEffect, useRef } from 'react';
import trtcManager from './trtcManager';
import localMedia from './media';
import styles from './App.module.less';

const LocalPod = (props) => {
  const { width, height } = props;

  let video = useRef(null);

  useEffect(() => {
    (async () => {
      const getUserMediaConfig = { audio: true, video: { width, height } };
      await localMedia.init(getUserMediaConfig);
      console.warn('localStream', localMedia.getLocalStream())
      video.current.srcObject = localMedia.getLocalStream();
    })();
  }, []);

  return (
    <div className={styles.LocalPod}>
      <video ref={video} width={width} height={height} autoPlay={true} />
    </div>
  );
};

const RemotePod = (props) => {
  const { width, height } = props;

  let video = useRef(null);

  useEffect(() => {
    (async () => {
      const getUserMediaConfig = { audio: true, video: { width, height } };
      await trtcManager.init(getUserMediaConfig);
      console.warn('remoteStream', trtcManager.getRemoteStream().mediaStream_);
      video.current.srcObject = trtcManager.getRemoteStream().mediaStream_;
    })();
  }, []);

  return (
    <div className={styles.RemotePod}>
      <video ref={video} width={width} height={height} autoPlay={true} />
    </div>
  )
};

const App = () => (
  <div className={styles.App}>
    <LocalPod width={320} height={240} />
    <RemotePod width={320} height={240} />
  </div>
);

export default App;
