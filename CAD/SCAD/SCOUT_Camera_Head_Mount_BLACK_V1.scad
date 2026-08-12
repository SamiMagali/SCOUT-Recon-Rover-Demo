// =======================================
// SCOUT Camera Head Mount BLACK V1
// Standalone Version
// =======================================

$fn = 48;


// ===============================
// LOCAL DIMENSIONS
// ===============================


head_mount_neck_width = 22;
head_mount_neck_depth = 18;
head_mount_neck_height = 18;


head_wire_pass_diameter = 8;

head_pivot_screw_diameter = 3.2;

m3_clearance_diameter = 3.4;

screw_edge_margin = 5;



// ===============================
// MODEL
// ===============================


module SCOUT_Camera_Head_Mount_BLACK_V1() {


    base_length = head_mount_neck_depth + 10;
    base_width = head_mount_neck_width + 16;

    base_height = 6;

    total_height =
        base_height
        + head_mount_neck_height;



    difference() {


        union() {


            // Base plate

            translate([
                0,
                0,
                base_height / 2
            ])

            cube([
                base_length,
                base_width,
                base_height
            ], center=true);



            // Neck

            translate([
                0,
                0,
                base_height + (head_mount_neck_height / 2)
            ])

            cube([
                head_mount_neck_depth,
                head_mount_neck_width,
                head_mount_neck_height
            ], center=true);

        }



        // Cable hole

        translate([
            0,
            0,
            total_height / 2
        ])

        cylinder(
            d=head_wire_pass_diameter,
            h=total_height + 2,
            center=true
        );



        // Pivot screw hole

        translate([
            0,
            0,
            total_height - 5
        ])

        cylinder(
            d=head_pivot_screw_diameter,
            h=12,
            center=true
        );



        // Mounting screws

        for(
            xoff=[
                -base_length * 0.25,
                 base_length * 0.25
            ]
        )

        translate([
            xoff,
            0,
            base_height / 2
        ])

        cylinder(
            d=m3_clearance_diameter,
            h=base_height + 2,
            center=true
        );

    }
}



SCOUT_Camera_Head_Mount_BLACK_V1();