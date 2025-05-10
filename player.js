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
            return false;
        }
        //logica de la jugada :v?
        //verificar que no se haya hecho antes
        const grid_index = this.find_grid_index({row, column});
        if(grid_index != -1){
            this.map.moves[grid_index].state = state;
            return true;
        }
        //añadir jugada
        this.map.moves.push({row, column, state});
        return true;
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
    player_to_string(){
        return `jugador {id: ${this.id}, name: ${this.name}, mmr: ${this.mmr}}`;
    }
}

module.exports = Jugador;