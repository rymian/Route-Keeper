export default class Route {

    constructor(name, geometry, location, distance, elevation) {
        this.name = name;
        this.geometry = geometry;
        this.location = location;
        this.distance = distance
        this.elevation = elevation

        this.id = 0;
        this.user = "User";
        this.favorites = [];
    }

}