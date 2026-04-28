/**
 * Types for the Zendesk App Framework (ZAF) Client
 */

export interface ZAFClient {
  get: (path: string) => Promise<any>;
  set: (path: string, value: any) => Promise<any>;
  invoke: (path: string, ...args: any[]) => Promise<any>;
  request: (options: any) => Promise<any>;
  on: (event: string, callback: Function) => void;
  metadata: () => Promise<any>;
  context: () => Promise<any>;
}

declare global {
  interface Window {
    ZAFClient?: {
      init: () => ZAFClient;
    };
  }
}

export function getZAFClient(): ZAFClient | null {
  if (typeof window !== "undefined" && window.ZAFClient) {
    return window.ZAFClient.init();
  }
  return null;
}
