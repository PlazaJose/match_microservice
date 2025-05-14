class Jugador{
    constructor(id, name, mmr){
        this.id = id;
        this.name = name;
        this.mmr = mmr;
        this.map = {};
    }
    get_id() {
        return this.id;
    }
    get_name(){
        return this.name;
    }
    get_mmr(){
        return this.mmr;
    }
    get_map(){
        return this.map;
    }
    set_id(id) {
        this.id = id;
    }
    set_name(name){
        this.name = name;
    }
    set_mmr(mmr){
        this.mmr = mmr;
    }
    set_map(map){
        this.map = map;
    }
    make_move(row, column, state){
        if(row===undefined || column===undefined || state===undefined){
            return {state:false, gamestate:this.check_state()};
        }
        this.check_move(row, column, state);
        //logica de la jugada :v?
        return {state:true, gamestate:this.check_state()};
    }
    check_move(row, column, state){
        //verificar mina
        if(state == 3){
            if(this.find_mine_index({row, column}) != -1){
                state = 1
            }
        }
        //verificar que no se haya hecho antes
        const grid_index = this.find_grid_index({row, column});
        if(grid_index != -1){
            this.map.moves[grid_index].state = state;
        }
        //añadir jugada
        this.map.moves.push({row, column, state});
    }
    has_move(new_move) {
        return this.map.moves.some(move => 
            move.row === new_move.row &&
            move.column === new_move.column &&
            move.state === new_move.state
        );
    }
    find_grid_index(new_move) {
        return this.map.moves.findIndex(move => 
            move.row === new_move.row &&
            move.column === new_move.column
        );
    }
    find_mine_index(new_move){
        return this.map.mines.findIndex(mine => 
            mine.row === new_move.row &&
            mine.column === new_move.column
        );
    }
    check_state(){
        let opened = 0;
        let exploded = false;
        this.map.moves.forEach(move => {
            if(move.state == 1){//cuadricula abierta
                opened+=1;
            }
            switch(move.state){
                case 0: //cerrada
                    //false
                    break;
                case 1:// explotado
                    exploded = true; 
                    break;
                case 2: // bandera
                    //
                    break;
                case 3:
                    opened++; // abierta
                    break;
                case 4: // desconocido
                    //
                    break;
                default:
                    //
                    break;
            }
        });
        let win = opened+10==10*10;
        return (exploded?1:(win?2:0)); // retorna 1 si explotó, 2 si ganó y 0 si no ha pasado nada
    }
    player_to_string(){
        return `jugador {id: ${this.id}, name: ${this.name}, mmr: ${this.mmr}}`;
    }
    serialize(){
        return {
            id:this.id, name:this.name, mmr:this.mmr, map:this.map
        };
    }
}

module.exports = Jugador;