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
    remove_match(id){
        this.match_list = this.match_list.filter(match => match.get_id()!=id);
        return true;
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
    remove_player(id_player, id_match){
        const data = this.get_match(id_match);
        if(!data.result){
            console.log(data);
            return false;
        }
        data.data.remove_player(id_player);
        if(data.data.get_size()<1){
            this.remove_match(data.data.get_id());
        }
        if(data.data.get_size()==1){
            this.end_match(data.data);
        }
        return true;
    }
    finish_match_player_win(id_player){
        const match_result = this.get_match_by_player(id_player);
        if(!match_result.result){
            console.log("jugador no encontrado");
        }
        const match = match_result.data;
        const losers = match.get_list_but_player(id_player);
        losers.forEach(player => {
            this.remove_player(player.get_id(), match.get_id());
        });
    }
    end_match(match){
        //hacer ganar, llamando al microservicio de rank
        this.player_win(match.get_winner_id(), match.get_tipo_cola());
        //terminar
        this.remove_match(match.get_id());
    }
    player_win(id_player, tipo_cola = Match.COLA_NORMAL){
        switch(tipo_cola){
            case Match.COLA_NORMAL:
                break;
            case Match.COLA_RANK:
                sendRankingUpdate(id_player, 3);
                break;
            default:
                break;
        }
    }
    lenght(){
        return this.match_list.length;
    }
    
}

//const fetch = require('node-fetch');

async function sendRankingUpdate(id, points) {
    try {
        const response = await fetch('https://api-gateway-nine-orcin.vercel.app/rkn/ranking/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, points })
        });

        const data = await response.json();
        
        if (response.ok) {
            console.log("Ranking updated successfully:", data);
        } else {
            console.error("Error updating ranking:", data);
        }
    } catch (error) {
        console.error("Failed to connect to ranking service:", error);
    }
}

module.exports = Match_manager;