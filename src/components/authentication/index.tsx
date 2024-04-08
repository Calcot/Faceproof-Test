import { Button, Col, Form, notification, Row, Tooltip } from "antd";
import { useEffect, useRef, useState } from "react";
import { CameraType } from "../camera/type";
import { isEmpty, startCase } from "lodash";
import { FaceProofForm } from "../faceproof-form";
import { useFaceproof } from "../../hooks/useFaceproof";
import { RequestInterface } from "../../hooks/types.ts";

// interface FaceproofAuthenticationProps {
//
// }
export const FaceProofAuthentication = () => {
  const KEY = "@@biometrics/faceproof";
  const [numberOfCameras, setNumberOfCameras] = useState<number>(0);
  const [image, setImage] = useState<string | null>(null);
  const [showImage, setShowImage] = useState<boolean>(false);
  const camera = useRef<CameraType>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [activeDeviceId, setActiveDeviceId] = useState<string | undefined>(
    undefined,
  );
  const [approveImage, setApproveImage] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [notificationAPI, notificationContext] = notification.useNotification();

  const {
    faceProofing,
    faceproofPassiveLivenessDetection,
    faceproofFaceComparison,
    faceproofFaceAuth,
  } = useFaceproof((state: any) => ({
    faceProofing: state.loading[`${KEY}/faceproof`],
    faceproofPassiveLivenessDetection: state.faceproofPassiveLivenessDetection,
    faceproofFaceAuth: state.faceproofFaceAuth,
    faceproofFaceComparison: state.faceproofFaceComparison,
  }));

  useEffect(() => {
    (async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((i) => i.kind == "videoinput");
      setDevices(videoDevices);
      setActiveDeviceId(videoDevices?.[0]?.deviceId);
    })();
  }, []);

  const onTakePhoto = () => {
    if (camera.current) {
      const photo = camera.current.takePhoto();

      const audio = new Audio("/audio/shutter.mp3");
      audio.volume = 0.3;
      audio.play();

      setImage(() => {
        setShowImage(true);
        return photo;
      });
    }
  };

  const onSwitchCamera = () => {
    if (camera.current) {
      camera.current.switchCamera();
    }
  };

  const onReset = () => {
    setApproveImage(false);
    setImage(null);
    form.resetFields();
    setShowImage(false);
  };

  const onFinish = (values: Record<string, any>) => {
    if (image) {
      const [_, base64String] = image.split(",");

      console.log(image);
      const formData = new FormData();
      formData.append("image", `${base64String}`);
       formData.append("bvn", `${values.bvn}`);

      const options: Partial<RequestInterface> = {
        key: `${KEY}/faceproof`,
        payload: {
          data: formData,
        },
        // params: { get_face: true },
        onFinish() {
          notificationAPI.success({
            message: startCase(values.type.split("_").join(" ")),
            duration: 5,
            placement: "bottomLeft",
          });
        },
        onError() {
          notificationAPI.error({
            message: "Something went wrong with faceproof, please try again",
            duration: 5,
            placement: "bottomLeft",
          });
        },
      };

      switch (values.type) {
        case "passive_liveness_detection":
          faceproofPassiveLivenessDetection(options);
          break;
        case "face_comparison":
          faceproofFaceAuth(options);
          break;
        case "face_authentication":
          faceproofFaceComparison(options);
          break;
      }
    }
  };

  return (
    <>
      {notificationContext}
      <section
        className={"flex flex-col gap-y-3 py-20"}
        style={{ height: "80vh", maxHeight: "100vh", width: "55vh" }}
      >
        <div className="flex item-center gap-x-4 w-full">
          {approveImage && (
            <Tooltip title={"Back"}>
              <Button
                className={
                  "!m-0 !px-0 flex items-center justify-center !py-[2.5px]"
                }
                shape={"circle"}
                // size={"small"}
                type={"text"}
                style={{ transform: "translateY(-8px)" }}
                onClick={onReset}
                icon={<i className="ri-arrow-left-line text-xl" />}
              />
            </Tooltip>
          )}
          <h1 className={"text-center w-full !my-0 !py-0 !leading-0"}>
            Faceproof Liveness Detection
          </h1>
        </div>
        <FaceProofForm
          image={image}
          activeDeviceId={activeDeviceId}
          showImage={showImage}
          approveImage={approveImage}
          devices={devices}
          setNumberOfCameras={setNumberOfCameras}
          setActiveDeviceId={setActiveDeviceId}
          camera={camera}
          form={form}
          onFinish={onFinish}
        />
        <div className="flex w-full items-center justify-center">
          {(!image || (!isEmpty(image) && !approveImage)) && (
            <Row
              gutter={[20, 20]}
              justify={"space-between"}
              className={"w-full"}
            >
              <Col span={6} className={"!pl-0"}>
                {!image && (
                  <Button
                    block
                    type={"default"}
                    disabled={numberOfCameras <= 1}
                    onClick={onSwitchCamera}
                    className={"m-0 flex items-center justify-center p-0"}
                    // loading={signingDocument}
                    icon={<i className="ri-camera-switch-line text-2xl" />}
                  />
                )}
                {!isEmpty(image) && (
                  <Button
                    block
                    type={"default"}
                    className={"m-0 flex items-center justify-center p-0"}
                    onClick={() => {
                      setImage(null);
                      setShowImage(false);
                    }}
                  >
                    Retake
                  </Button>
                )}
              </Col>
              <Col span={18} className={"!pr-0"}>
                {!isEmpty(image) && !approveImage && (
                  <Button
                    block
                    type={"primary"}
                    onClick={() => {
                      setApproveImage(true);
                    }}
                  >
                    Continue
                  </Button>
                )}
                {!image && !approveImage && (
                  <Button block type={"primary"} onClick={onTakePhoto}>
                    Capture
                  </Button>
                )}
              </Col>
            </Row>
          )}
          {!isEmpty(image) && approveImage && (
            <Button
              block
              type={"primary"}
              onClick={form.submit}
              loading={faceProofing}
              icon={<i className="ri-shield-keyhole-line"></i>}
            >
              Continue
            </Button>
          )}
        </div>
      </section>
    </>
  );
};
