// =======================================
// SCOUT Recon Rover V1
// Armour Shell YELLOW V1
// Independent File
// =======================================

$fn = 64;


// ===============================
// DIMENSIONS
// ===============================

// Main body size
shell_length = 190;
shell_width = 120;
shell_height = 75;


// Wall thickness
wall = 3;


// Track clearance
track_cutout_width = 45;


// Camera opening
camera_mount_radius = 18;



module SCOUT_Armour_Shell_YELLOW_V1(){


    difference(){


        // Outer shell
        translate([
            0,
            0,
            shell_height/2
        ])

        cube([
            shell_length,
            shell_width,
            shell_height
        ],
        center=true);



        // Hollow inside
        translate([
            0,
            0,
            shell_height/2 + wall
        ])

        cube([
            shell_length - wall*2,
            shell_width - wall*2,
            shell_height
        ],
        center=true);



        // Left track clearance

        translate([
            0,
            shell_width/2,
            25
        ])

        cube([
            shell_length,
            track_cutout_width,
            35
        ],
        center=true);



        // Right track clearance

        translate([
            0,
            -shell_width/2,
            25
        ])

        cube([
            shell_length,
            track_cutout_width,
            35
        ],
        center=true);



        // Camera opening

        translate([
            80,
            0,
            shell_height
        ])

        cylinder(
            d=camera_mount_radius*2,
            h=20,
            center=true
        );



    }


    // Front armour plate

    translate([
        shell_length/2 - 2,
        0,
        shell_height/2
    ])

    cube([
        4,
        shell_width,
        shell_height
    ],
    center=true);

}



SCOUT_Armour_Shell_YELLOW_V1();