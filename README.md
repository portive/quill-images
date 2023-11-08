# Quill Image Uploader

## Features

- Upload using a toolbar button, drag &amp; drop or paste
- Drag to resize with min/max limits on resizing
- Preserve aspect ratio while resizing
- Automatic resizing on the server to deliver optimized image to browser (does not send the full uploaded image)
- High DPI image delivers the optimized image for each device while using the minimal amount of bandwidth to do it
- Available resize presets allows users to resize to recommended sizes. Resize using a max bound (e.g. 640x480) or by ratio (e.g. 50%).
- Resize width/height status bar. While the user is resizing the image, a handy status bar appears at the bottom of the image showing the exact width/height.
- Unobtrusive drag handle. As the user drags the image beneath a certain size (usually around 100px but is configurable) the drag handle moves outside the image so as not to obscure what the image looks like.
- Completely configurable look and feel with 36 configurable values including colors, sizes and rounding
- Instant upload feedback. When images are inserted, the image from the local file system is used to display a preview.
- Progress bar. Users know the state of their upload by looking at the toolbar.

## Usage

### HTML Page

Here's a bare bones HTML page containing a Quill editor which loads the script used to get Quill set up with images. The code takes care of wiring up the image button in the toolbar as well as drag and drop and paste support. It also handles all image resizing.

The method of importing the code works in Vite but every framework works a little differently so please adjust accordingly.

```html
<!-- Include stylesheet -->
<link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet" />

<!-- Create the editor container -->
<div id="editor" style="width: 720px; height: 480px">
  <p>Hello World!</p>
</div>

<!-- This imports code in main.js below. This works in Vite but may be different for you. -->
<script type="module" src="/src/main.js"></script>
```

### Quill + Image Uploader Code

#### JavaScript

This assumes usage of JavaScript through an imported `/src/main.js`. Get your Portive auth token from <https://portive.com>.

```javascript
import Quill from "quill";
import { registerImagePlus } from "./ImagePlusModule";

// must be called to register the module with Quill
registerImagePlus();

const imagePlusOptions = {
  portiveAuthToken: YOUR_PORTIVE_AUTH_TOKEN_GOES_HERE,
};

const quill = new Quill("#editor", {
  theme: "snow",
  modules: {
    imagePlus: imagePlusOptions,
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["link", "image"],
    ],
  },
});
```

#### TypeScript

If you're using TypeScript, you can get some type safety by importing the `ImagePlusOptions` type and using it for the options.

```typescript
import Quill from "quill";
import { registerImagePlus, ImagePlusOptions } from "./ImagePlusModule";

// must be called to register this module with Quill
registerImagePlus();

const imagePlusOptions: ImagePlusOptions = {
  portiveAuthToken: YOUR_PORTIE_AUTH_TOKEN_GOES_HERE,
};

const quill = new Quill("#editor", {
  theme: "snow",
  modules: {
    imagePlus: imagePlusOptions,
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["link", "image"],
    ],
  },
});
```

## Options Reference

These are the options you can pass to `modules.imagePlus` when instantiating the quill editor. For example:

```javascript
const quill = new Quill("#editor", {
  theme: "snow",
  modules: {
    imagePlus: {
      /* options here */
    },
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["link", "image"],
    ],
  },
});
```

### Image Size Options

#### `minWidth?: number = 50`

When resizing the image, the minimum width an image can be resized to in pixels. If the image is beneath the minimum width, the image cannot be resized.

By default this is 50px.

#### `maxWidth?: number = 480`

When resizing an image, the maximum width the image can be resized to in pixels.

By default this is 480px.

### Image Style Options

#### `imageBorderRadius?: number = 0`

The radius at the corner of the image that is displayed. This number can be increased to make the image appear rounder.

By default the image is square at 0px.

### Image Focus Options

Styling the image when it has the current focus after clicking on it.

#### `focusBorderWidth?: number = 4`

The width of the border when the image is focused.

By default the border is 4px.

#### `focusBorderColor: string = "black"`

The color of the border when the image is focused. It may be specified as any valid CSS color like `#0060c0` or `black` or `rgb(128,128,128)`.

The default is `black`.

### Label Styling Options

Styling of the label that displays the width/height at the bottom of the image while the image is being resized.

#### `labelColor: string = "white"`

Text color of the label.

#### `labelBackground: string = "black"`

Background color of the label.

#### `labelHeight: number = 20`

The height of the label in px.

#### `labelBorderRadius: number = 3`

The border radius of the label in px.

#### `labelBorderColor: string = "rgba(255, 255, 255, 0.25)"`

The color of the border around the label. The default is white with opacity. What this does is it lets the label itself (which is default black) be visible against a black background by adding a bit of transparent white to the border.

#### `labelBorderWidth: number = 1`

The width of the border around the label.

#### `labelFontFamily: string = "sans-serif"`

The font family used for the label.

#### `labelFontSize: number = 10`

The font size for the label.

#### `labelOffset: number = 4`

The offset of the label from the bottom edge of the image.

### Presets

#### `resizePresets: Array<number | string> = [160, 320, "1/2", "100%"]`

An array of values that specify a preset size for the image to resize to. The individual preset values can be:

- `number`: Specifies the width to resize the image to. Note that if the uploaded image is less than the width of the preset, this preset will be shown as disabled.

- `string` in a format like "1/2": When a string is in the format of a fraction, the image will be resized to that ratio.

- `string` in a format like "25%": When a string is in the format of a percentage, the image will be resized to that given percentage.

### Preset Styling Options

Styling of the image resize presets. The presets are a number of suggested preset sizes for images. See Resize Presets section for details on how to specify the presets themselves.

#### `presetColor: string = 'white'`

The color of the preset text.

#### `presetBackground: string = "#000"`

The color of the preset background.

#### `presetDisabledColor: string = "#aaa"`

The color of the preset text when the option is disabled.

This typically occurs if the resize preset is larger than the actual image size and therefore the image can't be resized to that size.

#### `presetDisabledBackground: string = "#333"`

The background color of the preset when the option is disabled.

This typically occurs if the resize preset is larger than the actual image size and therefore the image can't be resized to that size.

#### `presetFocusColor: string = "yellow"`

The color of the preset when the mouse hovers over it.

#### `presetFocusBackground: string = "black"`

The background color of the preset when the mouse hovers over it.

#### `presetHeight: number = 20`

The height of the preset in px.

#### `presetBorderRadius: number = 3`

The border radius of the preset in px.

#### `presetBorderColor: string = "rgba(255, 255, 255, 0.25)"`

The color of the border around the preset.

#### `presetBorderWidth: number = 1`

The width of the border around the preset.

#### `presetFontFamily: string = "sans-serif"`

The font family of the text in the preset.

#### `presetFontSize: number = 10`

The font size of the text in the preset.

#### `presetOffset: number = 2`

The offset of the preset from the top edge of the image.

### Resize Handle Options

These options style the resize handle and also specify when the small handle should be used.

As the image is resized, having the resize handle inside the image obscures the image. To improve the user experience, the handle is switched to a smaller handle that appears just outside the image.

#### `handleColor: string = "black"`

The color of the resize handle.

#### `smallHandleThreshold: { width: number, height: number } = { width: 100, height: 100 }`

If the image is less than the given width or height, the handler switches to the small handle. This ensures that the image is not obscured at small sizes. The handle is also moved outside of the image.

#### `bigHandleRadius: number = 8`

The border radius of the big handle.

#### `bigHandleWidth: number = 16`

The width of the big handle.

#### `bigHandleHeight: number = 48`

The height of the big handle.

#### `smallHandleRadius: number = 6`

The border radius of the small handle.

#### `smallHandleWidth: number = 16`

The width of the small handle.

#### `smallHandleHeight: number = 24`

The height of the small handle.

#### `smallHandleColor: string = "black"`

The color of the small handle.

#### `smallHandleOffset: number = 1`

The offset of the small handle from the right edge of the image.
