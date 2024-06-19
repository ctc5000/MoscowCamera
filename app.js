const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const fs = require("fs");
const YAML = require('yaml');
const {settings} = require("express/lib/application");
const file = fs.readFileSync('./samokat.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);
const cors = require('cors');
const path = require("path");
const multer = require("multer");
const upload = multer({dest: 'uploads/'});
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json({limit: '10mb', type: 'image/png'}));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const WebSocket = require('ws');


const routes = {
    //SALE_LOGIC
    photos: require('./Controllers/PhotoCntrl/PhotoView'),
    settings: require('./Controllers/Settings/SettingView'),
    promocodes: require('./Controllers/Promocodes/PromoCodesView'),


};
app.use(upload.array());

// We create a wrapper to workaround async errors not being transmitted correctly.
function makeHandlerAwareOfAsyncErrors(handler) {
    return async function (req, res, next) {
        try {
            // console.log(req.body);
            await handler(req, res);
        } catch (error) {
            next(error);
        }
    };
}


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


/*app.get('/', (req, res) => {
    res.send(`
		<h2>Hello, Sequelize + Express!</h2>
		<p>Make sure you have executed <b>npm run setup-example-db</b> once to have a populated example database. Otherwise, you will get <i>'no such table'</i> errors.</p>
		<p>Try some routes, such as <a href='/api/test'>/api/test</a> or <a href='/api/orchestras?includeInstruments'>/api/orchestras?includeInstruments</a>!</p>
	`);
});*/


for (const [routeName, routeController] of Object.entries(routes)) {
    console.log("test");

    if (routeController.uploadPhoto, upload.single('snapshot')) {
        app.post(
            `/api/${routeName}/uploadSnapshot`,
            makeHandlerAwareOfAsyncErrors(routeController.uploadPhoto)
        );
    }
    if (routeController.unconfirmed) {
        app.get(
            `/api/${routeName}/unconfirmed`,
            makeHandlerAwareOfAsyncErrors(routeController.unconfirmed)
        );
    }
    if (routeController.getConfirmed) {
        app.get(
            `/api/${routeName}/slideshow`,
            makeHandlerAwareOfAsyncErrors(routeController.getConfirmed)
        );
    }
    if (routeController.getConfirmed) {
        app.get(
            `/api/${routeName}/myphoto`,
            makeHandlerAwareOfAsyncErrors(routeController.getBygroup)
        );
    }
    if (routeController.setModeratingGroup) {
        app.post(
            `/api/${routeName}/confirmgroup`,
            makeHandlerAwareOfAsyncErrors(routeController.setModeratingGroup)
        );
    }

    if (routeController.RebuildBd) {
        app.get(
            `/api/${routeName}/createbd`,
            makeHandlerAwareOfAsyncErrors(routeController.RebuildBd)
        );
    }
    if (routeController.SynchBd) {
        app.get(
            `/api/${routeName}/updatebd`,
            makeHandlerAwareOfAsyncErrors(routeController.SynchBd)
        );
    }
    if (routeController.acceptPhoto) {
        app.post(
            `/api/${routeName}/acceptphoto`,
            makeHandlerAwareOfAsyncErrors(routeController.acceptPhoto)
        );
    }
    if (routeController.loadFromCsv) {
        app.get(
            `/api/${routeName}/loadpromo`,
            makeHandlerAwareOfAsyncErrors(routeController.loadFromCsv)
        );
    }
    if (routeController.grantOneCode) {
        app.get(
            `/api/${routeName}/getcode`,
            makeHandlerAwareOfAsyncErrors(routeController.grantOneCode)
        );
    }

    if (routeController.getPromoById) {
        app.get(
            `/api/${routeName}/getmycode`,
            makeHandlerAwareOfAsyncErrors(routeController.getPromoById)
        );
    }


//Базовые методы
    if (routeController.getAll) {
        app.get(
            `/api/${routeName}`,
            makeHandlerAwareOfAsyncErrors(routeController.getAll)
        );
    }
    if (routeController.getById) {
        app.get(
            `/api/${routeName}/:id`,
            makeHandlerAwareOfAsyncErrors(routeController.getById)
        );
    }
    if (routeController.create) {
        app.post(
            `/api/${routeName}`,
            makeHandlerAwareOfAsyncErrors(routeController.create)
        );
    }
    if (routeController.update) {
        app.put(
            `/api/${routeName}`,
            makeHandlerAwareOfAsyncErrors(routeController.update)
        );
    }
    if (routeController.remove) {
        app.delete(
            `/api/${routeName}`,
            makeHandlerAwareOfAsyncErrors(routeController.remove)
        );
    }
}

const WSPort = process.env.SOCKET_PORT;
const wsServer = new WebSocket.Server({port: WSPort});
wsServer.on('connection', onConnect);

function onConnect(wsClient) {
    console.log('Новый пользователь');
    // отправка приветственного сообщения клиенту
    //wsClient.send('Привет');

    wsClient.on('message', function (data) {

        console.log("+++++++++")


        // The server sent you an event
        var echoEvent = JSON.parse(data);
        if (echoEvent !== "") {
            wsSendPing(wsClient);
            console.log(echoEvent);
        }

        // Do something based on the event type:
        if (echoEvent.eventType === 10)
            console.log('We got an echo: ' + echoEvent.message);
    });

    wsClient.on('close', function () {
        // отправка уведомления в консоль
        console.log('Пользователь отключился');
    });
}

function wsSendPing(wsClient) {
    console.log('Новый PING');
    wsClient.send(JSON.stringify({action: 'PING'}));
}

async function SocketSend(value) {
    let count = 0;
    wsServer.clients.forEach(function each(client) {
        client.send(value);
        count++;
    })
    console.log(count);
}

async function TestLog(value) {
    console.dir("Test log " + value);
}

module.exports.log = TestLog;
module.exports.SS = SocketSend;
module.exports = app;
