function sprite(url) {
    return {
        url
    }
}

function tile(bg) {
    return {
            bg
    }
}

function copy_tile(tile) {
    return {
        bg: tile.bg,
        object: tile.object,
        text: tile.text
    }
}

WORLD_SCALE = 4;
VIEWPORT_WIDTH=12;
VIEWPORT_HEIGHT=8;
canvas_x = 8;
canvas_y = 8;
WORLDMAP_TILE_SIZE = 48;
CANVAS_TILE_SIZE = 64;

function save_world() {
    var worlds = JSON.parse(localStorage["worlds"]);
    worlds[world.name] = world;
    localStorage["worlds"] = JSON.stringify(worlds);
}

if (!localStorage["worlds"]) {
    localStorage["worlds"] = "{}";
}

world = null;
if (localStorage["world"]) {
    world = JSON.parse(localStorage["world"]);
    var worlds = JSON.parse(localStorage["worlds"]);
    worlds.default = world;
    localStorage["worlds"] = JSON.stringify(worlds);
    delete localStorage["world"];
}

if (localStorage["worlds"] != "{}") {
    var worlds = JSON.parse(localStorage["worlds"]);
    var names = Object.keys(worlds);

    if (!world) {
        world = worlds[names[0]];
    }
}

if (!world) {
    world = DEFAULT_WORLD;
}

if (!world.tileset) {
    world.tileset = TILESET_FANTASY;
}

if (!world.name) {
    world.name = 'default';
}

viewport = new_viewport(world, canvas_x, canvas_y, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);

function new_world(size_x, size_y) {
    var rows = [];

    for (var r = 0; r < size_y; r++) {
        var row = [];
        for (var c = 0; c < size_x; c++) {
            row.push(JSON.parse(JSON.stringify(tile("default"))));
        }
        rows.push(row);
    }

    return {
        width: size_x,
        height: size_y,
        rows
    }
}

function new_viewport(world, x, y, width, height) {
    var rows = [];

    for (var r=y; r < y+height; r++) {
        var row = [];
        for (var c=x; c < x+width; c++) {
            row.push(world.rows[r][c]);
        }
        rows.push(row);
    }

    return { 
        x,
        y,
        rows
    };
}

function svg_node(n, v) {
    n = document.createElementNS("http://www.w3.org/2000/svg", n);
    for (var p in v) {
        n.setAttributeNS(null, p, v[p]);
    }
    return n;
}


function draw_tile(svg, x, y, sprite, size) {
    if (!size) {
        size = CANVAS_TILE_SIZE;
    }

    var bg = svg_node('image', {
        y: y*size,
        x: x*size,
        width: size,
        height: size,
    });
    bg.setAttributeNS('http://www.w3.org/1999/xlink', 'href',
        find_sprite(sprite));
    svg.appendChild(bg);
}

function draw_text(svg, x, y, text, size) {
    if (!size) {
        size = CANVAS_TILE_SIZE;
    }

    var bg = svg_node('text', {
        y: y*size - 8,
        x: x*size,
    });
    bg.innerHTML = text;
    svg.appendChild(bg);
}

function draw_svg(viewport) {
    var svg = document.getElementById("canvas");
    $("#canvas").children().remove();

    for (var y=0; y<viewport.rows.length; y++) {
        for (var x=0; x<viewport.rows[y].length; x++) {
            var tile = viewport.rows[y][x];
            draw_tile(svg, x, y, tile.bg);

            if (tile.object) {
                draw_tile(svg, x, y, tile.object);
            }

            if (tile.text) {
                draw_text(svg, x, y, tile.text);
            }
        }
    }
}

insert_type = 'ground';
insert_value = 'default';


function draw_minimap(rect_x, rect_y) {
var mypixels = Array(0);

 function createImage(pixels) {
  var canvas = document.createElement('canvas');
  canvas.width = pixels[0].length;
  canvas.height = pixels.length;
  var context = canvas.getContext('2d');
  for(var r = 0; r < canvas.height; r++) {
   for(var c = 0; c < canvas.width; c++) {
    context.fillStyle = pixels[r][c];
    context.fillRect(c, r, 1, 1);
   }
  }
  return canvas.toDataURL('image/png');
 }

  mypixels = Array(world.height);
  for (var h=0; h<world.height; h++) {
    mypixels[h] = Array(world.width);

    for (var g=0; g<world.width; g++) {
        var bg = world.rows[h][g].bg;
        var object = world.rows[h][g].object;

        if (bg == 'default') {
            mypixels[h][g] = '#0F0';
        } else if (bg == 'grassland') {
            mypixels[h][g] = '#0F0';
        } else if (bg == 'water') {
            mypixels[h][g] = '#00F';
        } else {
            mypixels[h][g] = '#000';
        }

        if (object) {
            object = object.split("_")[0];

            if (object == 'tree') {
                mypixels[h][g] = '#107C10';
            } else if (object == 'river') {
                mypixels[h][g] = '#00F';
            } else if (object == 'road') {
                mypixels[h][g] = '#996600';
            }
        }
    }
  }

    var svg = document.getElementById("minimap");

    var pt = svg.createSVGPoint();
    $("#minimap").children().remove();

    function cursorPoint(evt){
        pt.x = evt.clientX; pt.y = evt.clientY;
        return pt.matrixTransform(svg.getScreenCTM().inverse());
    }

    svg.addEventListener('click', function(evt){
        var loc = cursorPoint(evt);
        console.log(loc);
    });

    var ratio = world.height / world.width;
    $("#minimap").attr('width', 300);
    $("#minimap").attr('height', Math.floor(ratio*300));

    var minimap2 = svg_node('image', {
        x: 0,
        y: 0,
        width: 300,
    });
    minimap2.setAttributeNS('http://www.w3.org/1999/xlink', 'href',
        createImage(mypixels));
    svg.appendChild(minimap2);

    var g = svg_node('g');
    svg.appendChild(g);
    svg.appendChild(svg_node('rect', {
        x: 300 * rect_x / world.width,
        y: 300 * ratio * rect_y / world.height,
        width: 300 * VIEWPORT_WIDTH/world.width,
        height: 300 * ratio * VIEWPORT_HEIGHT/world.height,
        fill: 'rgba(0,0,0,0)',
        style: 'stroke-width: 2px; stroke: red;'
    }));
}

function svg_viewport($scope, width, height) {
    var svg = document.getElementById("canvas");
    var pt = svg.createSVGPoint();

    function cursorPoint(evt){
        pt.x = evt.clientX; pt.y = evt.clientY;
        return pt.matrixTransform(svg.getScreenCTM().inverse());
    }

    var prev_x = 0;
    var prev_y = 0;

    var redraw = function() {
        draw_svg(viewport);
        draw_minimap(canvas_x, canvas_y);
    }

    $scope.go_north = function() {
        if (canvas_y > 0) {
            viewport = new_viewport(world, canvas_x, --canvas_y, 
                VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
            redraw();
        }
    }

    $scope.go_south = function() {
        if (canvas_y + VIEWPORT_HEIGHT < world.height) {
            viewport = new_viewport(world, canvas_x, ++canvas_y, 
                VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
            redraw();
        }
    }

    $scope.go_east = function() {
        if (canvas_x + VIEWPORT_WIDTH < world.width) {
            viewport = new_viewport(world, ++canvas_x, canvas_y, 
                VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
            redraw();
        }
    }

    $scope.go_west = function() {
        if (canvas_x > 0) {
            viewport = new_viewport(world, canvas_x--, canvas_y, 
                VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
            redraw();
        }
    }

    svg.addEventListener('mousemove',function(evt){

        var loc = cursorPoint(evt);
        var x = Math.floor(loc.x / CANVAS_TILE_SIZE);
        var y = Math.floor(loc.y / CANVAS_TILE_SIZE);

        if (prev_x != x || prev_y != y) {
            if (loc.y >= 512-20) {
                $scope.go_south();
            } else if (loc.y <= 20) {
                $scope.go_north();
            } else if (loc.x >= 768-20) {
                $scope.go_east();
            } else if (loc.x < 20) {
                $scope.go_west();
            }

            if (prev_x >= 0 && prev_y >= 0) {
                var tile = viewport.rows[prev_y][prev_x];
                draw_tile(svg, prev_x, prev_y, tile.bg, CANVAS_TILE_SIZE);
                if (tile.object) {
                    draw_tile(svg, prev_x, prev_y, tile.object, CANVAS_TILE_SIZE);
                }
            }

            if (y >= viewport.rows.length) {
                y = viewport.rows.length - 1;
            }

            if (x >= viewport.rows[0].length) {
                x = viewport.rows[0].length - 1;
            }

            prev_x = x;
            prev_y = y;

            if (svg.children.length >= 500) {
                redraw();
            }

            draw_tile(svg, x, y, insert_value, CANVAS_TILE_SIZE);
        }

    },false);

    svg.addEventListener('click', function(evt){
        if (insert_type == 'ground') {
            viewport.rows[prev_y][prev_x] = copy_tile(
                viewport.rows[prev_y][prev_x]);
            viewport.rows[prev_y][prev_x].bg = insert_value;

            world.rows[viewport.y + prev_y][viewport.x + prev_x] = copy_tile(
                world.rows[viewport.y + prev_y][viewport.x + prev_x]);
            world.rows[viewport.y + prev_y][viewport.x + prev_x].bg = insert_value;
        } else if (insert_type == 'terrain') {
            viewport.rows[prev_y][prev_x] = copy_tile(
                viewport.rows[prev_y][prev_x]);
            viewport.rows[prev_y][prev_x].object = insert_value;

            world.rows[viewport.y + prev_y][viewport.x + prev_x] = copy_tile(
                world.rows[viewport.y + prev_y][viewport.x + prev_x]);
            world.rows[viewport.y + prev_y][viewport.x + prev_x].object = insert_value;
        }

        save_world();
    });

    draw_svg(viewport);
}

function sprite(source) {
    return {
        source
    }
}



angular.module('WhWorld')
.controller('CanvasController', function($scope){
    $scope.find_sprite = find_sprite;

    $scope.write_text = function() {
        viewport.rows[4][4] = copy_tile(
            viewport.rows[4][4]);
        viewport.rows[4][4].text = $scope.write_name;

        world.rows[viewport.y + 4][viewport.x + 4] = copy_tile(
            world.rows[viewport.y + 4][viewport.x + 4]);
        world.rows[viewport.y + 4][viewport.x + 4].text = $scope.write_name;

        save_world();
    }

    $scope.terrain = {}
    var groups = {};

    for (n in DEFAULT_TERRAIN[world.tileset]) {
        var name = n;
        var t = DEFAULT_TERRAIN[world.tileset][n];
        if (!$scope.terrain[t.group]) {
            $scope.terrain[t.group] = [];
        }

        $scope.terrain[t.group].push(n);
        groups[t.group] = true;
    }

    $scope.terrain_groups = Object.keys(groups);
    $scope.terrain_in_group = [];
    $scope.selected_group = undefined;
    $scope.change_group = function() {
            $scope.terrain_in_group = $scope.terrain[$scope.selected_group];
    }

    $scope.grounds = ['space', 'water', 'grassland'];
    $scope.select_ground = function(type) {
        insert_type = 'ground';
        insert_value = type;
    }
    $scope.select_terrain = function(type) {
        insert_type = 'terrain';
        insert_value = type;
    }

    svg_viewport($scope);
})
.controller('TerrainController', function($scope){
    $scope.list = DEFAULT_TERRAIN[world.tileset];
    console.log(Object.keys($scope.list));
})
.controller('MapController', function($scope){
    var significance = {
        'wizardstower': 211,
        'sacredoak': 200,
        'inn': 50
    }

    function sum(world, base_x, base_y) {
        objects = {};
        terrain = {};
        text = null;

        for (var y = base_y; y < base_y + 4; y++) {
            for (var x = base_x; x < base_x + 4; x++) {
                var type = world[y][x].bg.split('_')[0];
                var object = world[y][x].object;

                if (!terrain[type]) {
                    terrain[type] = 0;
                }

                if (object) {
                    object = object.split('_')[0];
                }

                if (!objects[object]) {
                    objects[object] = 0;
                }
                if (world[y][x].text) {
                    text = world[y][x].text;
                }

                terrain[type] = terrain[type] + 1;

                if (object) {
                    if (significance[object]) {
                        objects[object] += significance[object];
                    } else {
                        objects[object] = objects[object] + 1;
                    }
                }
            }
        }

        function find_best(from, thresh) {
            var max = thresh;
            var best = null;

            for (k in from) {
                if (k.startsWith("river") || k.startsWith("road")) {
                    continue;
                }

                if (from[k] > max) {
                    best = k;
                    max = from[k];
                }
            }

            return best;
        }

        return {
            bg: find_best(terrain, -1),
            object: find_best(objects, 1),
            text
        }
    }

    function remodel(world) {
        var remodeled = Array(Math.floor(world.height/WORLD_SCALE));

        for (var y = 0; y < Math.floor(world.height/WORLD_SCALE); y++) {
            remodeled[y]= Array(Math.floor(world.width/WORLD_SCALE));

            for (var x = 0; x < Math.floor(world.width/WORLD_SCALE); x++) {
                remodeled[y][x] = sum(world.rows, x*WORLD_SCALE, y*WORLD_SCALE);
            }
        }

        return remodeled;
    }

    function find_river_nodes(world, riverOrRoad) {
        var list = [];
        var nodes = Array(world.height);

        for (var y=0; y<world.height; y++) {
            nodes[y] = Array(world.width);
            for (var x=0; x<world.width; x++) {
                if (world.rows[y][x].object &&
                    world.rows[y][x].object.startsWith(riverOrRoad)) {
                    nodes[y][x] = true;
                    list.push({x, y});
                }
            }
        }

        return {
            list,
            nodes
        }
    }

    function find_new_river_end(nodes, riverOrRoad) {
        var x = nodes.list[0].x;
        var y = nodes.list[0].y;
        delete nodes.list[0];
        var startx = x;
        var starty = y;
        var visited = {};
        var connection = [
            {x, y}
        ];

        do {
            var do_run = true;
            var do_go_next = false;

            for (rel_x=-1; rel_x<=1 && do_run; rel_x++) {
                for(rel_y=-1; rel_y<=1 && do_run; rel_y++) {
                    if (rel_x == 0 && rel_y==0) {
                        continue;
                    }

                    var xpos = x+rel_x;
                    var ypos = y+rel_y;

                    if (xpos < 0 || xpos > world.width) {
                        continue;
                    }

                    if (ypos < 0 || ypos > world.height) {
                        continue;
                    }

                    if (!nodes.nodes[ypos] || !nodes.nodes[ypos][xpos]) {
                        continue;
                    }

                    nodes.nodes[y][x] = false;

                    for (var i=0; i<nodes.list.length; i++) {
                        if (!nodes.list[i]) {
                            continue;
                        }

                        if (nodes.list[i].x == x && nodes.list[i].y == y) {
                            delete nodes.list[i];
                            break;
                        }
                    }

                    x = xpos;
                    y = ypos;
                    do_run = false;
                    do_go_next = true;
                    connection.push({x,y});
                }
            }

            if (!do_go_next) {
                return connection;
            }
        } while (startx != x || starty != y);
    }

    function interconnect_rivers_roads(world, riverOrRoad) {
        var nodes = find_river_nodes(world, riverOrRoad);
        var connections = [];

        while (nodes.list.length > 0) {
            nodes.list = nodes.list.filter(i => i);
            if (!nodes.list.length) {
                break;
            }

            var connection = find_new_river_end(nodes, riverOrRoad);
            connections.push(connection);
        }

        return connections;
    }

    function draw_river_roads(svg, world, riverOrRoad) {
        var g = svg_node('g');
        svg.appendChild(g);

        var connections = interconnect_rivers_roads(world, riverOrRoad);

        for (var k=0; k<connections.length; k++) {
            var c = connections[k];

            for (var p=0; p<c.length; p++) {
                var x = c[p].x;
                x = x / WORLD_SCALE;
                x = x * WORLDMAP_TILE_SIZE;
                x = x + WORLD_SCALE/2;
                c[p].x = x;

                var y = c[p].y;
                y = y / WORLD_SCALE;
                y = y * WORLDMAP_TILE_SIZE;
                c[p].y = y;

            }

            var prev = c[0];

            for (var i = 1; i < c.length; i++) {
                style = riverOrRoad == "river" ? 'stroke: rgb(72,121,251); stroke-width: 3px' :
                    'stroke: rgb(185,122,87); stroke-width: 2px;';

                g.appendChild(svg_node('line', {
                    x1: prev.x,
                    y1: prev.y,
                    x2: c[i].x,
                    y2: c[i].y,
                    style
                }));
                prev = c[i];
            }
        }
    }


    var map = remodel(world);
    var svg = document.getElementById("worldmap");
    $("#worldmap").children().remove();
    for (var y=0; y<map.length; y++) {
        for (var x=0; x<map[y].length; x++) {
            draw_tile(svg, x, y, 'map/' + map[y][x].bg, WORLDMAP_TILE_SIZE);

            if (map[y][x].object) {
                draw_tile(svg, x, y, 'map/' + map[y][x].object, WORLDMAP_TILE_SIZE);
            }

            if (map[y][x].text) {
                draw_text(svg, x, y, map[y][x].text, WORLDMAP_TILE_SIZE);
            }
        }
    }

    draw_river_roads(svg, world, "road");
    draw_river_roads(svg, world, "river");
})
.controller('ScenarioController', function($scope){
    $scope.max_obstructing = 0.2;
    $scope.min_obstructing = 0.1;

    function calc_viewport_obstructing(viewport) {
        var unique = {};
        var obstruct = 0;
        for (var y=0; y<viewport.rows.length; y++) {
            for (var x=0; x<viewport.rows[y].length; x++) {
                if (viewport.rows[y][x].object) {
                    unique[viewport.rows[y][x].object] = 1;

                    if (!viewport.rows[y][x].object.startsWith("road")) {
                        if (!viewport.rows[y][x].object.startsWith("hill")) {
                        obstruct++;
                        }
                    }
                }
            }
        }

        return {
            val: obstruct / (viewport.rows.length * viewport.rows[0].length),
            unique: Object.keys(unique).length
        }
    }

    function no_terrain_type(viewport, type) {
        for (var y=0; y<viewport.rows.length; y++) {
            for (var x=0; x<viewport.rows[y].length; x++) {
                if (viewport.rows[y][x].bg == type) {
                    return false;
                }

                var object = viewport.rows[y][x].object;

                if (object) {
                    object = object.split("_")[0];
                }

                if (object == type) {
                    return false;
                }
            }
        }
        return true;
    }

    function obstructed_center(viewport) {
        var obstruct = 0;
        var visited = 0;

        var centerYBegin = Math.floor(viewport.rows.length * 3/10);
        var centerYEnd = Math.floor(viewport.rows.length * 7/10);
        var centerXBegin = Math.floor(viewport.rows[0].length * 4/10);
        var centerXEnd = Math.floor(viewport.rows[0].length * 6/10);

        for (var y=centerYBegin; y<=centerYEnd; y++) {
            for (var x=centerXBegin; x<centerXEnd; x++) {
                visited++;
                var object = viewport.rows[y][x].object;

                if (object) {
                    object = object.split('_')[0];

                    if (object != 'hill' && object != 'road') {
                        obstruct++;
                    }
                }
            }
        }

        return obstruct / visited;
    }

    function obstructed_deployment_zone(viewport) {
        var obstruct = 0;
        for (var y=0; y<2; y++) {
            for (var x=0; x<viewport.rows[y].length; x++) {
                var object = viewport.rows[y][x].object;
                if (object) {
                    object = object.split('_')[0];

                    if (object != 'hill' && object != 'road') {
                        obstruct++;
                    }
                }
            }
        }

        for (var i=0; i<2; i++) {
            var y = viewport.rows.length - i - 1;
            for (var x=0; x<viewport.rows[y].length; x++) {
                if (viewport.rows[y][x].object) {
                    obstruct++;
                }
            }
        }

        var width = viewport.rows[0].length;

        return obstruct / (width * 2 * 2);
    }

    function find_viewports(max_obstructing,
        min_obstructing,
        min_unique) {

        var valid = [];

        for (var y=0; y<world.height-8; y++) {
            for (var x=0; x<world.width-12; x++) {
                var viewport = new_viewport(world, x, y, 12, 8);
                var findings = calc_viewport_obstructing(viewport);
                var obstructing = findings.val;

                if (obstructing <= max_obstructing && obstructing >= min_obstructing) {
                    if (findings.unique >= min_unique) {
                        valid.push(viewport);
                    }
                }
            }
        }


        return valid;
    }

    $scope.selected_group = "trees";
    $scope.min_unique_terr = 1;
    $scope.min_ob_terr = 0.05;
    $scope.max_ob_terr = 0.6;
    $scope.max_ob_dz = 0.1;
    $scope.allow_rivers = false;
    $scope.max_ob_center = 0.2;

    $scope.generate = function() {
        var valid = find_viewports($scope.max_ob_terr, $scope.min_ob_terr, $scope.min_unique_terr)
        valid = valid.filter(vp => obstructed_deployment_zone(vp) <= $scope.max_ob_dz);
        valid = valid.filter(vp => $scope.allow_rivers || obstructed_center(vp) <= $scope.max_ob_center);
        valid = valid.filter(vp => no_terrain_type(vp, 'space'));
        valid = valid.filter(vp => $scope.allow_rivers || no_terrain_type(vp, 'river'));

        var selected = valid[Math.floor(Math.random() * valid.length)];
        draw_svg(selected);
        draw_minimap(selected.x, selected.y);
        console.log();
    }
})
.controller('SaveController', function($scope){
    var worlds = JSON.parse(localStorage["worlds"]);
    $scope.selected_world = world.name;
    $scope.worlds = Object.keys(worlds);

    $scope.printed_world = JSON.stringify(world);

    $scope.select_world = function() {
        var worlds = JSON.parse(localStorage["worlds"]);
        world = worlds[$scope.selected_world];
    }

    $scope.new_world = function() {
        world = new_world(96, 64);
        world.name = "world #" + Math.floor(Math.random() * 100);
        world.tileset = $scope.selected_tileset;
        save_world();
    }
})
.controller('StartController', function($scope){
})
