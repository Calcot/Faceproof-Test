import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  CameraProps,
  FacingMode,
  SetNotSupported,
  SetNumberOfCameras,
  SetPermissionDenied,
  SetStream,
  Stream,
} from "./type";

const Camera = forwardRef<unknown, CameraProps>((props, ref) => {
  const {
    facingMode = "user",
    aspectRatio = "cover",
    numberOfCamerasCallback = () => null,
    videoSourceDeviceId = undefined,
    errorMessages = {
      noCameraAccessible:
        "No camera device accessible. Please connect your camera or try a different browser.",
      permissionDenied:
        "Permission denied. Please refresh and give camera permission.",
      switchCamera:
        "It is not possible to switch camera to different one because there is only one video device accessible.",
      canvas: "Canvas is not supported.",
    },
    videoReadyCallback = () => null,
  } = props;
  const player = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const [numberOfCameras, setNumberOfCameras] = useState<number>(0);
  const [stream, setStream] = useState<Stream>(null);
  const [currentFacingMode, setFacingMode] = useState<FacingMode>(facingMode);
  const [notSupported, setNotSupported] = useState<boolean>(false);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);

  useEffect(() => {
    numberOfCamerasCallback(numberOfCameras);
  }, [numberOfCameras]);

  const mirrored = currentFacingMode === "user";
  const takePhoto = () => {
    if (numberOfCameras < 1) {
      throw new Error(errorMessages.noCameraAccessible);
    }

    if (canvas?.current) {
      const playerWidth = player?.current?.videoWidth || 1280;
      const playerHeight = player?.current?.videoHeight || 720;
      const playerAR = playerWidth / playerHeight;

      const canvasWidth = container?.current?.offsetWidth || 1280;
      const canvasHeight = container?.current?.offsetHeight || 1280;
      const canvasAR = canvasWidth / canvasHeight;

      let sX, sY, sW, sH;

      if (playerAR > canvasAR) {
        sH = playerHeight;
        sW = playerHeight * canvasAR;
        sX = (playerWidth - sW) / 2;
        sY = 0;
      } else {
        sW = playerWidth;
        sH = playerWidth / canvasAR;
        sX = 0;
        sY = (playerHeight - sH) / 2;
      }

      canvas.current.width = sW;
      canvas.current.height = sH;

      const context = canvas.current.getContext("2d");
      if (context && player?.current) {
        if (mirrored) {
          context.translate(canvas.current.width, 0); // Move to the right edge
          context.scale(-1, 1); // Mirror horizontally
        }
        context.drawImage(player.current, sX, sY, sW, sH, 0, 0, sW, sH);
      }

      // canvas.current.

      // const fileSize =
      //   Buffer.from(canvas.current.toDataURL('image/jpeg'), 'base64')
      //     .byteLength / 1024;
      // if(fileSize > 1024 * 2) {

      // alert(fileSize);
      // }
      return canvas.current.toDataURL("image/jpeg");
    } else {
      throw new Error(errorMessages.canvas);
    }
  };

  const switchCamera = () => {
    if (numberOfCameras < 1) {
      throw new Error(errorMessages.noCameraAccessible);
    } else if (numberOfCameras < 2) {
      console.error(
        "Error: Unable to switch camera. Only one device is accessible.",
      ); // console only
    }
    const newFacingMode = currentFacingMode === "user" ? "environment" : "user";
    setFacingMode(newFacingMode);
    return newFacingMode;
  };

  useImperativeHandle(ref, () => ({
    takePhoto,
    switchCamera,
    getNumberOfCameras: () => {
      return numberOfCameras;
    },
  }));

  useEffect(() => {
    initCameraStream(
      stream,
      setStream,
      currentFacingMode,
      videoSourceDeviceId,
      setNumberOfCameras,
      setNotSupported,
      setPermissionDenied,
    );
  }, [currentFacingMode, videoSourceDeviceId]);

  useEffect(() => {
    if (stream && player && player.current) {
      player.current.srcObject = stream;
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [stream]);

  return (
    <div ref={container} className={"h-full w-full"} style={{ aspectRatio }}>
      <div className={"h-full w-full"}>
        {notSupported ? (
          <div
            className={
              "relative flex h-full w-full flex-col items-center justify-center gap-y-3"
            }
          >
            <video
              autoPlay
              playsInline
              loop
              muted
              disablePictureInPicture
              controls={false}
              className={"h-full w-full object-cover"}
              style={{ aspectRatio }}
              src={`${import.meta.url}/video/tv-static.mp4`}
            />
            <div
              className={
                "absolute flex h-full w-full items-center justify-center bg-[rgba(0,0,0,0.5)] p-6 text-center text-lg text-red-500"
              }
            >
              <span>{errorMessages.noCameraAccessible}</span>
            </div>
          </div>
        ) : null}
        {permissionDenied ? (
          <div
            className={
              "relative flex h-full w-full flex-col items-center justify-center gap-y-3"
            }
          >
            <video
              autoPlay
              playsInline
              muted
              loop
              disablePictureInPicture
              className={"h-full w-full"}
              controls={false}
              style={{ aspectRatio }}
              src={"/video/tv-static.mp4"}
            />
            <div
              className={
                "absolute h-full w-full bg-[rgba(0,0,0,0.5)] text-center text-lg text-red-500"
              }
            >
              <span> {errorMessages.permissionDenied}</span>
            </div>
          </div>
        ) : null}
        {!permissionDenied && !notSupported && (
          <>
            <video
              className={"h-full w-full bg-[rgba(0,0,0,1)] object-cover"}
              style={{ transform: `rotateY(${mirrored ? "180deg" : "0deg"})` }}
              ref={player}
              id="video"
              muted={true}
              autoPlay={true}
              playsInline={true}
              onLoadedData={() => {
                videoReadyCallback();
              }}
            />
            <canvas className={"sr-only"} ref={canvas} />
          </>
        )}
      </div>
    </div>
  );
});

Camera.displayName = "Camera";

const initCameraStream = async (
  stream: Stream,
  setStream: SetStream,
  currentFacingMode: FacingMode,
  videoSourceDeviceId: string | undefined,
  setNumberOfCameras: SetNumberOfCameras,
  setNotSupported: SetNotSupported,
  setPermissionDenied: SetPermissionDenied,
) => {
  // stop any active streams in the window
  if (stream) {
    stream.getTracks().forEach((track) => {
      track.stop();
    });
  }

  const constraints = {
    audio: false,
    video: {
      deviceId: videoSourceDeviceId
        ? { exact: videoSourceDeviceId }
        : undefined,
      facingMode: currentFacingMode,
      width: { ideal: 1920 },
      height: { ideal: 1920 },
    },
  };

  if (navigator?.mediaDevices?.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        setStream(handleSuccess(stream, setNumberOfCameras));
      })
      .catch((err) => {
        handleError(err, setNotSupported, setPermissionDenied);
      });
  } else {
    if (navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(handleSuccess(stream, setNumberOfCameras));
      } catch (err) {
        handleError(err as Error, setNotSupported, setPermissionDenied);
      }
    } else {
      setNotSupported(true);
    }
  }
};

const handleSuccess = (
  stream: MediaStream,
  setNumberOfCameras: SetNumberOfCameras,
) => {
  navigator.mediaDevices
    .enumerateDevices()
    .then((r) =>
      setNumberOfCameras(r.filter((i) => i.kind === "videoinput").length),
    );

  return stream;
};

const handleError = (
  error: Error,
  setNotSupported: SetNotSupported,
  setPermissionDenied: SetPermissionDenied,
) => {
  console.error(error);

  //https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
  if (error.name === "PermissionDeniedError") {
    setPermissionDenied(true);
  } else {
    setNotSupported(true);
  }
};

export { Camera };
