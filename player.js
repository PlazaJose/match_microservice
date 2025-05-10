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
        if(!row || !column || !state){
            return false;
        }
        //logica de la jugada :v?
        //verificar que no se haya hecho antes
        //añadir jugada
        this.map.moves.push({row, column, state});
        return true;
    }
    player_to_string(){
        return `jugador {id: ${this.id}, name: ${this.name}, mmr: ${this.mmr}}`;
    }
}

module.exports = Jugador;