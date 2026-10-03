function loadExternalScript(src, callback = null, async = true) {
    return new Promise((resolve, reject) => {
        // Create timestamp to prevent caching
        const timestamp = new Date().getTime();
        const separator = src.includes('?') ? '&' : '?';
        const noCacheUrl = `${src}${separator}_nocache=${timestamp}`;
        
        // Create script element
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = async;
        script.src = noCacheUrl;
        
        // Handle script load success
        script.onload = function() {
            if (callback && typeof callback === 'function') {
                callback();
            }
            resolve();
        };
        
        // Handle script load error
        script.onerror = function() {
            reject(new Error(`Failed to load script: ${src}`));
        };
        
        // Append script to head
        document.head.appendChild(script);
    });
}
// window.addEventListener('load', function() {
//     loadExternalScript('/js/iframecheck.js', function() {
//         console.log('Script loaded successfully!');
//     });
// });