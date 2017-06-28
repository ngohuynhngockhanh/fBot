# angular-joystick
Joystick Directive for AngularJS. A fork of Scott Lobdell's joystick, initially for backbone (https://github.com/slobdell/joystick).

To see original demo go here: http://slobdell.github.io/joystick

### Getting Started
Download the package, and include the angular-joystick.min.js file in your page.

```bash
bower install angular-joystick --save
```

Or

```bash
npm install angular-joystick --save
```

Then add the angular-joystick module to your Angular App file, e.g.

```js
var app = angular.module('app', ["angular-joystick"]);
```

### Example
```html
<angular-joystick coords="coords" on-move="joystickMove()" />
```

### Description of attributes
| Attribute | Description | Required | Binding | Example  |
| :------------- |:-------------| :-----:| :-----:| :-----|
| coords | model to retreive current position (eg: {x: xVal, y: yVal}) | No | = | coords |
| on-move | external function to call when position moved | No | @ | joystickMove() |
