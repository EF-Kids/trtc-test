const createMedia = () => {
  let _stream = null;

  const getStream= () => _stream;

  const initStream = async (width, height) =>
    window.navigator.mediaDevices.getUserMedia({
      audio: true, video: { width, height },
    })
    .then((mediaStream) => {
      _stream = mediaStream;
      return mediaStream;
    })
    .catch((err) => {
      console.error(err);
      return null;
    });

  return {
    initStream,
    getStream,
  };
};

const media = createMedia();

export default media;
