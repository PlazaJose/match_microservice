const express = require('express');
const { listenEvents } = require('./events');
const { handleGameStart } = require('./handle_game_start');
const Match_manager = require("./match_manager");
const Jugador = require('./player');

const app = express();
const PORT = 5104;
// Middleware to parse JSON
app.use(express.json());

//manejo de partidas
const match_manager = new Match_manager();

app.get("/match/find/:id_player", (req, res)=>{
    const id_player = req.params.id_player;
    const match = match_manager.get_match_by_player(id_player);
    if(!match.result){
        return res.json({state: false, message: "jugadr o cola no encontrada: ", match});
    }
    return res.json({state: true, match: match.data.get_id()});
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
    return res.json({state: false, message: "jugadr o cola no encontrada"});
});

app.post("/match/move", (req, res)=>{
    const {id_match, id_player, move} = req.body;
    const match_result = match_manager.get_match(id_match);
    if(match_result.result){
        const match = match_result.data;
        const player_result = match.get_player(id_player);
        if(player_result.result){
            const player = player_result.data;
            const move_state = player.make_move(move.roq, move.column, move.state);
            return res.json({state: move_state, map: player.get_map()});
        }
    }
    return res.json({state: false, message: "jugadr o cola no encontrada"});
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