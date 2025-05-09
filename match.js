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
        //añadir al jugador
        this.player_list.push(jugador);
        this.calculate_mmr_medio();
        return {state: true, jugadores: this.player_list.length}
    }
    remove_player(id_player){
        this.player_list = this.player_list.filter(p => p.get_id()!= id_player);
        this.calculate_mmr_medio();
        return true;
    }
    calculate_mmr_medio(){
        let sum = 0;
        this.player_list.forEach(jugador => {
            sum += jugador.get_mmr();
        });
        this.mmr_media = sum/this.player_list.length;
    }
    get_player(id){
        this.player_list.forEach(jugador => {
            if(jugador.get_id() == id){
                return {result: true, data: jugador};
            }
        });
        return {result: false, data: null};
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

    generate_random_map(){
        let mines = [];
        for(let i = 0; i< 10; i++){
            let row = Math.floor(Math.random() * 10);
            let column = Math.floor(Math.random() * 10);
            mines.push({row, column});
        }
        return{mines};
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

        return { mines: mineArray };
    }
}

module.exports = Match;