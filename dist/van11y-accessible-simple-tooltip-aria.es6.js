/*
 * ES2015 simple and accessible hide-show system (collapsible regions), using ARIA
 * Website: https://van11y.net/accessible-hide-show/
 * License MIT: https://github.com/nico3333fr/van11y-accessible-hide-show-aria/blob/master/LICENSE
 */
/**
 * Factory for config management
 */
const loadConfig = () => {

    const CACHE = {};

    const set = (id, config) => {

        CACHE[id] = config;

    };
    const get = (id) => CACHE[id];
    const remove = (id) => CACHE[id];

    return {
        set,
        get,
        remove
    }
};

const DATA_HASH_ID = 'data-hashtooltip-id';

const pluginConfig = loadConfig();

/** Find an element based on an Id
 * @param  {String} id Id to find
 * @param  {String} hash hash id (not mandatory)
 * @return {Node} the element with the specified id
 */
const findById = (id, hash = '') => (hash !== '' ? document.querySelector(`#${id}[${DATA_HASH_ID}="${hash}"]`) : document.getElementById(id));

/** add a class to a node
 * @param  {Node} el node to attach class
 * @param  {String} className the class to add
 */
const addClass = (el, className) => {
    if (el.classList) {
        el.classList.add(className); // IE 10+
    } else {
        el.className += ' ' + className; // IE 8+
    }
}

/** check if node has specified class
 * @param  {Node} el node to check
 * @param  {String} className the class
 */
const hasClass = (el, className) => {
    if (el.classList) {
        return el.classList.contains(className); // IE 10+
    } else {
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className); // IE 8+ ?
    }
}

/** search if element is or is contained in another element with attribute data-hashtooltip-id
 * @param  {Node} el element (node)
 * @param  {String} hashId the class
 * @return {String} the value of attribute data-hashtooltip-id
 */
const searchParentHashId = (el, hashId) => {
    let found = false;

    let parentElement = el;
    while (parentElement.nodeType === 1 && parentElement && found === false) {

        if (parentElement.hasAttribute(hashId) === true) {
            found = true;
        } else {
            parentElement = parentElement.parentNode;
        }
    }
    if (found === true) {
        return parentElement.getAttribute(hashId);
    } else {
        return '';
    }
}


/**
 * Wrap a node inside a span tooltip container
 * @param  {Node} node
 * @param  {String} prefixClass prefix classname
 * @return {Node} the wrapper node
 */
const wrapItem = (node, prefixClass, containerClass, hashId) => {
    // Join classNames
    // filter(Boolean) -> remove undefined or empty string. prefixClass can be empty.
    // We do not want to create 'undefined-xxx' nor '-xxx' but xxx
    const className = [prefixClass, containerClass].filter(Boolean).join('-');
    let wrapper = document.createElement('SPAN');
    addClass(wrapper, className);
    wrapper.setAttribute(DATA_HASH_ID, hashId);
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

    let className = [config.className, config.tooltipSimpleRaw].filter(Boolean).join('-');
    let content = config.text;

    // If there is no content but an id we try to fetch dat content id
    if (!content && config.id) {
        const contentFromId = findById(config.id);

        if (contentFromId) {
            content = contentFromId.innerHTML;
        }
    }

    return `<span class="${className} ${config.jsClass}" id="${config.tooltipId}" ${config.roleTooltip} ${config.hiddenAttribute} ${config.hashIdAttribute}>${content}</span>`;
};


const plugin = (config = {}) => {

    const CONFIG = {
        TOOLTIP_SIMPLE: 'js-simple-tooltip',
        TOOLTIP_SIMPLE_CONTAINER: 'simpletooltip_container',
        TOOLTIP_SIMPLE_RAW: 'simpletooltip',
        TOOLTIP_SIMPLE_LABEL_ID: 'label_simpletooltip_',
        TOOLTIP_DATA_TEXT: 'data-simpletooltip-text',
        TOOLTIP_DATA_PREFIX_CLASS: 'data-simpletooltip-prefix-class',
        TOOLTIP_DATA_CONTENT_ID: 'data-simpletooltip-content-id',
        ATTR_DESCRIBEDBY: 'aria-describedby',
        ATTR_HIDDEN: 'aria-hidden',
        ATTR_ROLE: 'role',
        ROLE: 'tooltip',
        ...config
    };

    const HASH_ID = Math.random().toString(32).slice(2, 12);

    pluginConfig.set(HASH_ID, CONFIG);


    /** Find  all tooltips inside a container
     * @param  {Node} node Default document
     * @return {Array}
     */
    const $listTooltip = (node = document) => [].slice.call(node.querySelectorAll('.' + CONFIG.TOOLTIP_SIMPLE)); //[...node.querySelectorAll('.' + CONFIG.TOOLTIP_SIMPLE)]; // that does not work on IE when transpiled :-(

    /**
     * Build tooltips for a container
     * @param  {Node} node
     */
    const attach = (node) => {

        $listTooltip(node)
            .forEach((tooltip_node) => {

                tooltip_node.setAttribute(DATA_HASH_ID, HASH_ID);

                let iLisible = Math.random().toString(32).slice(2, 12);
                let tooltipText = tooltip_node.hasAttribute(CONFIG.TOOLTIP_DATA_TEXT) === true ? tooltip_node.getAttribute(CONFIG.TOOLTIP_DATA_TEXT) : '';
                let prefixClassName = tooltip_node.hasAttribute(CONFIG.TOOLTIP_DATA_PREFIX_CLASS) === true ? tooltip_node.getAttribute(CONFIG.TOOLTIP_DATA_PREFIX_CLASS) : '';
                let contentId = tooltip_node.hasAttribute(CONFIG.TOOLTIP_DATA_CONTENT_ID) === true ? tooltip_node.getAttribute(CONFIG.TOOLTIP_DATA_CONTENT_ID) : '';


                // Attach the tooltip position
                tooltip_node.setAttribute(CONFIG.ATTR_DESCRIBEDBY, CONFIG.TOOLTIP_SIMPLE_LABEL_ID + iLisible);

                wrapItem(tooltip_node, prefixClassName, CONFIG.TOOLTIP_SIMPLE_CONTAINER, HASH_ID)
                    .insertAdjacentHTML('beforeEnd', createTooltip({
                        text: tooltipText,
                        className: prefixClassName,
                        jsClass: CONFIG.TOOLTIP_SIMPLE,
                        id: contentId,
                        tooltipId: CONFIG.TOOLTIP_SIMPLE_LABEL_ID + iLisible,
                        tooltipSimpleRaw: CONFIG.TOOLTIP_SIMPLE_RAW,
                        hiddenAttribute: `${CONFIG.ATTR_HIDDEN}="true"`,
                        roleTooltip: `${CONFIG.ATTR_ROLE}="${CONFIG.ROLE}"`,
                        hashIdAttribute: `${DATA_HASH_ID}="${HASH_ID}"`
                    }));

            });




    };


    /*const destroy = (node) => {
        $listTooltip(node)
        .forEach((tooltip_node) => {

        });
    };*/


    return {
        attach
        /*,
        destroy*/
    }
};

const main = () => {

    /* listeners for all configs */
    ['mouseenter', 'focus', 'mouseleave', 'blur', 'keydown']
    .forEach(eventName => {

        document.body
            .addEventListener(eventName, e => {

                let hashId = searchParentHashId(e.target, DATA_HASH_ID); //e.target.dataset.hashId;
                // search if click on button or on element in a button contains data-hash-id (it is needed to load config and know which class to search)

                if (hashId !== '') {

                    // loading config from element
                    let CONFIG = pluginConfig.get(hashId);

                    // search if click on button or on element in a button (fix for Chrome)
                    //let id_tooltip_button = searchParent(e.target, CONFIG.TOOLTIP_SIMPLE, hashId);


                    // click on button
                    if (hasClass(e.target, CONFIG.TOOLTIP_SIMPLE) === true) {
                        //console.log('pweet ' + eventName + ' ' + hashId);
                        let tooltipLauncher = e.target;
                        // display
                        if (eventName === 'mouseenter' || eventName === 'focus') {
                            let item = findById(tooltipLauncher.getAttribute(CONFIG.ATTR_DESCRIBEDBY), hashId);
                            if (item) {
                                item.setAttribute(CONFIG.ATTR_HIDDEN, 'false');
                            }
                        }

                        // hide
                        if (eventName === 'mouseleave' || eventName === 'blur' || (eventName === 'keydown' && e.keyCode === 27)) {
                            let item = findById(tooltipLauncher.getAttribute(CONFIG.ATTR_DESCRIBEDBY), hashId);
                            if (item) {
                                item.setAttribute(CONFIG.ATTR_HIDDEN, 'true');
                            }
                        }
                    }

                }


            }, true);


    });

    return plugin;

};

window.van11yAccessibleSimpleTooltipAria = main();

const onLoad = () => {
    const tooltip_default = window.van11yAccessibleSimpleTooltipAria();
    tooltip_default.attach();

    document.removeEventListener('DOMContentLoaded', onLoad);
}

document.addEventListener('DOMContentLoaded', onLoad);
