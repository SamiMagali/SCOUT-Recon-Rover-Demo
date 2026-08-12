////////////////////////////////////////////////////////////
// SCOUT Recon Rover V1.0 (10% Scale / Fast-Render Version)
// Industrial Contractor Edition
////////////////////////////////////////////////////////////


// =============================
// GLOBAL SETTINGS
// =============================

// 10% scale (1:10 ratio)
MODEL_SCALE = 0.1; 

// Lower $fn for FAST rendering during design/testing.
// TIP: Change $fn to 64 right before exporting your final STL!
$fn = 16; 


// =============================
// MAIN VEHICLE DIMENSIONS
// =============================

ROVER_LENGTH = 1500;
ROVER_WIDTH  = 900;
ROVER_HEIGHT = 500;

// Track dimensions
SCOUT_TRACK_LENGTH = 1150;
SCOUT_MAIN_WHEEL_RADIUS = 150; 
SCOUT_SMALL_WHEEL_RADIUS = 70;  
SCOUT_BELT_THICKNESS = 20;      
SCOUT_TRACK_WIDTH = 220;
SCOUT_TRACK_OFFSET = ROVER_WIDTH/2 + 70;

SCOUT_INNER_HEIGHT = SCOUT_MAIN_WHEEL_RADIUS * 2; 
SCOUT_OUTER_HEIGHT = SCOUT_INNER_HEIGHT + (SCOUT_BELT_THICKNESS * 2); 


// =============================
// UTILITY MODULES
// =============================

module rounded_box(size=[10,10,10], radius=5)
{
    minkowski()
    {
        cube([
            size[0]-radius*2,
            size[1]-radius*2,
            size[2]-radius*2
        ], center=true);

        sphere(radius);
    }
}

module armour_plate(length, width, height)
{
    hull()
    {
        cube([length, width, height], center=true);

        translate([0, 0, height/2])
        cube([length*0.92, width*0.92, height], center=true);
    }
}

module bolt(position=[0,0,0], size=10)
{
    translate(position)
    cylinder(h=size, r=size/2, center=true);
}

module vent(length, width, height)
{
    difference()
    {
        cube([length, width, height], center=true);

        for(i=[-length/3 : length/6 : length/3])
        {
            translate([i, 0, 0])
            cube([5, width+2, height+2], center=true);
        }
    }
}


////////////////////////////////////////////////////////////
// PART 2: Main Hull Assembly & Front Engraving
////////////////////////////////////////////////////////////

module front_engraving()
{
    translate([-ROVER_LENGTH/2 - 78, 0, ROVER_HEIGHT/2 + 10])
    rotate([90, 0, -90])
    linear_extrude(height = 12, center = true)
    {
        translate([0, 70, 0])
        text("SCOUT v1", size = 52, halign = "center", valign = "center", font = "Liberation Sans:style=Bold");

        translate([0, 0, 0])
        text("model proto", size = 36, halign = "center", valign = "center", font = "Liberation Sans:style=Bold");

        translate([0, -60, 0])
        text("by Sami Magali", size = 32, halign = "center", valign = "center", font = "Liberation Sans:style=Bold");
    }
}

module scout_hull()
{
    translate([0, 0, ROVER_HEIGHT/2])
    rounded_box([ROVER_LENGTH, ROVER_WIDTH, ROVER_HEIGHT], 80);

    translate([-ROVER_LENGTH/2 - 30, 0, ROVER_HEIGHT/2])
    hull()
    {
        cube([100, ROVER_WIDTH*0.9, ROVER_HEIGHT*0.8], center=true);

        translate([60, 0, 0])
        cube([80, ROVER_WIDTH*0.75, ROVER_HEIGHT*0.65], center=true);
    }

    translate([0, 0, ROVER_HEIGHT + 15])
    rounded_box([500, 500, 30], 15);

    for(side=[-1, 1])
    {
        translate([0, side*(ROVER_WIDTH/2 + 20), ROVER_HEIGHT/2])
        rounded_box([ROVER_LENGTH*0.75, 60, ROVER_HEIGHT*0.7], 20);
    }

    translate([ROVER_LENGTH/2 - 150, 0, ROVER_HEIGHT + 40])
    rounded_box([300, 500, 100], 25);
}

module hull_details()
{
    for(z=[-160, 160])
    {
        bolt([-ROVER_LENGTH/2 - 75, 0, ROVER_HEIGHT/2 + z], 18);
    }

    for(side=[-1, 1])
    {
        translate([100, side*(ROVER_WIDTH/2 + 50), ROVER_HEIGHT/2])
        armour_plate(400, 20, 220);
    }

    translate([ROVER_LENGTH/2 - 10, 0, ROVER_HEIGHT/2 + 50])
    vent(100, 200, 100);
}


////////////////////////////////////////////////////////////
// PART 3: CONTINUOUS ROBOTIC TREAD MODULE
////////////////////////////////////////////////////////////

module scout_oval_shape(length, height, width)
{
    cap_x = (length - height) / 2;

    hull()
    {
        translate([-cap_x, 0, 0])
        rotate([90, 0, 0])
        cylinder(h=width, r=height/2, center=true);

        translate([cap_x, 0, 0])
        rotate([90, 0, 0])
        cylinder(h=width, r=height/2, center=true);
    }
}

module track_segment(width)
{
    union()
    {
        cube([38, width, 18], center=true);

        translate([0, 0, 10])
        cube([22, width - 20, 8], center=true);

        for(y = [-width/2 + 15, width/2 - 15])
        {
            translate([16, y, -2])
            rotate([0, 90, 0])
            cylinder(h=12, r=7, center=true);
        }
    }
}

module track_side_plate(side)
{
    plate_len = SCOUT_TRACK_LENGTH + 20;
    plate_h   = SCOUT_INNER_HEIGHT + 10;
    plate_thick = 15;

    translate([0, side * (SCOUT_TRACK_WIDTH/2 + plate_thick/2), 0])
    difference()
    {
        scout_oval_shape(plate_len, plate_h, plate_thick);

        rotate([90, 0, 0])
        cylinder(h=plate_thick + 5, r=32, center=true);

        for(x = [-120, 120])
        {
            for(z = [-60, 60])
            {
                translate([x, 0, z])
                rotate([90, 0, 0])
                cylinder(h=plate_thick + 5, r=12, center=true);
            }
        }

        for(x = [-380, 380])
        {
            translate([x, 0, 0])
            rotate([90, 0, 0])
            cylinder(h=plate_thick + 5, r=10, center=true);
        }
    }
}

module scout_track_assembly()
{
    cap_x  = (SCOUT_TRACK_LENGTH - SCOUT_INNER_HEIGHT) / 2;
    radius = (SCOUT_OUTER_HEIGHT / 2) - 8;
    w      = SCOUT_TRACK_WIDTH;

    difference()
    {
        scout_oval_shape(SCOUT_TRACK_LENGTH + 20, SCOUT_OUTER_HEIGHT - 10, w);
        scout_oval_shape(SCOUT_TRACK_LENGTH - 40, SCOUT_INNER_HEIGHT - 30, w + 10);
    }

    for(x = [-cap_x : 42 : cap_x])
    {
        translate([x, 0, radius])
        track_segment(w);

        translate([x, 0, -radius])
        rotate([0, 180, 0])
        track_segment(w);
    }

    for(a = [-75 : 18 : 75])
    {
        translate([cap_x + radius * cos(a), 0, radius * sin(a)])
        rotate([0, -a, 0])
        track_segment(w);
    }

    for(a = [105 : 18 : 255])
    {
        translate([-cap_x + radius * cos(a), 0, radius * sin(a)])
        rotate([0, -a, 0])
        track_segment(w);
    }

    translate([-cap_x, 0, 0])
    rotate([90, 0, 0])
    cylinder(h=w - 30, r=SCOUT_MAIN_WHEEL_RADIUS - 10, center=true);

    translate([cap_x, 0, 0])
    rotate([90, 0, 0])
    cylinder(h=w - 30, r=SCOUT_MAIN_WHEEL_RADIUS - 10, center=true);

    track_side_plate(1);
    track_side_plate(-1);
}

module scout_single_track(side)
{
    translate([0, side * SCOUT_TRACK_OFFSET, SCOUT_MAIN_WHEEL_RADIUS + SCOUT_BELT_THICKNESS])
    {
        scout_track_assembly();

        translate([0, -side * 40, 0])
        rotate([90, 0, 0])
        cylinder(h=140, r=50, center=true);
    }
}

module scout_tracks()
{
    scout_single_track(-1);
    scout_single_track(1);
}


////////////////////////////////////////////////////////////
// PART 4: REVISED OVERSIZED ULTRASONIC HEAD
////////////////////////////////////////////////////////////

module giant_ultrasonic_head()
{
    head_w = 420;
    head_h = 240;
    head_d = 280;
    eye_r  = 80;

    translate([0, 0, 40])
    cylinder(h=80, r=110, center=true);

    translate([0, 0, 100])
    rounded_box([180, 220, 100], 20);

    translate([0, 0, 230])
    difference()
    {
        rounded_box([head_d, head_w, head_h], 35);

        translate([0, -100, 0])
        rotate([0, 90, 0])
        cylinder(h=head_d + 10, r=eye_r, center=true);

        translate([0, 100, 0])
        rotate([0, 90, 0])
        cylinder(h=head_d + 10, r=eye_r, center=true);
    }

    translate([0, 0, 230])
    for(side = [-1, 1])
    {
        translate([0, side * 100, 0])
        rotate([0, 90, 0])
        difference()
        {
            cylinder(h=head_d - 10, r=eye_r - 2, center=true);
            cylinder(h=head_d + 20, r=eye_r - 18, center=true);
        }
    }
}

module scout_top_sensor_turret()
{
    translate([0, 0, ROVER_HEIGHT + 30])
    {
        cylinder(h=30, r=220, center=true);
        giant_ultrasonic_head();
    }
}


////////////////////////////////////////////////////////////
// PART 5: Details & Final Assembly
////////////////////////////////////////////////////////////

module armour_ribs()
{
    for(x=[-450, -225, 225, 450])
    {
        translate([x, 0, ROVER_HEIGHT + 10])
        rounded_box([35, ROVER_WIDTH - 120, 40], 10);
    }
}

module panel_lines()
{
    for(side=[-1, 1])
    {
        for(x=[-400, -150, 150, 400])
        {
            translate([x, side*(ROVER_WIDTH/2 + 35), ROVER_HEIGHT/2])
            cube([100, 12, 180], center=true);
        }
    }
}

module cooling_system()
{
    translate([450, 0, ROVER_HEIGHT + 20])
    vent(250, 150, 50);

    translate([-450, 0, ROVER_HEIGHT + 20])
    vent(200, 120, 45);
}

module warning_plate()
{
    translate([0, -ROVER_WIDTH/2 - 45, ROVER_HEIGHT/2 + 50])
    cube([200, 10, 60], center=true);
}


// =============================
// COMPLETE SCOUT ROVER
// =============================

module SCOUT_COMPLETE()
{
    scale([MODEL_SCALE, MODEL_SCALE, MODEL_SCALE])
    union()
    {
        translate([0, 0, 160])
        {
            scout_hull();
            hull_details();
            front_engraving();
            armour_ribs();
            panel_lines();
            cooling_system();
            warning_plate();
        }

        scout_tracks();

        translate([0, 0, 160])
        {
            scout_top_sensor_turret();
        }
    }
}


// Render final unified model
SCOUT_COMPLETE();