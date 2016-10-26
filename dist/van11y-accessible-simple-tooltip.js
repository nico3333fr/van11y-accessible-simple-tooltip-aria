/*
 * ES2015 simple and accessible hide-show system (collapsible regions), using ARIA
 * Website: https://van11y.net/accessible-hide-show/
 * License MIT: https://github.com/nico3333fr/van11y-accessible-hide-show-aria/blob/master/LICENSE
 */
'use strict';

;(function (doc) {

  'use strict';

  var TOOLTIP_SIMPLE = 'js-simple-tooltip';
  var TOOLTIP_SIMPLE_CONTAINER = 'simpletooltip_container';
  var TOOLTIP_SIMPLE_RAW = 'simpletooltip';
  var TOOLTIP_SIMPLE_LABEL_ID = 'label_simpletooltip_';

  var TOOLTIP_DATA_TEXT = 'data-simpletooltip-text';
  var TOOLTIP_DATA_PREFIX_CLASS = 'data-simpletooltip-prefix-class';
  var TOOLTIP_DATA_CONTENT_ID = 'data-simpletooltip-content-id';

  var ATTR_DESCRIBEDBY = 'aria-describedby';
  var ATTR_HIDDEN = 'aria-hidden';

  var findById = function findById(id) {
    return doc.getElementById(id);
  };

  var addClass = function addClass(el, className) {
    if (el.classList) {
      el.classList.add(className); // IE 10+
    } else {
        el.className += ' ' + className; // IE 8+
      }
  };

  var hasClass = function hasClass(el, className) {
    if (el.classList) {
      return el.classList.contains(className); // IE 10+
    } else {
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className); // IE 8+ ?
      }
  };

  /**
   * Wrap a node inside a span tooltip container
   * @param  {Node} node
   * @param  {String} prefixClass prefix classname
   * @return {Node} the wrapper node
   */
  var wrapItem = function wrapItem(node, prefixClass) {
    // Join classNames
    // filter(Boolean) -> remove undefined or empty string. prefixClass can be empty.
    // We do not want to create 'undefined-xxx' nor '-xxx' but xxx
    var className = [prefixClass, TOOLTIP_SIMPLE_CONTAINER].filter(Boolean).join('-');
    var wrapper = doc.createElement('SPAN');
    addClass(wrapper, className);
    node.parentNode.insertBefore(wrapper, node);
    wrapper.appendChild(node);
    return wrapper;
  };

  /**
   * Create the template for a tooltip
   * @param  {Object} config
   * @return {String}
   */
  var createTooltip = function createTooltip(config) {

    var id = TOOLTIP_SIMPLE_LABEL_ID + config.index;
    var className = [config.className, TOOLTIP_SIMPLE_RAW].filter(Boolean).join('-');

    var content = config.text;

    // If there is no content but an id we try to fetch dat content id
    if (!content && config.id) {
      var contentFromId = findById(config.id);

      if (contentFromId) {
        content = contentFromId.innerHTML;
      }
    }

    return '<span\n      class="' + className + ' ' + TOOLTIP_SIMPLE + '"\n      id="' + id + '"\n      role="tooltip"\n      aria-hidden="true">' + content + '</span>';
  };

  // Find all expand
  var $listTooltip = function $listTooltip() {
    return [].slice.call(doc.querySelectorAll('.' + TOOLTIP_SIMPLE));
  };

  var onLoad = function onLoad() {

    $listTooltip().forEach(function (node, index) {

      var iLisible = index + 1;
      var tooltipText = node.hasAttribute(TOOLTIP_DATA_TEXT) === true ? node.getAttribute(TOOLTIP_DATA_TEXT) : '';
      var prefixClassName = node.hasAttribute(TOOLTIP_DATA_PREFIX_CLASS) === true ? node.getAttribute(TOOLTIP_DATA_PREFIX_CLASS) : '';
      var contentId = node.hasAttribute(TOOLTIP_DATA_CONTENT_ID) === true ? node.getAttribute(TOOLTIP_DATA_CONTENT_ID) : '';

      // Attach the tooltip position
      node.setAttribute(ATTR_DESCRIBEDBY, TOOLTIP_SIMPLE_LABEL_ID + iLisible);

      wrapItem(node, prefixClassName).insertAdjacentHTML('beforeEnd', createTooltip({
        text: tooltipText,
        index: iLisible,
        className: prefixClassName,
        id: contentId
      }));
    });

    // Display/hide
    ['mouseenter', 'focus', 'mouseleave', 'blur', 'keydown'].forEach(function (eventName) {

      doc.body.addEventListener(eventName, function (e) {

        // display
        if (eventName === 'mouseenter' || eventName === 'focus') {
          if (hasClass(e.target, TOOLTIP_SIMPLE) === true) {
            var item = findById(e.target.getAttribute(ATTR_DESCRIBEDBY));
            item.setAttribute(ATTR_HIDDEN, 'false');
          }
        }

        // hide
        if (eventName === 'mouseleave' || eventName === 'blur' || eventName === 'keydown' && e.keyCode === 27) {
          if (hasClass(e.target, TOOLTIP_SIMPLE) === true) {
            var item = findById(e.target.getAttribute(ATTR_DESCRIBEDBY));
            item.setAttribute(ATTR_HIDDEN, 'true');
          }
        }
      }, true);
    });
    document.removeEventListener('DOMContentLoaded', onLoad);
  };

  document.addEventListener('DOMContentLoaded', onLoad);
})(document);