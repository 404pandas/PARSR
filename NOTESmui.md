These notes were compiled as I built my application from the ground up. My hopes are that they will be beneficial to anyone needing extra clarification and a one-stop resource on building a MERN app utiliziing Material UI.

Note- At the time of compiling these notes, my app is using these version numbers-
  "@mui/material": "^5.10.1",
  "@fontsource/roboto": "^4.5.8",

Installation

Example pulled from docs:

```
npm install @mui/material @emotion/react @emotion/styled
```

Where it goes-
In the command line interface (Terminal/cmd.exe/bash/etc.) run on the client side of the app (PARSR/client for this project)

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
On file client/src/app.jsx

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
On file client/src/app.jsx

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
On file client/srcapp.jsx

What it does-
Calls ScopedCssBaseline component to reset styles across browsers and devices. ScopedCssBaseline must be imported at the top for this to work

Custom Styling

Import makeStyles on client/src/styles.js

```
import { makeStyles } from @material-ui/core/styles;
```

Use custom hook on App.jsx and add theme object to it

```
const useStyles = makeStyles((theme) => ({

}));
```

Use hook to pass styles out of it
before return statement on app.jsx-

```
const App = ( ) => {
const classes = useStyles();

return (
    <>
    <CssBaseline />
    <div>
        <container>
    </div>
    </>
)
```

Add className to div containing container

```
const App = ( ) => {
const classes = useStyles();

return (
    <>
    <CssBaseline />
    <AppBar position="relative">
    </AppBar>
    <main>
    <div className={classes.container}>
        <container>
    </div>
    </main>
    </>
)
```

Add container styling to makeStyles callback function

```
const useStyles = makeStyles((theme) => ({
    container: {
        backgroundColor: theme.palette.background.padding: theme.spacing(8, 0, 6)
    }
}));
```

add CSS styling to container


Add styling to client/src/styles.js

Components

Typography
Typography components are text components that present design and content as clearly and efficiently as possible
A typographic scale has a limited set of type sizes that work well together along with the layout grid
Note- Roboto, the default for development, is not automatically loaded by MUI. 

Example from docs:

```
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
/>
```

Where it goes-
On file client/public/index.html as a link in the <head> element

What it does-
Adds the Roboto font to the app

Example from docs:

```
npm install @fontsource/roboto
```

Where it goes-
In the command line interface (Terminal/cmd.exe/bash/etc.) run on the client side of the app

What it does-
Installs the Fontsource modules required to use the default Roboto font in the client directory

Example from docs:

```
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
```

Where it goes-
On file client/index.js (the entry point to the PARSR app)

What it does-
Imports the default typography configuration for MUI

Available variants from docs: h1, h2, h3, h4, h5, h6, subtitle1, subtitle 2, body1, body2, BUTTON TEXT, caption text, OVERLINE TEXT

Example from docs:

```
const app = () => {
return (
    <div>
    <Typography variant="h1">Hello, World!</Typography>
    </div>
);
}
```

Where it goes-
on file client/pages/landing.jsx

What it does-
Sets a typography component with the variant `h1` as its formatting that says, "Hello, World!"

AppBar

Card

CardActions

CardContent

CardMedia

Grid
<Grid container>
<Grid item>
<button></button>
</Grid>
</Grid>

Toolbar

Container
Contains things inside specific area of page

Customization
One-off
Reusable component
Global theme overrides
Global CSS override

Components vs Component APIs in the docs
Components-
examples, demos, and explanations for each component
Component APIs-
complete list of props, css roles, and classes for each component

Mapping over items in MUI

To repeat an element (like a pet card!) multiple times on a page, here are the steps:

Create an array of cards to the number needed

const cards = [1, 2, 3, 4, 5, 6, 8, 9]

inside the grid container-
<Grid container spacing={4}>
{cards.map((card) => (
    <Grid item key={card}>
    </Grid>
))}
</Grid>

This repeats component styling for cards in a map nine times

make responsive by using media queries

xs={12} fills up entire screen on one row for extra small devices
sm= {6} fills two in one row on small devices
md= {4} fills 3 cards per row on medium devices