var uuid = require("uuid");

import ContentLibrary from './content.js';

export const ORDER_TOP = 9999;
export const ORDER_BACK = 1;

export default class Window {
    /**
    * Create new window
    *
    * @param opts
    *         parentSelector
    *         type
    *         isMain
    *         title
    *         content
    */
    constructor(opts) {
        this.id = uuid.v4();
        this.opts = opts;
        this.mouseX = 0;
        this.mouseY = 0;
        this.$elm = null;
        this.dragging = false;

        this.buildElement();
        this.setupWindowMovement();

        if (this.opts.type == 'terminal') {
            this.handleCommands();
        }
    }

    /**
    * Build window element
    */
    buildElement() {
        var content = '<section class="window ' + this.opts.type + '" id="' + this.id + '">';
        content += '<i class="close"></i>';
        content += this.opts.isMain ? '<h1 class="bar">' : '<h2 class="bar">';
        content += this.opts.title;
        content += this.opts.isMain ? '</h1>' : '</h2>';
        content += '<div class="content-container">';
        content += '<div class="content">';
        content += this.opts.content;
        content += '</div>';
        if (this.opts.type == 'terminal') {
            content += '<div class="input"><span>' + this.opts.commandPrefix + '</span> ';
            content += '<input type="text" class="command-line" autofocus>';
            content += '</div>';
        }
        content += '</div>';
        content += '</section>';

        $(this.opts.parentSelector).append(content);

        this.$elm = $('#' + this.id);
        this.$elm.css('z-index', ORDER_TOP);

        // Initial window position
        if ($(window).width() >= this.$elm.width()) {
            let top = ($(window).height() - this.$elm.height()) / 2;
            let left = ($(window).width() - this.$elm.width()) / 2;
            this.$elm.css({
                top: top,
                left: left
            });
        }

        // Bring window to front and focus for command entry
        $(window).on('mousedown', (e) => {
            if ($(e.target).closest('#' + this.id).length) {
                this.$elm.css('z-index', ORDER_TOP);
            }
            else {
                this.$elm.css('z-index', ORDER_BACK);
            }
        });
        $(window).on('mouseup', (e) => {
            if ($(e.target).closest('#' + this.id).length) {
                if (this.opts.type == 'terminal') {
                    setTimeout(() => {
                        this.$elm.find('.command-line').get(0).focus();
                    }, 20);
                }
            }
        });

        // Close window. If this is the main window, stubbornly reopen it!
        this.$elm.find('.close').click((e) => {
            this.$elm.remove();
            if (this.opts.isMain) {
                setTimeout(() => {
                    new Window(this.opts);
                }, 1500);
            }
        });
    }

    /**
    * Window movement
    * Start dragging with mouse down on the top bar and reposition window
    * as the mouse moves. End dragging on mouseup.
    */
    setupWindowMovement() {
        this.$elm.find('.bar').on('mousedown', (e) => {
            this.dragging = true;
            this.$elm.addClass('dragging');
            this.mouseX = e.pageX - this.$elm.offset().left;
            this.mouseY = e.pageY - this.$elm.offset().top;
        });

        $(window).on('mouseup', (e) => {
            this.dragging = false;
            this.$elm.removeClass('dragging');
        })

        $(window).on('mousemove', (e) => {
            if (this.dragging) {
                this.$elm.css({
                    top: e.pageY - this.mouseY,
                    left: e.pageX - this.mouseX,
                })
            }
        })
    }

    /**
    * Add HTML content to the window. Scroll content div to the bottom if
    * in a terminal.
    * @param content
    */
    appendContent(content) {
        this.$elm.find('.content').append(content);
        if (this.opts.type == 'terminal') {
            this.$elm.find('.content-container').scrollTop(this.$elm.find('.content-container').prop('scrollHeight'));
        }
    }

    /**
    * Handle commands entered in terminal windows.
    */
    handleCommands() {
        this.$elm.find('.command-line').keypress((e) => {
            if (e.which == 13) {
                this.parseCommand();
            }
        });
    }

    /**
    * Parse commands entered in terminal windows.
    * This is separated from handleCommands so it can easily be called automatically.
    */
    parseCommand() {
        var cmd = $.trim($('<div/>').html(this.$elm.find('.command-line').val()).text());
        this.$elm.find('.command-line').val('');
        this.appendContent('<div><span>' + this.opts.commandPrefix + '</span> ' + cmd + '</div>');

        if (cmd.substr(0,2) == 'ls') {
            this.listContent();
        }
        else if (cmd.substr(0,4) == 'open') {
            this.openContent(cmd.substr(5, cmd.length - 4));
        }
        else if (cmd.substr(0,2) == 'rm') {
            this.appendContent('<div>' + cmd + ': Permission denied' + '</div>');
        }
        else if (cmd.substr(0,2) == 'cd') {
            this.appendContent('<div>' + cmd + ': No such file or directory.' + '</div>');
        }
        else if (cmd != '') {
            this.appendContent('<div>' + cmd + ': command not found' + '</div>');
        }
    }

    /**
    * List content and prepare automatic command submission on click.
    */
    listContent() {
        var links = [];

        var content = '<pre>';
        for (var item of window.opts.directory) {
            let linkId = uuid.v4();
            content += '<a href="#" id="' + linkId + '">' + item.filename + '</a>\t';
            links.push({
                'linkId' : linkId,
                'filename' : item.filename
            });
        }
        content += '</pre>';
        this.appendContent(content);

        for (var link of links) {
            (function(win, link) {
                $('#' + link.linkId).click((e) => {
                    e.preventDefault();
                    win.$elm.find('.command-line').val('open ' + link.filename);
                    win.parseCommand();
                });
            })(this, link);
        }
    }

    /**
    * Open content based on its type.
    */
    openContent(filename) {
        let content = new ContentLibrary();
        for (var item of window.opts.directory) {
            if (item.filename == filename) {
                if (item.type == 'browser') {
                    new Window({
                        'parentSelector' : '.desktop',
                        'type' : 'browser',
                        'isMain' : false,
                        'title' : item.title,
                        'content' : content.get(filename)
                    });
                }
                else if (item.type == 'show') {
                    this.appendContent(content.get(filename));
                }
                return;
            }
        }

        this.appendContent('<div>open ' + filename + ': No such file or directory.' + '</div>');
    }
}
