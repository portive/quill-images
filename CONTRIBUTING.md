# Contributing

## Setup

To start working on `quill-images` you will need a Portive Auth Token.

- Sign up/in to https://www.portive.com/
- Create a new project
- Create an API key for the project (A quick start API may be created for you automatically which you can use)
- Click `AUTH_TOKEN_TOOL` and use it to generate an auth token. Set the expiry far into the future like maybe a year so you don't have to worry about.

In a production app, you can programmatically generate auth tokens as needed which have short expiry times; however, in development, this is not necessary.

Create a file in the root directory of this project named `.env.local` and add your token to it. It will be fairly long and contain 2 dots in it.

This `.env.local` file is in the `.gitignore` so will not be pushed to the public GitHub repo. It's safe to add your token here.

`.env.local`

```sh
VITE_PORTIVE_AUTH_TOKEN=yOuR.aUtH.ToKeNGoEsHeRe
```

## Useful Resources

### Similar NPM Libraries

These are some NPM libraries that contain some of the features in `quill-images` and are useful references.

- [Quill Resize Image](https://github.com/hunghg255/quill-resize-image/blob/master/src/ResizePlugin.ts)
  - [Demo](https://quill-resize-image.vercel.app/)
- [Quill Image Uploader](https://www.npmjs.com/package/quill-image-uploader)
- [Quill Image Drop and Paste](https://www.npmjs.com/package/quill-image-drop-and-paste)
