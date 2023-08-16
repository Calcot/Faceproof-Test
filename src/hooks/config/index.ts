import { create } from "zustand";
import { get, has, isFunction, isPlainObject, omit } from "lodash";
import { RequestInterface } from "../types";
import { produce } from "immer";
import { devtools } from "zustand/middleware";
import { notification } from "antd";
import { isAsyncOrPromise } from "../../utils/fn";

const resetters: (() => void)[] = [];

export type StateSetType<S> = (
  partial: Partial<S> | (<T>(state: T) => Partial<T> | T) | S,
  replace?: boolean | undefined,
) => void;

export type StoreActionType = <T>(
  set: StateSetType<T>,
) => (...args: any[]) => Promise<any> | any;

export const createStore =
  <Type extends Record<string, any>>(initialState: Type) =>
  (actions: Record<string, StoreActionType>) => {
    const keys = Object.keys(actions);

    const map = (set: StateSetType<Type>) => {
      return keys.reduce((accumulator: Record<string, any>, action: string) => {
        const fn: StoreActionType = get(actions, action as any);
        const callable: (...args: any[]) => Promise<void> | void = fn(set);

        if (isAsyncOrPromise(callable)) {
          accumulator[action] = async (...args: any[]) => {
            const request: RequestInterface | undefined = args.find(
              (arg) =>
                isPlainObject(arg) &&
                (has(arg, "onFinish") ||
                  has(arg, "onError") ||
                  has(arg, "key") ||
                  has(arg, "payload")),
            );

            if (request) {
              request.noErrorMessage = request.noErrorMessage ?? true;
            }
            const key: string = request?.uiKey ?? request?.key ?? `@@${action}`;
            try {
              set(
                produce((draftState: any) => {
                  draftState.loading[key] = true;
                }),
              );
              const response = await callable(...args);
              if (request && isFunction(request.onFinish)) {
                request.onFinish(response);
              }
              set(
                produce((draftState: any) => {
                  draftState.loading[key] = false;
                }),
              );
            } catch (e: any) {
              if (import.meta.env.NODE_ENV !== "production") {
                console.error(e);
              }
              if (request && isFunction(request.onError)) {
                request.onError(e.data);
              }

              if (
                request &&
                !request.noErrorMessage &&
                get(e, ["data", "message"])
              ) {
                showErrorMessage(
                  formatErrorMessage(get(e, ["data", "message"])),
                  key,
                );
              }

              if (request && get(e, ["data", "message"])) {
                set(
                  produce((draftState: any) => {
                    draftState.errors = Object.assign({}, draftState.errors);
                    draftState.errors[key] = formatErrorMessage(
                      get(e, ["data", "message"]),
                    );
                  }),
                );
              }
              set(
                produce((draftState: any) => {
                  draftState.loading[key] = false;
                }),
              );
            }
          };

          return accumulator;
        }

        accumulator[action] = callable;
        return accumulator;
      }, {});
    };

    const store = create(
      devtools((set) => ({
        ...(initialState ?? { loading: {} }),
        ...map(set),
      })),
    );
    resetters.push(() => {
      const currentState = omit(
        store.getState() ?? {},
        Object.keys(initialState),
      );
      store.setState(
        {
          ...currentState,
          loading: {},
          errors: {},
          ...initialState,
        },
        true,
      );
    });
    return store;
  };

function showErrorMessage(errMessage: string, _key: string) {
  notification.error({
    message: errMessage,
    // description: 'Your recipients has been sent an email',
    placement: "bottomLeft",
    duration: 8,
  });
}

function formatErrorMessage(errMessage: any) {
  if (Array.isArray(errMessage)) {
    return errMessage.join("\n");
  }

  return errMessage;
}

export const resetAllStores = () => {
  for (const resetter of resetters) {
    resetter();
  }
};
