const express = require('express');
const { listenEvents } = require('./events');
const { handleGameStart } = require('./handle_game_start');
const Match_manager = require("./match_manager");
const Jugador = require('./player');

const app = express();
const PORT = 5104;
// Middleware to parse JSON
app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.get("/", (req, res) => {
    res.send(`
        <html>
        <head>
            <title>BMBR</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                h1 { color: #007bff; }
            </style>
        </head>
        <body>
            <h1>Welcome to the BMBR match manager  🚀</h1>
            <p>Use the API endpoints to retrieve data.</p>
            <p>try: <code>/match/find/:id</code>
        </body>
        </html>
    `);
});

//manejo de partidas
const match_manager = new Match_manager();

app.get("/match/find/:id_player", (req, res)=>{
    const id_player = req.params.id_player;
    const match = match_manager.get_match_by_player(id_player);
    if(!match.result){
        return res.json({state: false, message: "jugadr o match no encontrada: ", match});
    }
    return res.json({state: true, match: match.data.get_id()});
});

app.get("/match/started/:id_player", (req, res)=>{
    const id_player = req.params.id_player;
    const match = match_manager.get_match_by_player(id_player);
    if(!match.result){
        return res.json({state: false, message: "jugadr o match no encontrada: ", data : false});
    }
    return res.json({state: true, data: match.data.get_player(id_player).data.started});
});

app.get("/match/match/:id_match", (req, res)=>{
    const id_match = req.params.id_match;
    const match = match_manager.get_match(id_match);
    if(!match.result){
        return res.json({state: false, message: "match no encontrada: ", match:null});
    }
    return res.json({state: true, match: match.data.serialize()});
});

app.get("/match/map/:id_match/:id_player", (req, res)=>{
    const {id_match,id_player} = req.params;
    const match_result = match_manager.get_match(id_match);
    if(match_result.result){
        const match = match_result.data;
        const player_result = match.get_player(id_player);
        if(player_result.result){
            const player = player_result.data;
            return res.json({state: true, map: player.get_map()});
        }
    }
    return res.json({state: false, message: "jugadr o match no encontrada"});
});

app.post("/match/generate", (req, res)=>{
    const {id_match, id_player, si, sj} = req.body;
    const match_result = match_manager.get_match(id_match);
    if(match_result.result){
        const match = match_result.data;
        const player_result = match.get_player(id_player);
        if(player_result.result){
            const player = player_result.data;
            player.set_map(match.generate_random_map(si, sj));
            player.started = true;
            return res.json({state: true, map: player.get_map()});
        }
    }
    return res.json({state: false, message: "jugadr o match no encontrada"});
});

app.post("/match/move", (req, res)=>{
    const {id_match, id_player, move} = req.body;
    const match_result = match_manager.get_match(id_match);
    if(match_result.result){
        const match = match_result.data;
        const player_result = match.get_player(id_player);
        if(player_result.result){
            const player = player_result.data;
            if(player.check_state()){
                return res.json({state: false, map: player.get_map()});
            }
            const move_state = player.make_move(move.row, move.column, move.state);
            if (move_state.gamestate == 2){
                match_manager.finish_match_player_win(player.get_id());
            }
            if(move_state.gamestate == 1){
                //match_manager.remove_player(player.get_id(), match.get_id());
            }
            return res.json({state: move_state, map: player.get_map()});
        }
    }
    return res.json({state: false, message: "jugadr o match no encontrada"});
});

app.post('/match/abandonar', (req, res)=>{
    const {id_player, id_match} = req.body;
    const resultado = match_manager.remove_player(id_player, id_match);
    console.log(`Jugador ${id_player} ha abandonado la partida ${id_match}`);
    return res.json({message:`Jugador ${id_player} ha abandonado la cola ${id_match}`});
});

app.post('/match/create_match', (req, res) =>{
    const {data} = req.body;
    match_manager.add_match(data);
    console.log(event.data.jugadores[0].id, "_", match_manager.lenght());
    return res.json({message: `match started: ${match_manager.serialize()}`});
});

app.listen(PORT, () => {
    console.log(`Servidor Express corriendo en el puerto ${PORT}`);

    listenEvents((event) => {
        if (event.type === 'game_start') {
            //handleGameStart(event.data);
            match_manager.add_match(event.data);
            console.log(event.data.jugadores[0].id, "_", match_manager.lenght());
        }
    });
});

//http://localhost:5104/match/find/plaza
//http://localhost:5104/match/map/0/plaza