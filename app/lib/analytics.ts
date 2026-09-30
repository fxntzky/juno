export type CommerceEventName = "view_home" | "select_product" | "add_to_cart" | "begin_checkout";

type CommerceEventPayloadValue = string | number | boolean | null | undefined;
export type CommerceEventPayload = Record<string, CommerceEventPayloadValue>;

export type CommerceEvent = {
  name: CommerceEventName;
  payload: CommerceEventPayload;
  timestampIso: string;
};

type WindowWithCommerceBuffer = Window & {
  __JUNO_ANALYTICS_EVENTS__?: CommerceEvent[];
};

export const emitCommerceEvent = (name: CommerceEventName, payload: CommerceEventPayload = {}): CommerceEvent => {
  const event: CommerceEvent = {
    name,
    payload,
    timestampIso: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    const bufferedWindow = window as WindowWithCommerceBuffer;
    bufferedWindow.__JUNO_ANALYTICS_EVENTS__ ??= [];
    bufferedWindow.__JUNO_ANALYTICS_EVENTS__.push(event);
  }

  return event;
};
