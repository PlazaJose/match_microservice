const Match = require("./match");
const Jugador = require("./player");

class Match_manager{
    constructor(){
        this.match_list = [];
        this.id_counter = 0;
        this.init();
    }
    init(){}
    add_match_old(jugador, num_players, tipo_cola){
        const match = new Match(this.id_counter, Date.now(), jugador, num_players, tipo_cola);
        this.match_list.push(match);
        this.id_counter += 1;
        return match.get_id();
    }
    add_match(gameData){
        const jugador_0 = new Jugador(gameData.jugadores[0].id, gameData.jugadores[0].name, parseInt(gameData.jugadores[0].mmr));
        const match = new Match(this.id_counter,0,jugador_0, 0, gameData.tipo_cola);
        gameData.jugadores.forEach(jugador_d => {
            const jugador = new Jugador(jugador_d.id, jugador_d.name, parseInt(jugador_d.mmr));
            match.add_player(jugador);
        });
        this.match_list.push(match);
        this.id_counter+=1;
        return match.get_id();
    }
    get_match(id){
        let match_encontrada = this.match_list.find(match => match.get_id()==id);
        if(match_encontrada){
            return {result: true, data: match_encontrada};
        }
        return {result: false, data: null};
    }
    get_match_by_player(id_player) {
        const match = this.match_list.find(match => match.get_player(id_player).result);
        if (match) {
            return { result: true, data: match };
        }
        return { result: false, data: null };
    }
    lenght(){
        return this.match_list.length;
    }
}

module.exports = Match_manager;