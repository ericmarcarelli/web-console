var uuid = require("uuid");

export const ORDER_TOP = 9999;
export const ORDER_BACK = 1;

class Window {
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
    }

    /**
    * Build window element
    */
    buildElement() {
        var content = '<section class="window ' + this.opts.type + '" id="' + this.id + '">';
        content += this.opts.isMain ? '<h1 class="bar">' : '<h2 class="bar">';
        content += this.opts.title;
        content += this.opts.isMain ? '</h1>' : '</h2>';
        content += '<div class="content">';
        content += this.opts.content;
        content += '</div>';
        content += '</section>';

        $(this.opts.parentSelector).append(content);

        this.$elm = $('#' + this.id);

        if ($(window).width() >= this.$elm.width()) {
            let top = ($(window).height() - this.$elm.height()) / 2;
            let left = ($(window).width() - this.$elm.width()) / 2;
            this.$elm.css({
                top: top,
                left: left
            });
        }

        $(window).on('mousedown', (e) => {
            if ($(e.target).closest('#' + this.id).length) {
                this.$elm.css('z-index', ORDER_TOP);
            }
            else {
                this.$elm.css('z-index', ORDER_BACK);
            }
        });
    }

    /**
    * Window movement
    */
    setupWindowMovement() {
        this.$elm.find('.bar').on('mousedown', (e) => {
            this.dragging = true;
            this.$elm.addClass('dragging');
            this.mouseX = e.pageX - this.$elm.offset().left
            this.mouseY = e.pageY - this.$elm.offset().top
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
}

jQuery(document).ready(function() {
    new Window({
        'parentSelector' : '.desktop',
        'type' : 'terminal',
        'isMain' : 'true',
        'title' : 'webconsole',
        'content' : 'Here there <strong>be</strong> content.'
    });

    new Window({
        'parentSelector' : '.desktop',
        'type' : 'browser',
        'isMain' : 'false',
        'title' : 'content',
        'content' : 'Here there <strong>be</strong> content.'
    });
});
