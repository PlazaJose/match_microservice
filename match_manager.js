const Match = require("./match");

class Match_manager{
    constructor(){
        this.match_list = [];
        this.id_counter = 0;
        this.init();
    }
    init(){}
    add_match(jugador, num_players, tipo_cola){
        let match = new Match(this.id_counter, Date.now(), jugador, num_players, tipo_cola);
        this.match_list.push(match);
        this.id_counter += 1;
        return match.get_id();
    }
}

module.exports = Match_manager;