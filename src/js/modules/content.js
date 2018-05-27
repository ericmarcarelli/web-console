export default class ContentLibrary {
    /**
    * Get content from the content library.
    */
    get(item) {
        var ret = '';
        var $item = $('#content-library #content-' + item);

        if ($item.length) {
            ret = $item.html();
        }

        return ret;
    }
}
