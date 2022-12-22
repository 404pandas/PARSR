These notes were compiled as I built my application from the ground up. My hopes are that they will be beneficial to anyone needing extra clarification and a one-stop resource on building a MERN app utiliziing Material UI.

Installation

Example pulled from docs:

npm install @mui/material @emotion/react @emotion/styled

Where it goes-
In the command line interface (Terminal/cmd.exe/bash/etc.) run on the root of the app (PARSR for this project)

What it does-
Installs the MUI modules required to use MUI components in the client directory

Importing MUI Components

Example pulled from docs:


```
import * as React from 'react';
import Button from '@mui/material/Button';

function App() {
  return <Button variant="contained">Hello World</Button>;
}
````

Where it goes-
On file client/app.js

What it does-
Renders a <Button> component in the App() function
Component is specified by <button> but could be any component listed in the MUI docs
Variant, specified by `variant="contained"`, could be any variant listed in the MUI docs
String, specified by `Hello World`, indicates the text to be used for the button.
The variant, router, and class required for each MUI component differs between component types. Check the MUI Docs for details on what to include on the component.

Globals
"Since Material UI components are built to function in isolation, they don't require any kind of globally scoped styles. For a better user experience and developer experience, we recommend adding the following globals to your app."

Responsive meta tag

Proper rendering and zooming for all devices uses a responsive viewport meta tag

Example pulled from docs:

```
<meta name="viewport" content="initial-scale=1, width=device-width" />
```

Where it goes-
On file client/public/index.html in the meta tag of the <head> element

What it does-
Sets the initial scale of the app to 1 and the width of the app as the device width

CssBaseline component

This component fixes inconsistencies across browsers and devices while providing resets more tailored for Material UI. Use this as a replacement for reset.css

Example pulled from docs:

```
export default function MyApp() {
  return (
    <React.Fragment>
      <CssBaseline />
      {/* The rest of your application */}
    </React.Fragment>
  );
}
```

Where it goes-
On file client/app.js

What it does-
Calls CssBaseline component to reset styles across browsers and devices. CssBaseline must be imported at the top for this to work

ScopedCssBaseline

This component applies the reset to only the children. Use this if progressively migrating a website to MUI and cannot scope globally for the reset

Example from docs:

```
export default function MyApp() {
  return (
    <ScopedCssBaseline>
      {/* The rest of your application */}
      <MyApp />
    </ScopedCssBaseline>
  );
}
```

Where it goes-
On file client/app.js

What it does-
Calls ScopedCssBaseline component to reset styles across browsers and devices. ScopedCssBaseline must be imported at the top for this to work
