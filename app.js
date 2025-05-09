const express = require('express');
const { listenEvents } = require('./events');
const { handleGameStart } = require('./handle_game_start');

const app = express();
const PORT = 5104;

app.listen(PORT, () => {
    console.log(`Servidor Express corriendo en el puerto ${PORT}`);

    listenEvents((event) => {
        if (event.type === 'game_start') {
            handleGameStart(event.data);
        }
    });
});