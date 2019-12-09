export default class Route {

    constructor(id, name, coordinates) {
        this.id = id;
        this.name = name;
        this.coordinates = coordinates;

        this.location = "";
        this.distance = 0.0;
        this.elevationChange = 0.0;
        this.favorites = 0;
        this.isPrivate = true;
    }

}