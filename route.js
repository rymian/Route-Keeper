export default class Route {

    constructor(id, name, coordinates) {
        this.id = id;
        this.name = name;
        this.coordinates = coordinates;

        this.user = "User";
        this.location = "Location";
        this.date;
        this.distance = 0.0;
        this.elevation = 0.0;
        this.favorites = 0;
        this.isPrivate = true;
    }

}