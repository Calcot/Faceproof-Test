import {
  Dispatch,
  ForwardRefExoticComponent,
  RefAttributes,
  SetStateAction,
} from 'react';

export type FacingMode = 'user' | 'environment';
export type AspectRatio = 'cover' | number; // for example 16/9, 4/3, 1/1
export type Stream = MediaStream | null;
export type SetStream = Dispatch<SetStateAction<Stream>>;
export type SetNumberOfCameras = Dispatch<SetStateAction<number>>;
export type SetNotSupported = Dispatch<SetStateAction<boolean>>;
export type SetPermissionDenied = Dispatch<SetStateAction<boolean>>;
export interface CameraProps {
  facingMode?: FacingMode;
  aspectRatio?: AspectRatio;
  numberOfCamerasCallback?(numberOfCameras: number): void;
  videoSourceDeviceId?: string | undefined;
  errorMessages: {
    noCameraAccessible?: string;
    permissionDenied?: string;
    switchCamera?: string;
    canvas?: string;
  };
  videoReadyCallback?(): void;
}

export type CameraType = ForwardRefExoticComponent<
  CameraProps & RefAttributes<unknown>
> & {
  takePhoto(): string;
  switchCamera(): FacingMode;
  getNumberOfCameras(): number;
};
