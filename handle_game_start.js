const Match = require('./match');
const Jugador = require('./player');
const Match_manager = require("./match_manager");

function handleGameStart(gameData) {
    console.log(`Iniciando partida con ID ${gameData.id_cola} entre: ${gameData.jugadores.join(', ')}`);
    const jugador_0 = new Jugador(gameData.jugadores[0].id, gameData.jugadores[0].name, parseInt(gameData.jugadores[0].mmr))
    const match = new Match(gameData.id_cola,0,jugador_0, 0, gameData.tipo_cola);
    console.log(match.generateRandomMap());
    console.log(jugador_0.player_to_string());
    const match_manager = new Match_manager();
    match_manager.add_match(gameData);
}



module.exports = { handleGameStart };