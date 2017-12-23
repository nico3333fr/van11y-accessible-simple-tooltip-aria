# Van11y ES2015 accessible simple tooltip, using ARIA

<img src="https://van11y.net/layout/images/logo-van11y.svg" alt="Van11y" width="300" />

This script will provide an accessible simple tooltip system, using ARIA.

The demo is here: https://van11y.net/downloads/simple-tooltip/demo/index.html

Website is here: https://van11y.net/accessible-simple-tooltip/

La page existe aussi en français : https://van11y.net/fr/infobulles-tooltips-accessibles/

## How it works

__First round__

Basically, the script wraps each ```class="js-simple-tooltip"``` into a ```span class="<your-prefix-class>-container"``` and adds the content into a hidden content next to it. Once you focus or hover the element with ```class="js-simple-tooltip"```, it is displayed.

You can use it on the tag you want (input, button, a…).

__Then a bit of styling classes__

Then it will generate some classes for you, to allow styling your tooltips as you want.

__ARIA is coming__

Thanks to ```aria-describedby``` and ```ids``` generated on the fly, you never loose any information.

__And JavaScript does the rest__

Some listeners for keyboard and mouse interactions are added, when you activate one, it will updates attributes and manage keyboard, you can close it using Esc.

## How to use it

__Download the script__

You may also use npm command: ```npm i van11y-accessible-simple-tooltip-aria```.

You may also use bower: ```bower install van11y-accessible-simple-tooltip-aria```.

__Attributes__

Use ```data-simpletooltip-text``` or ```data-simpletooltip-content-id``` attributes on an element to activate the tooltip.

- Simply put ```class="js-simpletooltip"``` on a button to activate the script.
- Attribute ```data-simpletooltip-prefix-class``` (non mandatory): the prefix to all style classes of the tooltip (useful to set up different styles).
- Attribute ```data-simpletooltip-text```: the text of your tooltip.
- Attribute ```data-simpletooltip-content-id```: the id of (hidden) content in your page that will be put into your tooltip.

The script is launched when the page is loaded. If you need to execute it on AJAX-inserted content, you may use for example on `<div id="newContent">your tooltip launcher source</div>`:

```van11yAccessibleSimpleTooltipAria(document.getElementById('newContent'));```

__Examples__

Here are three examples:
```
<button class="js-simple-tooltip" data-simpletooltip-text="Cool, it works!">
  Hover or focus me to show the tooltip
</button>

<button class="js-simple-tooltip" data-simpletooltip-content-id="tooltip-case_1">
  Show me another tooltip
</button>
<div id="tooltip-case_1" class="hidden">
  Woot, you can take the content of a hidden block.
</div>

<button class="js-simple-tooltip" data-simpletooltip-prefix-class="minimalist-left"
  data-simpletooltip-text="Yes, with data-simpletooltip-prefix-class, so easy">
 And another one?
</button>
```
These examples are taken from the [demo](https://van11y.net/downloads/simple-tooltip/demo/index.html).

## How to style it

These examples are taken from the [demo](https://van11y.net/downloads/simple-tooltip/demo/index.html).
```
/* Tooltip hidden by default */
.simpletooltip[aria-hidden="true"],
.minimalist-simpletooltip[aria-hidden="true"],
.minimalist-left-simpletooltip[aria-hidden="true"] {
  display: none;
}
/* position relative for containers */
.simpletooltip_container,
.minimalist-simpletooltip_container,
.minimalist-left-simpletooltip_container {
  position: relative;
}

/* tooltip styles */
.simpletooltip,
.minimalist-simpletooltip,
.minimalist-left-simpletooltip {
  position: absolute;
  z-index: 666;
  width: 10em;
  border-radius: .5em;
  background: rgba( 0, 0, 0, .9 );
  color: #eee;
  padding: .5em;
  text-align: left;
  line-height: 1.3;
}
.simpletooltip,
.minimalist-simpletooltip {
  right: auto;
  left: 100%;
  margin-left: .5em;
}
.minimalist-left-simpletooltip {
  right: 100%;
  left: auto;
  margin-right: .5em;
}
/* used pseudo-element to make arrows */
.simpletooltip::before,
.minimalist-simpletooltip::before,
.minimalist-left-simpletooltip::before {
  content: '';
  speak: none;
  position: absolute;
  z-index: 666;
  width: 10px;
  height: 10px;
  pointer-event: none;
}
.simpletooltip::before,
.minimalist-simpletooltip::before {
  top: .5em;
  left: -10px;
  margin-left: -10px;
  border: 10px solid transparent;
  border-right: 10px solid rgba( 0, 0, 0, .9 );
}
.minimalist-left-simpletooltip::before {
  top: .5em;
  right: -10px;
  margin-right: -10px;
  border: 10px solid transparent;
  border-left: 10px solid rgba( 0, 0, 0, .9 )
}

/* it can be easily adapted in media-queries for tablets/mobile */

/* for this example: mobile */
@media (max-width: 44.375em) {

  .simpletooltip,
  .minimalist-simpletooltip,
  .minimalist-left-simpletooltip  {
    top: 100%;
    left: 50%;
	right: 0;
    margin: 0;
	margin-top: .7em;
	margin-left: -5em;
  }
  .simpletooltip::before,
  .minimalist-simpletooltip::before,
  .minimalist-left-simpletooltip::before  {
    top: -10px;
	right: auto;
	left: 50%;
	margin-left: -5px;
    margin-top: -10px;
    border: 10px solid transparent;
    border-bottom: 10px solid rgba( 0, 0, 0, .9 );
  }

}
```

