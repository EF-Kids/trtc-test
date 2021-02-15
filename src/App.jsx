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
      const localStream = localMedia.getLocalStream();
      console.warn('localStream', localStream)
      video.current.srcObject = localStream;
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
      const remoteStream = trtcManager.getRemoteStream().mediaStream_;
      console.warn('remoteStream', remoteStream);
      video.current.srcObject = remoteStream;
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
