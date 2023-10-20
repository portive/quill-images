# @portive/quill-images

This is a complete image uploading and resizing solution for Quill that supports image uploading, image drag and drop, image resizing with image presets. Everything in this one package.

It features:

- Image uploads
  - Progress Bar
- Image resizing
  - Drag to resize images while preserving aspect ratio
  - Show image width/height with label while resizing
  - Supports optimized retina image delivery
  - Customizable image resize presets:
    - Fixed max width/height
    - Scaled width/height (e.g. 25%, 50%)
  - True server side image resizing when used with Portive's Rich Text Editor services
  - Delivers high resolution images to high DPI devices and smaller images to low DPI devices
- Style the interface the way you like

  - Rounded corners to images
  - Selection outline color
  - Selection outline width

- [x] Big drag handle
  - [x] Reposition handle when max
  - [x] Reposition handle when min
- [x] Small drag handle
  - [x] Reposition handle when max
  - [x] Reposition handle when min
- [x] Small handle support outside image
- [ ] Show proper drag cursor everywhere (can't use `style` attribute for this)
- [x] Show "selection" box after mouseup
- [x] Add presets for resizing
