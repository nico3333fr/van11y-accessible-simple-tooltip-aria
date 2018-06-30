/*
 * ES2015 simple and accessible hide-show system (collapsible regions), using ARIA
 * Website: https://van11y.net/accessible-simple-tooltip/
 * License MIT: https://github.com/nico3333fr/van11y-accessible-hide-show-aria/blob/master/LICENSE
 */
(doc => {

    'use strict';

    const TOOLTIP_SIMPLE = 'js-simple-tooltip';
    const TOOLTIP_SIMPLE_CONTAINER = 'simpletooltip_container';
    const TOOLTIP_SIMPLE_RAW = 'simpletooltip';
    const TOOLTIP_SIMPLE_LABEL_ID = 'label_simpletooltip_';

    const TOOLTIP_DATA_TEXT = 'data-simpletooltip-text';
    const TOOLTIP_DATA_PREFIX_CLASS = 'data-simpletooltip-prefix-class';
    const TOOLTIP_DATA_CONTENT_ID = 'data-simpletooltip-content-id';

    const ATTR_DESCRIBEDBY = 'aria-describedby';
    const ATTR_HIDDEN = 'aria-hidden';

    const findById = id => doc.getElementById(id);

    const addClass = (el, className) => {
        if (el.classList) {
            el.classList.add(className); // IE 10+
        } else {
            el.className += ' ' + className; // IE 8+
        }
    }

    const hasClass = (el, className) => {
        if (el.classList) {
            return el.classList.contains(className); // IE 10+
        } else {
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className); // IE 8+ ?
        }
    }


    /**
     * Wrap a node inside a span tooltip container
     * @param  {Node} node
     * @param  {String} prefixClass prefix classname
     * @return {Node} the wrapper node
     */
    const wrapItem = (node, prefixClass) => {
        // Join classNames
        // filter(Boolean) -> remove undefined or empty string. prefixClass can be empty.
        // We do not want to create 'undefined-xxx' nor '-xxx' but xxx
        const className = [prefixClass, TOOLTIP_SIMPLE_CONTAINER].filter(Boolean).join('-');
        let wrapper = doc.createElement('SPAN');
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
    const createTooltip = config => {

        const id = TOOLTIP_SIMPLE_LABEL_ID + config.index;
        const className = [config.className, TOOLTIP_SIMPLE_RAW].filter(Boolean).join('-');

        let content = config.text;

        // If there is no content but an id we try to fetch dat content id
        if (!content && config.id) {
            const contentFromId = findById(config.id);

            if (contentFromId) {
                content = contentFromId.innerHTML;
            }
        }

        return `<span class="${className} ${TOOLTIP_SIMPLE}" id="${id}" role="tooltip" aria-hidden="true">${content}</span>`;
    };


    /** Find all tooltips inside a container
     * @param  {Node} node Default document
     * @return {Array}
     */
    const $listTooltip = (node = doc) => [].slice.call(node.querySelectorAll('.' + TOOLTIP_SIMPLE));

    /**
     * Build tooltips for a container
     * @param  {Node} node
     */
    const attach = (node, addListeners = true) => {

        $listTooltip(node)
            .forEach((tooltip_node) => {

                let iLisible = Math.random().toString(32).slice(2, 12);
                let tooltipText = tooltip_node.hasAttribute(TOOLTIP_DATA_TEXT) === true ? tooltip_node.getAttribute(TOOLTIP_DATA_TEXT) : '';
                let prefixClassName = tooltip_node.hasAttribute(TOOLTIP_DATA_PREFIX_CLASS) === true ? tooltip_node.getAttribute(TOOLTIP_DATA_PREFIX_CLASS) : '';
                let contentId = tooltip_node.hasAttribute(TOOLTIP_DATA_CONTENT_ID) === true ? tooltip_node.getAttribute(TOOLTIP_DATA_CONTENT_ID) : '';


                // Attach the tooltip position
                tooltip_node.setAttribute(ATTR_DESCRIBEDBY, TOOLTIP_SIMPLE_LABEL_ID + iLisible);

                wrapItem(tooltip_node, prefixClassName)
                    .insertAdjacentHTML('beforeEnd', createTooltip({
                        text: tooltipText,
                        index: iLisible,
                        className: prefixClassName,
                        id: contentId
                    }));

            });

        if (addListeners) {
            /* listeners */
            ['mouseenter', 'focus', 'mouseleave', 'blur', 'keydown']
            .forEach(eventName => {

                doc.body
                    .addEventListener(eventName, e => {

                        if (hasClass(e.target, TOOLTIP_SIMPLE) === true) {
                            let tooltipLauncher = e.target;
                            // display
                            if (eventName === 'mouseenter' || eventName === 'focus') {
                                let item = findById(tooltipLauncher.getAttribute(ATTR_DESCRIBEDBY));
                                if (item) {
                                    item.setAttribute(ATTR_HIDDEN, 'false');
                                }
                            }

                            // hide
                            if (eventName === 'mouseleave' || eventName === 'blur' || (eventName === 'keydown' && e.keyCode === 27)) {
                                let item = findById(tooltipLauncher.getAttribute(ATTR_DESCRIBEDBY));
                                if (item) {
                                    item.setAttribute(ATTR_HIDDEN, 'true');
                                }
                            }
                        }


                    }, true);
            });
        }
    };

    const onLoad = () => {
        attach();
        document.removeEventListener('DOMContentLoaded', onLoad);
    }

    document.addEventListener('DOMContentLoaded', onLoad);

    window.van11yAccessibleSimpleTooltipAria = attach;

})(document);
