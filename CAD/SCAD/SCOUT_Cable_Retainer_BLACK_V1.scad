// =======================================
// SCOUT Cable Retainer BLACK V1
// Standalone Version
// =======================================


$fn = 24;


// ===============================
// LOCAL DIMENSIONS
// ===============================


cable_channel_width = 8;

cable_retainer_height = 5;

pla_wall_thickness = 3;

m3_clearance_diameter = 3.4;



// ===============================
// MODEL
// ===============================


module SCOUT_Cable_Retainer_BLACK_V1() {


    retainer_length = 15;


    retainer_width =
        cable_channel_width
        +
        (pla_wall_thickness * 2);


    retainer_height =
        cable_retainer_height
        +
        pla_wall_thickness;



    difference() {



        // Main body

        translate([
            0,
            0,
            retainer_height / 2
        ])

        cube([
            retainer_length,
            retainer_width,
            retainer_height
        ], center=true);




        // Cable channel

        translate([
            0,
            0,
            (retainer_height / 2)
            -
            (pla_wall_thickness / 2)
            +
            0.1
        ])

        cube([
            retainer_length + 2,
            cable_channel_width,
            cable_retainer_height
        ], center=true);




        // Screw hole

        translate([
            0,
            0,
            retainer_height / 2
        ])

        cylinder(
            d=m3_clearance_diameter,
            h=retainer_height + 2,
            center=true
        );

    }

}



SCOUT_Cable_Retainer_BLACK_V1();