export type RequestMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

export interface RequestInterface {
  // http request methods
  method: RequestMethod;
  // request url
  url: string;
  // identifier for uis updates
  key?: string;
  // alternate identifier for uis loaders
  uiKey?: string;
  // data sent to the server
  payload?: any;

  // function called after successful http request
  onFinish?: (<T>(data?: T | Array<T>) => void) | string;
  // function called if http request failed
  onError?: (<T>(data?: T | Array<T>) => void) | string;
  // url query params
  params?: any;
  // specify success message to display to user
  successMessage?: string;
  // specify error message to display to user
  errorMessage?: string;
  // to redirect on successful http request
  nextRoute?: string;
  // show if success message should be displayed or not
  noSuccessMessage?: boolean;
  // show if error message should be displayed or not
  noErrorMessage?: boolean;
  // Used to denote if request is to an external API
  isUnprotected?: boolean;

  useUtilityToken?: boolean;
}
