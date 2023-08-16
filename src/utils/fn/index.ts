import { Buffer } from "buffer";

export function getMimeTypeFromDataURL(dataURL: string) {
  // Extract the MIME type from the data URL
  const mimeTypeRegex = /^data:(.+);base64,/;
  const matches = dataURL.match(mimeTypeRegex);

  if (matches && matches.length > 1) {
    return matches[1];
  }

  return null;
}

export const DataURLToFile = (dataURL: string, filename: string) => {
  const [_, base64] = dataURL.split(",");
  const buffer = Buffer.from(base64, "base64");
  const mimetype = getMimeTypeFromDataURL(dataURL);

  return new File([buffer], filename, {
    type: mimetype!,
    lastModified: Date.now(),
  });
};

export const isAsyncOrPromise = (
  func: ((...args: any[]) => void) | ((...args: any[]) => Promise<void>),
) => {
  return (
    func.constructor.name === "AsyncFunction" ||
    func.constructor.name === "Promise" ||
    Object.prototype.toString.call(func) === "[object Promise]"
  );
};

/**
 * Cleans up text input to remove all non-numeric characters
 * @param value
 */
export function cleanInput(value: string) {
  return (
    String(value)
      ?.replace(/[^0-9.]/g, "")
      .replace(/(\..*)\./g, "$1") || ""
  );
}
