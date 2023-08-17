// A mock function to mimic making an async request for data
import createApiRequest, {
  createConfig,
  RequestConfig,
} from "../../../utils/axios";

export function faceproofPassiveLivenessDetection(config: RequestConfig) {
  const _config = createConfig({
    ...config,
    isUnprotected: true,
    method: "POST",
    headers: {
      "x-image-type": "base64",
      "x-api-key": import.meta.env.VITE_FACEPROOF_API_KEY,
      "x-app-id": import.meta.env.VITE_FACEPROOF_APP_ID,
    },
    url: `${
      import.meta.env.VITE_FACEPROOF_URL
    }/basic/passive_liveness_detection`,
  });
  return createApiRequest(_config);
}

export function faceproofFaceAuth(config: RequestConfig) {
  const _config = createConfig({
    ...config,
    isUnprotected: true,
    method: "POST",
    headers: {
      "x-image-type": "base64",
      "x-api-key": import.meta.env.VITE_FACEPROOF_API_KEY,
      "x-app-id": import.meta.env.VITE_FACEPROOF_APP_ID,
    },
    url: `${import.meta.env.VITE_FACEPROOF_URL}/id/face_authentication`,
  });
  return createApiRequest(_config);
}

export function faceproofFaceComparison(config: RequestConfig) {
  const _config = createConfig({
    ...config,
    isUnprotected: true,
    method: "POST",
    headers: {
      "x-image-type": "base64",
      "x-api-key": import.meta.env.VITE_FACEPROOF_API_KEY,
      "x-app-id": import.meta.env.VITE_FACEPROOF_APP_ID,
    },
    url: `${import.meta.env.VITE_FACEPROOF_URL}/id/face_comparison`,
  });
  return createApiRequest(_config);
}
