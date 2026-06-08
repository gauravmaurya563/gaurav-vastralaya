const https = require('https');

https.get('https://loremflickr.com/400/600/sari,fashion?lock=1', (res) => {
    console.log('Status:', res.statusCode);
    console.log('Location:', res.headers.location);
}).on('error', (e) => {
    console.error(e);
});
