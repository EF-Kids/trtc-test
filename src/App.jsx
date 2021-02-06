import React, { useEffect, useRef } from 'react';
import media from './media';
import styles from './App.module.less';

console.error(process.env.TRTC_APP_ID);
console.error(process.env.TRTC_SECRET_KEY);

const LocalPod = (props) => {
  const { width, height } = props;

  let video = useRef(null);

  useEffect(() => {
    (async () => {
      await media.initStream(width, height);
      video.current.srcObject = media.getStream();
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
