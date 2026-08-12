// =======================================
// SCOUT Camera Head YELLOW V1
// Standalone Test Version
// Rotating camera housing
// =======================================


$fn = 64;


// ===============================
// DIMENSIONS
// ===============================

// Camera shell
camera_head_width = 55;
camera_head_depth = 55;
camera_head_height = 45;


// Camera lens
camera_aperture_diameter = 18;


// Neck mount
head_mount_neck_width = 22;
head_mount_neck_depth = 18;
head_mount_neck_height = 18;


// Wiring
head_wire_pass_diameter = 8;


// Assembly clearance
sliding_clearance = 0.5;



// ===============================
// MODEL
// ===============================


module SCOUT_Camera_Head_YELLOW_V1() {

    difference() {


        // Main external camera housing
        hull() {

            translate([
                0,
                0,
                camera_head_height / 2
            ])
            cube([
                camera_head_depth,
                camera_head_width,
                camera_head_height
            ], center=true);



            // top camera bump
            translate([
                camera_head_depth / 2 - 2,
                0,
                camera_head_height - 2
            ])
            cube([
                4,
                camera_head_width + 4,
                4
            ], center=true);

        }



        // Neck socket

        translate([
            0,
            0,
            head_mount_neck_height / 2 - 0.1
        ])

        cube([
            head_mount_neck_depth + sliding_clearance,
            head_mount_neck_width + sliding_clearance,
            head_mount_neck_height
        ], center=true);



        // Camera lens hole

        translate([
            camera_head_depth / 2 + 1,
            0,
            camera_head_height / 2 + 2
        ])

        rotate([
            0,
            90,
            0
        ])

        cylinder(
            d=camera_aperture_diameter,
            h=25,
            center=true
        );



        // Electronics cavity

        translate([
            0,
            0,
            camera_head_height / 2 + 5
        ])

        cube([
            camera_head_depth - 8,
            camera_head_width - 8,
            camera_head_height - 10
        ], center=true);



        // Wire channel

        translate([
            0,
            0,
            camera_head_height / 2
        ])

        cylinder(
            d=head_wire_pass_diameter,
            h=camera_head_height + 2,
            center=true
        );

    }
}



SCOUT_Camera_Head_YELLOW_V1();