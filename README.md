# Phone Ruler

A static, GitHub Pages-friendly prototype that turns a phone screen into a lengthwise ruler.

## Run Locally

Open `index.html` directly in a browser, or serve the folder:

```powershell
python -m http.server 4173
```

Then visit `http://localhost:4173`.

## How It Works

- Tap the phone settings control, then search by make or model.
- The ruler scale uses the selected phone display diagonal and pixel resolution to estimate physical screen height.
- The visible viewport is scaled against `screen.height`, so it can work in a browser tab and improves when the page is installed/fullscreen.
- Drag the zero marker with a finger to align the start point with an object edge.
- Toggle centimeters or inches.
- Use calibration when a browser or device reports unusual screen dimensions.

## GitHub Pages

This app has no build step. Publish the repository with GitHub Pages set to the root of the default branch.

## Limitations

Browsers generally do not expose an exact iPhone model. iOS detection usually identifies only "iPhone", so the model selector is still the reliable path. Android Chrome can sometimes expose a model through User-Agent Client Hints.
