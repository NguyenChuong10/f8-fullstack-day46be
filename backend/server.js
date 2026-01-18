const http = require('node:http');

let uniId = 3;
const db = {
    tasks:[
            {
                id : 1, 
                title : "Nấu cơm",
                isCompleted : false
            },
             {
                id : 2, 
                title : "Quét nhà",
                isCompleted : false
            },
        ]
};


const allowedOrigins = [
    'http://localhost:5173',
    'https://nguyenchuong10.github.io'
]

const server = http.createServer((req , res) => {
    console.log(req.method ,req.url)
    const origin = req.headers.origin;
    console.log('Request:', req.method, req.url);
    console.log('Origin:', origin);
    console.log('Allowed?', allowedOrigins.includes(origin)); // ✅ Thêm log để debug

   

    // Kiểm tra origin có trong danh sách cho phép không
    if(origin && allowedOrigins.includes(origin)){
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    } else {
        console.log('Origin not allowed:', origin); // ✅ Log khi bị reject
    }

    // Xử lý OPTIONS request (preflight)
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }



        if(req.url.startsWith('/bypass-cors')) {
        const urlParams = new URL(req.url, `http://${req.headers.host}`);
        const targetUrl = urlParams.searchParams.get('url');

        if(!targetUrl) {
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({ error: 'Missing url parameter' }));
            return;
        }

        console.log('Bypassing CORS for:', targetUrl);

        // Parse target URL
        const parsedUrl = new URL(targetUrl);
        const protocol = parsedUrl.protocol === 'https:' ? https : http;

        // Collect body nếu có
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            // Chuẩn bị options cho request
            const options = {
                hostname: parsedUrl.hostname,
                port: parsedUrl.port,
                path: parsedUrl.pathname + parsedUrl.search,
                method: req.method,
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Node.js Proxy'
                }
            };

            // Thực hiện request tới target URL
            const proxyReq = protocol.request(options, (proxyRes) => {
                let responseData = '';

                proxyRes.on('data', (chunk) => {
                    responseData += chunk.toString();
                });

                proxyRes.on('end', () => {
                    // Trả response về cho client
                    res.writeHead(proxyRes.statusCode, {
                        'Content-Type': 'application/json'
                    });
                    res.end(responseData);
                });
            });

            proxyReq.on('error', (error) => {
                console.error('Proxy Error:', error.message);
                res.writeHead(500, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({ 
                    error: 'Failed to fetch from target URL',
                    message: error.message 
                }));
            });

            // Gửi body nếu có
            if(body) {
                proxyReq.write(body);
            }

            proxyReq.end();
        });

        return;
    }

    //get api task
    if(req.method === "GET" && req.url === "/api/tasks"){
        res.writeHead(200 , {'Content-Type' : 'application/json' })
        res.end(JSON.stringify(db.tasks));
        return;
    }
    //post api task 
    if(req.method === "POST" && req.url === "/api/tasks"){
        let body = '';

        req.on("data" , (chunk) => {
            body += chunk.toString();
            console.log("chunk " , chunk.toString());
            
        });

        req.on("end" , () => {
            const payload = JSON.parse(body)
            const newTask = {
                id : ++uniId,
                title : payload.title,
                isCompleted : false
            }
            db.tasks.push(newTask);
            res.writeHead(201 , {"Content-type" : "text/plain" });
            res.end(JSON.stringify({
                data:newTask
            }))

        });
            return;
    }

    if(req.method === "PATCH" && req.url.startsWith("/api/tasks")) {
        const id = parseInt(req.url.split("/")[3]);
        const taskIndex = db.tasks.findIndex(index => index.id === id )

        if(taskIndex === -1) {
            res.writeHead(404 , {"Content-Type" : "text/plain"})
            res.end(JSON.stringify("not found"));
            return;
        }

        let body = '';
        req.on("data" , (chunk) => {
            body += chunk.toString();
        })
        req.on('end', () => {
            const payload = JSON.parse(body)
            db.tasks[taskIndex].title = payload.title !== undefined ? payload.title : db.tasks[taskIndex].title,
            db.tasks[taskIndex].isCompleted = payload.isCompleted !== undefined ? payload.isCompleted : db.tasks[taskIndex].isCompleted
            
            res.writeHead(200, {"Content-type" : "application/json"});
            res.end(JSON.stringify(db.tasks[taskIndex]));
        })
            return;   
    }
    if(req.method === "DELETE" && req.url.startsWith("/api/tasks/")){
        const id = parseInt(req.url.split("/")[3])
        const taskIndex = db.tasks.findIndex(index => index.id === id);

        if(taskIndex === -1) {
            res.writeHead(404 , {"Content-Type" : "text/plain"})
            res.end(JSON.stringify("not found"));
            return;
        }
        db.tasks.splice(taskIndex , 1);
         res.writeHead(200, {"Content-Type": "application/json"});
         res.end(JSON.stringify({ message: "Task deleted successfully" }));
        return;
    }

      res.writeHead(404, {"Content-Type": "application/json"});
       res.end(JSON.stringify({ error: "Route not found" }));

});

server.listen(3000 , () => {
    console.log("server start ... ")
})
