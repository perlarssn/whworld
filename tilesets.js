TILESET_FANTASY = "fantasy";
TILESET_FUTURE = "future";

function terrain_object(name, group) {
    return {
        name,
        group
    }
}

var DEFAULT_TERRAIN = {
    space: {
        rock_1: terrain_object("rock", "rocks")
    },
    future: {
        crater: terrain_object("crater", "craters")
    },
    fantasy: {
        tree: terrain_object("tree", "trees"),
        tree_2: terrain_object("tree_2", "trees"),
        tree_3: terrain_object("tree_3", "trees"),
        wizardstower: terrain_object("wizardstower", "landmarks"),
        inn: terrain_object("inn", "landmarks"),
        farm_house: terrain_object("farm_house", "farms"),
        farm_haystack: terrain_object("farm_haystack", "farms"),
        sacredoak: terrain_object("sacredoak", "landmarks"),
        rocks: terrain_object("rocks", "mountains"),
        hill_2: terrain_object("hill_2", "hills"),
        hill_3: terrain_object("hill_3", "hills"),
        hill_1: terrain_object("hill_1", "hills"),
        road_cr: terrain_object("road_cr", "roads"),
        road_ne: terrain_object("road_ne", "roads"),
        road_nw: terrain_object("road_nw", "roads"),
        road_ns: terrain_object("road_ns", "roads"),
        road_se: terrain_object("road_se", "roads"),
        road_we: terrain_object("road_we", "roads"),
        road_sw: terrain_object("road_sw", "roads"),
        river_wading: terrain_object("river_wading", "rivers"),
        river_ne: terrain_object("river_ne", "rivers"),
        river_nw: terrain_object("river_nw", "rivers"),
        river_ns: terrain_object("river_ns", "rivers"),
        river_se: terrain_object("river_se", "rivers"),
        river_we: terrain_object("river_we", "rivers"),
        river_sw: terrain_object("river_sw", "rivers")
    }
}

function find_sprite(name) {
    return 'tilesets/' + world.tileset + '/sprites/' + name + '.png';
}

