export default class Route {

    constructor(id, name, geometry, location, distance, elevation, favorites, user) {
        this.id = id;
        this.name = name;
        this.geometry = geometry;
        this.location = location;
        this.distance = distance
        this.elevation = elevation
        this.favorites = favorites;
        this.user = user;
        this.isPublic = true;
    }

}