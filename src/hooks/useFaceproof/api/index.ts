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
    url: `${import.meta.env.VITE_FACEPROOF_URL}/passive_liveness_detection`,
  });
  return createApiRequest(_config);
}

export function faceproofFaceAuth(config: RequestConfig) {
  const _config = createConfig({
    ...config,
    isUnprotected: true,
    method: "POST",
    url: `${import.meta.env.VITE_FACEPROOF_URL}/face_authentication`,
  });
  return createApiRequest(_config);
}

export function faceproofFaceComparison(config: RequestConfig) {
  const _config = createConfig({
    ...config,
    isUnprotected: true,
    method: "POST",
    url: `${import.meta.env.VITE_FACEPROOF_URL}/face_comparison`,
  });
  return createApiRequest(_config);
}
