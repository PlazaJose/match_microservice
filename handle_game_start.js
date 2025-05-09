const Match = require('./match');
const Jugador = require('./player');

function handleGameStart(gameData) {
    console.log(`Iniciando partida con ID ${gameData.id_cola} entre: ${gameData.jugadores.join(', ')}`);
    const jugador_0 = new Jugador(gameData.jugadores[0].id, gameData.jugadores[0].name, parseInt(gameData.jugadores[0].mmr))
    const match = new Match(gameData.id_cola,0,jugador_0, 0, gameData.tipo_cola);
    console.log(match.generateRandomMap());
    console.log(jugador_0.player_to_string());
}

module.exports = { handleGameStart };