class Window {
    constructor() {
        console.log('window');
    }
}

jQuery(document).ready(function() {
    new Window();
});
