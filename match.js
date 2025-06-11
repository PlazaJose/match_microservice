class Match{
    static COLA_RANK = 0;
    static COLA_NORMAL = 1;
    constructor(id, start_time, jugador, num_players, tipo_cola){
        this.id = id;
        this.start_time = start_time;
        this.player_list = [];
        this.mmr_media = jugador.get_mmr();
        this.mmr_range = 5;
        this.num_players = num_players;
        this.add_player(jugador);
        this.tipo_cola = tipo_cola;
        this.tolerancia = 60*1000;
    }
    add_player(jugador){
        //ignorar si ya existe
        if(this.get_player(jugador.get_id()).result){
            return {state: false, jugadores: this.player_list.length};
        }
        //añadir al jugador
        jugador.set_map(this.generateRandomMap())
        this.player_list.push(jugador);
        this.calculate_mmr_medio();
        return {state: true, jugadores: this.player_list.length}
    }
    remove_player(id_player){
        this.player_list = this.player_list.filter(p => p.get_id()!= id_player);
        this.calculate_mmr_medio();
        return true;
    }
    get_list_but_player(id_player){
        return this.player_list.filter(p => p.get_id() != id_player);
    }
    calculate_mmr_medio(){
        let sum = 0;
        this.player_list.forEach(jugador => {
            sum += jugador.get_mmr();
        });
        this.mmr_media = sum/this.player_list.length;
    }
    get_player(id){
        let jugador = this.player_list.find(jugador => jugador.get_id() === id);
        if (jugador) {
            return { result: true, data: jugador };
        }
        return { result: false, data: null };
    }
    get_winner_id(){
        if(this.get_size()>1){
            return -1;
        }
        return this.player_list[0].get_id()
    }
    get_tipo_cola(){
        return this.tipo_cola;
    }
    get_num_players(){
        return this.num_players;
    }
    get_id(){
        return this.id;
    }
    get_size(){
        return this.player_list.length;
    }

    generate_random_map(si, sj){
        let mines = new Set(); // Use a Set to ensure uniqueness
        mines.add(`${si},${sj}`);
        while (mines.size < 11) {
            let row = Math.floor(Math.random() * 10);
            let column = Math.floor(Math.random() * 10);
            mines.add(`${row},${column}`); // Store positions as unique strings
        }
        mines.delete(`${si},${sj}`);

        // Convert Set back to an array of objects
        let mineArray = Array.from(mines).map(position => {
            let [row, column] = position.split(",").map(Number);
            return { row, column };
        });

        return { mines: mineArray, moves:[]};
    }
    generateRandomMap() {
        let mines = new Set(); // Use a Set to ensure uniqueness

        while (mines.size < 10) {
            let row = Math.floor(Math.random() * 10);
            let column = Math.floor(Math.random() * 10);
            mines.add(`${row},${column}`); // Store positions as unique strings
        }

        // Convert Set back to an array of objects
        let mineArray = Array.from(mines).map(position => {
            let [row, column] = position.split(",").map(Number);
            return { row, column };
        });

        return { mines: mineArray, moves:[]};
    }
    serialize(){
        return {
            id_match : this.id,
            tipo_cola : this.tipo_cola,
            jugadores : this.get_serialized_player_list()
        };
    }
    get_serialized_player_list(){
        const sp = [];
        this.player_list.forEach(jugador => {
            sp.push(jugador.serialize());
        });
        return sp;
    }

}

module.exports = Match;