/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Makes the Portive Auth Token available to the client.
   * It must begin with `VITE_` and is set in `.env.local`
   */
  readonly VITE_PORTIVE_AUTH_TOKEN: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
