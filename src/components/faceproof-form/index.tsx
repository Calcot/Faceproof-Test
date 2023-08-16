import { Camera } from "../camera";
import { Col, Form, FormInstance, Input, Row, Select } from "antd";
import { Dispatch, RefObject, SetStateAction } from "react";
import { CameraType } from "../camera/type";
import { cleanInput } from "../../utils/fn";

interface FaceproofFormProps {
  showImage: boolean;
  approveImage: boolean;
  activeDeviceId?: string;
  image?: string | null;
  devices: MediaDeviceInfo[];
  setNumberOfCameras: Dispatch<SetStateAction<number>>;
  setActiveDeviceId: Dispatch<SetStateAction<string | undefined>>;
  camera: RefObject<CameraType>;
  form: FormInstance;
  onFinish: (values: Record<string, any>) => void;
}
export const FaceProofForm = (props: FaceproofFormProps) => {
  const {
    onFinish,
    camera,
    image,
    showImage,
    approveImage,
    setActiveDeviceId,
    devices,
    setNumberOfCameras,
    activeDeviceId,
    form,
  } = props;
  return (
    <div className="flex h-full w-full flex-col justify-between gap-y-5 py-5">
      <div className={"h-[90%] w-full"}>
        {showImage && (
          // <div className={"relative h-full w-full"}>
          <div
            className={
              " h-full w-full cursor-none select-none bg-cover bg-center bg-no-repeat"
            }
            style={{
              backgroundColor: "black",
              backgroundImage: `url(${image})`,
            }}
          />
          // </div>
        )}
        {!showImage && (
          <Camera
            ref={camera}
            aspectRatio="cover"
            numberOfCamerasCallback={(i) => setNumberOfCameras(i)}
            videoSourceDeviceId={activeDeviceId}
            errorMessages={{
              noCameraAccessible:
                "No camera device accessible. Please connect your camera or try a different browser.",
              permissionDenied:
                "Permission denied. Please refresh and give camera permission.",
              switchCamera:
                "It is not possible to switch camera to different one because there is only one video device accessible.",
              canvas: "Canvas is not supported.",
            }}
            videoReadyCallback={() => {
              if (import.meta.env.NODE_ENV !== "production") {
                console.log("Video feed ready.");
              }
            }}
          />
        )}
        {!showImage && (
          <Row gutter={[20, 20]} className={"my-4"}>
            <Col md={24} lg={24} span={24}>
              <Select
                defaultValue={activeDeviceId}
                value={activeDeviceId}
                className={"w-full"}
                style={{ width: "100%" }}
                onChange={(value) => {
                  setActiveDeviceId(value);
                }}
              >
                {devices.map((d) => (
                  <Select.Option key={d.deviceId} value={d.deviceId}>
                    {d.label}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Row>
        )}
      </div>
      {showImage && approveImage && (
        <Form
          className={"w-full"}
          layout={"vertical"}
          requiredMark
          form={form}
          name={"faceproof-form"}
          onFinish={onFinish}
        >
          <Form.Item
            name={"bvn"}
            label={"BVN"}
            rules={[
              { required: true, message: "Please enter your BVN" },
              { max: 11, message: "BVN must be 11 characters" },
              { min: 11 },
            ]}
            normalize={(value) => cleanInput(value)}
          >
            <Input
              maxLength={11}
              placeholder={"Enter your BVN (Bank Verification Number)"}
            />
          </Form.Item>

          <Form.Item
            name={"type"}
            label={"Authentication Type"}
            rules={[
              {
                required: true,
                message: "Please select an authentication type",
              },
            ]}
          >
            <Select
              placeholder={"Select an authentication type"}
              options={[
                {
                  value: "passive_liveness_detection",
                  label: "Passive Liveness Detection",
                },
                { value: "face_comparison", label: "ID Face Comparison" },
                { value: "face_authentication", label: "Face Authentication" },
              ]}
            />
          </Form.Item>
        </Form>
      )}
    </div>
  );
};
