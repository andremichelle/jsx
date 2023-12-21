# JSX Launchpad

This is intended to be an MVP for User Interfaces built using JSX. JSX's popularity largely stems from React. However,
in my view, React imposes too many restrictions on the code flow and demands an in-depth understanding of its inner
workings and timings.

JSX Launchpad offers essentially the same ability to integrate HTML and TypeScript. Yet, it avoids overly complex 'black
box' magic and gives you control over when rendering occurs.

## Magic Injects

However, there are four "magic pills" in **JSX Launchpad** that simplify
the development process. These are **not** confined to the scope of a component. You maintain full control over the DOM
and
its state at all times. These magic pills can be injected anywhere in your code, eliminating the need for 'useEffect'
or 'useState'.

### Inject.Ref

Allows getting a reference to a single dom element from any built tsx.

### Inject.TextValue

Allows to easily update text content in a single or multiple dom elements.

### Inject.ClassList

Allows to easily update classes in a single or multiple dom elements.

### Inject.Attributes

Allows to easily update an attribute in a single or multiple dom elements.

## Utils

### Hotspot

A hotspot is a utility component which content can be updated manually.

### Await

A Loader accepts a promise and updates to either a loading state or success or failure state.

### Example:

https://github.com/andremichelle/jsx/assets/6459974/4559c8db-4a15-471f-8a08-81aadd1ea419


https://github.com/andremichelle/jsx/blob/6da4336d4503428f689c5f66ec7c99693337d4c6/src/example-app.tsx#L1
