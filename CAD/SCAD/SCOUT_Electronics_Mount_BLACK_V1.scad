// =======================================
// SCOUT Electronics Mount BLACK V1
// Standalone Version
// =======================================


$fn = 24;


// ===============================
// LOCAL DIMENSIONS
// ===============================


// Electronics board size
electronics_board_length = 70;
electronics_board_width = 45;


// PLA thickness
pla_wall_thickness = 3;


// Mount margins
electronics_mount_edge_margin = 5;


// Grid
electronics_mount_grid_pitch = 10;


// Mount holes
electronics_mount_hole_diameter = 3.4;



// ===============================
// MODEL
// ===============================


module SCOUT_Electronics_Mount_BLACK_V1() {


    plate_length =
        electronics_board_length
        + (electronics_mount_edge_margin * 2);


    plate_width =
        electronics_board_width;


    plate_height =
        pla_wall_thickness;



    difference() {



        // Main mounting plate

        translate([
            0,
            0,
            plate_height / 2
        ])

        cube([
            plate_length,
            plate_width,
            plate_height
        ], center=true);



        // Grid mounting holes

        cols =
            floor(
                (plate_length - electronics_mount_edge_margin * 2)
                /
                electronics_mount_grid_pitch
            );


        rows =
            floor(
                (plate_width - electronics_mount_edge_margin * 2)
                /
                electronics_mount_grid_pitch
            );


        start_x =
            -((cols * electronics_mount_grid_pitch) / 2);


        start_y =
            -((rows * electronics_mount_grid_pitch) / 2);



        for(i=[0:cols]) {

            for(j=[0:rows]) {


                translate([
                    start_x + (i * electronics_mount_grid_pitch),
                    start_y + (j * electronics_mount_grid_pitch),
                    plate_height / 2
                ])

                cylinder(
                    d=electronics_mount_hole_diameter,
                    h=plate_height + 2,
                    center=true
                );
            }
        }



        // Side cable openings

        for(side=[-1,1]) {


            translate([
                0,
                side * (plate_width / 2),
                plate_height / 2
            ])

            cube([
                plate_length / 2,
                10,
                plate_height + 2
            ], center=true);

        }

    }
}



SCOUT_Electronics_Mount_BLACK_V1();