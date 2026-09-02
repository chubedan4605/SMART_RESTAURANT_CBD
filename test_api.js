const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3006,
    path: '/api/v1/chat-room?limit=20&getCounter=true&getAll=false&onlyGroups=false&isOverdueSLA=true',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        // How to pass authentication? 
    }
};

const req = http.request(options, res => {
    let data = '';
    res.on('data', chunk => {
        data += chunk;
    });
    res.on('end', () => {
        console.log("Status:", res.statusCode);
        console.log("Body:", data.substring(0, 1000));
    });
});

req.on('error', error => {
    console.error(error);
});

req.end();
