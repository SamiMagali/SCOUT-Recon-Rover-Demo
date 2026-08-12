// =======================================
// SCOUT Recon Rover V1
// Battery Tray BLACK V1
// Independent Version
// =======================================

$fn = 32;


// ================================
// DIMENSIONS
// ================================

// Battery placeholder size
battery_placeholder_length = 70;
battery_placeholder_width = 35;
battery_placeholder_height = 18;


// Printing clearances
battery_clearance = 1.5;


// Wall thickness
battery_tray_wall_thickness = 3;


// Retaining lip
battery_retaining_lip_height = 5;


// Strap slots
battery_strap_slot_width = 5;
battery_strap_slot_length = 25;



// ================================
// MODEL
// ================================

module SCOUT_Battery_Tray_BLACK_V1() {


    tray_outer_length =
        battery_placeholder_length
        + (battery_clearance * 2)
        + (battery_tray_wall_thickness * 2);


    tray_outer_width =
        battery_placeholder_width
        + (battery_clearance * 2)
        + (battery_tray_wall_thickness * 2);


    tray_height =
        battery_retaining_lip_height
        + battery_tray_wall_thickness;



    difference() {


        // Main tray
        translate([0,0,tray_height/2])
            cube(
                [
                tray_outer_length,
                tray_outer_width,
                tray_height
                ],
                center=true
            );



        // Battery cavity
        translate(
            [
            0,
            0,
            battery_tray_wall_thickness + tray_height/2
            ])
            cube(
                [
                battery_placeholder_length + battery_clearance,
                battery_placeholder_width + battery_clearance,
                tray_height
                ],
                center=true
            );



        // Strap holes

        slot_x = battery_placeholder_length * 0.28;


        for(xpos=[-slot_x,slot_x])
        {
            translate(
                [
                xpos,
                0,
                tray_height/2
                ])
                cube(
                    [
                    battery_strap_slot_width,
                    battery_strap_slot_length,
                    tray_height+2
                    ],
                    center=true
                );
        }

    }



    // Side retention rails

    for(side=[-1,1])
    {

        translate(
            [
            0,
            side*(tray_outer_width/2-1),
            battery_retaining_lip_height/2
            ])
            cube(
                [
                tray_outer_length,
                2,
                battery_retaining_lip_height
                ],
                center=true
            );

    }

}



SCOUT_Battery_Tray_BLACK_V1();