require('jquery');
require('bootstrap');

import Window from './modules/window.js';
import ContentLibrary from './modules/content.js';

jQuery(document).ready(function() {
    let content = new ContentLibrary();

    new Window({
        'parentSelector' : '.desktop',
        'type' : 'terminal',
        'isMain' : 'true',
        'title' : window.opts.name,
        'commandPrefix' : 'visitor@' + window.opts.name + ':~$',
        'content' : content.get('motd')
    });
});
