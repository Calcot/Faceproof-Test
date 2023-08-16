import { createStore } from "../config";
import { RequestInterface } from "../types";
import { produce } from "immer";
import {
  faceproofFaceAuth,
  faceproofFaceComparison,
  faceproofPassiveLivenessDetection,
} from "./api";

export interface PluginsState {
  faceproof: Record<string, { url: string; mimetype: string; id: string }>;
  loading: Record<string, boolean>;
}

const initialState: PluginsState = {
  loading: {},
  faceproof: {},
};
export const useFaceproof = createStore<PluginsState>(initialState)({
  faceproofPassiveLivenessDetection:
    (set) => async (request: RequestInterface) => {
      const key = request.key ?? "@@plugin/faceproof/pld";
      const response = await faceproofPassiveLivenessDetection({
        key,
        data: {
          ...request.payload.data,
          license_key: import.meta.env.VITE_FACEPROOF_API_KEY,
        },
      });

      set(
        produce((state: any) => {
          state.faceproof[key] = response;
        }),
      );
      return response;
    },
  faceproofFaceAuth: (set) => async (request: RequestInterface) => {
    const key = request.key ?? "@@plugin/faceproof/face-auth";
    const response = await faceproofFaceAuth({
      key,
      data: {
        ...request.payload.data,
        license_key: import.meta.env.VITE_FACEPROOF_API_KEY,
      },
    });

    set(
      produce((state: any) => {
        state.faceproof[key] = response;
      }),
    );
    return response;
  },
  faceproofFaceComparison: (set) => async (request: RequestInterface) => {
    const key = request.key ?? "@@plugin/faceproof/face-comparison";
    const response = await faceproofFaceComparison({
      key,
      data: {
        ...request.payload.data,
        license_key: import.meta.env.VITE_FACEPROOF_API_KEY,
      },
    });

    set(
      produce((state: any) => {
        state.faceproof[key] = response;
      }),
    );
    return response;
  },
});
