// SCOUT Tracks BLACK V1
// Consolidated track engineering file
// Part of SCOUT Recon Rover V1
//
// Contains:
// - Printable track link system
// - Drive sprocket matched to track pitch
// - Free-rotating idler wheel
// - Reinforced left/right track frames
// - Assembly preview module
//
// This file replaces the separate final track files:
// - SCOUT_Track_Link_BLACK_V1.scad
// - SCOUT_Drive_Sprocket_BLACK_V1.scad
// - SCOUT_Idler_Wheel_BLACK_V1.scad
// - SCOUT_Track_Frame_BLACK_V1.scad
//
// All shared dimensions come from SCOUT_DIMENSION_MASTER.scad.

include <SCOUT_DIMENSION_MASTER.scad>

$fn = 64;

// Set true for a small print validation set.
// Set false for complete left/right track assembly preview.
track_test_mode = true;

// ==================================================
// TRACK LINK PARAMETERS
// ==================================================

track_link_count_test = 8;
track_loop_link_count = 25;

link_length = track_link_pitch;
link_width = track_width;
link_body_height = track_link_thickness;
link_lug_height = track_tread_lug_height;

hinge_hole_diameter = track_pin_diameter + track_pin_clearance;
hinge_outer_diameter = hinge_hole_diameter + 3.0;
hinge_barrel_length = link_width * 0.28;
hinge_side_gap = 0.7;

link_clearance_gap = 0.6;
link_corner_radius = 1.2;
link_body_length = link_length - hinge_outer_diameter - link_clearance_gap;
link_print_spacing = link_length + hinge_outer_diameter + 4;

sprocket_pocket_length = link_length * 0.42;
sprocket_pocket_width = link_width * 0.38;

// ==================================================
// SPROCKET AND IDLER PARAMETERS
// ==================================================

sprocket_teeth = 8;
sprocket_tooth_depth = 3.0;
sprocket_pitch_circumference = track_link_pitch * sprocket_teeth;
sprocket_pitch_diameter = sprocket_pitch_circumference / PI;
sprocket_pitch_radius = sprocket_pitch_diameter / 2;
sprocket_tooth_spacing = sprocket_pitch_circumference / sprocket_teeth;
sprocket_root_diameter = sprocket_pitch_diameter - (2 * sprocket_tooth_depth);
sprocket_outer_diameter = sprocket_pitch_diameter + (2 * sprocket_tooth_depth);
sprocket_thickness = track_width;
sprocket_axle_clearance_diameter = drive_sprocket_axle_diameter + rotating_clearance;
sprocket_hub_diameter = sprocket_axle_clearance_diameter + 10;
sprocket_hub_height = track_width;

idler_diameter = idler_wheel_outer_diameter;
idler_thickness = track_width;
idler_axle_clearance_diameter = idler_axle_diameter + rotating_clearance;
idler_hub_diameter = idler_axle_clearance_diameter + 9;
idler_hub_height = track_width;

wheel_center_z = track_axle_height;
drive_wheel_x = -track_wheelbase / 2;
idler_wheel_x = track_wheelbase / 2;

// ==================================================
// TRACK FRAME PARAMETERS
// ==================================================

frame_side_plate_thickness = pla_wall_thickness;
frame_side_plate_height = chassis_height - 4;
frame_side_plate_length = track_wheelbase + sprocket_outer_diameter;
frame_side_plate_width = pla_wall_thickness;
frame_outer_rail_offset = track_width / 2 + frame_side_plate_width / 2 + track_running_clearance;

frame_boss_length = 20;
frame_boss_width = 10;
frame_boss_height = 10;
frame_gusset_length = 22;
frame_gusset_thickness = pla_rib_thickness;

// Matches SCOUT_Core_Frame_BLACK_V1.scad attachment locations.
track_interface_x_spacing = track_wheelbase * 0.38;
track_frame_mount_x_positions = [-track_interface_x_spacing, track_interface_x_spacing];
track_side_y = track_center_to_center_width / 2;

// ==================================================
// MOTOR INTERFACE PARAMETERS
// ==================================================

motor_mount_plate_thickness = pla_wall_thickness;
motor_mount_plate_length = motor_placeholder_width + motor_mount_slot_length + 16;
motor_mount_plate_height = min(chassis_height - 4, motor_placeholder_height + motor_mount_vertical_adjustment + 4);
motor_mount_plate_x = drive_wheel_x + motor_mount_plate_length * 0.18;
motor_mount_plate_z = chassis_height - motor_mount_plate_height / 2 - 2;
motor_mount_plate_y = track_width / 2 + track_running_clearance + motor_mount_plate_thickness / 2;

motor_shaft_clearance_diameter = motor_placeholder_shaft_diameter + 6;
motor_slot_x_spacing = motor_mount_plate_length * 0.28;
motor_slot_z_spacing = motor_mount_plate_height * 0.22;
motor_horizontal_adjustment = motor_mount_slot_length;
motor_vertical_adjustment = motor_mount_vertical_adjustment;
motor_bridge_rib_thickness = pla_rib_thickness;
motor_bridge_rib_z = min(chassis_height - motor_bridge_rib_thickness / 2, wheel_center_z + sprocket_outer_diameter / 2 + 2);

// ==================================================
// BASIC HELPERS
// ==================================================

module rounded_rect_2d(length, width, radius) {
    hull() {
        for (x = [-1, 1]) {
            for (y = [-1, 1]) {
                translate([
                    x * (length / 2 - radius),
                    y * (width / 2 - radius)
                ])
                    circle(r = radius);
            }
        }
    }
}

module link_axle_hole(width) {
    rotate([90, 0, 0])
        cylinder(d = hinge_hole_diameter, h = width, center = true);
}

module m3_vertical_hole(height) {
    cylinder(d = m3_clearance_diameter, h = height, center = true);
}

module slot_through_y(length, width, depth) {
    hull() {
        translate([-length / 2 + width / 2, 0, 0])
            rotate([90, 0, 0])
                cylinder(d = width, h = depth, center = true);

        translate([length / 2 - width / 2, 0, 0])
            rotate([90, 0, 0])
                cylinder(d = width, h = depth, center = true);
    }
}

module vertical_slot_through_y(length, width, depth) {
    hull() {
        translate([0, 0, -length / 2 + width / 2])
            rotate([90, 0, 0])
                cylinder(d = width, h = depth, center = true);

        translate([0, 0, length / 2 - width / 2])
            rotate([90, 0, 0])
                cylinder(d = width, h = depth, center = true);
    }
}

// ==================================================
// A) TRACK LINK SYSTEM
// ==================================================

module track_link_body() {
    linear_extrude(height = link_body_height)
        rounded_rect_2d(link_body_length, link_width, link_corner_radius);
}

module track_link_tread_lugs() {
    lug_width = link_width * 0.18;
    lug_length = link_length * 0.72;

    for (ypos = [-link_width * 0.28, 0, link_width * 0.28]) {
        translate([0, ypos, link_body_height])
            cube([lug_length, lug_width, link_lug_height], center = true);
    }
}

module hinge_barrel(xpos, ypos, barrel_width) {
    translate([xpos, ypos, hinge_outer_diameter / 2])
        rotate([90, 0, 0])
            cylinder(d = hinge_outer_diameter, h = barrel_width, center = true);
}

module hinge_female_front() {
    xpos = link_length / 2;
    yoffset = link_width / 2 - hinge_barrel_length / 2;

    hinge_barrel(xpos, -yoffset, hinge_barrel_length);
    hinge_barrel(xpos,  yoffset, hinge_barrel_length);
}

module hinge_male_rear() {
    xpos = -link_length / 2;
    center_barrel_width = link_width - (2 * hinge_barrel_length) - (2 * hinge_side_gap);

    hinge_barrel(xpos, 0, center_barrel_width);
}

module hinge_hole_cuts() {
    for (xpos = [-link_length / 2, link_length / 2]) {
        translate([xpos, 0, hinge_outer_diameter / 2])
            link_axle_hole(link_width + 2);
    }
}

module sprocket_engagement_pocket() {
    translate([0, 0, link_body_height / 2])
        cube([
            sprocket_pocket_length,
            sprocket_pocket_width,
            link_body_height + 1
        ], center = true);
}

module SCOUT_Track_Link_BLACK_V1() {
    difference() {
        union() {
            track_link_body();
            track_link_tread_lugs();
            hinge_female_front();
            hinge_male_rear();
        }

        hinge_hole_cuts();
        sprocket_engagement_pocket();
    }
}

// ==================================================
// B) DRIVE SPROCKET
// ==================================================

module sprocket_tooth(angle) {
    rotate([0, 0, angle])
        translate([sprocket_pitch_radius, 0, 0])
            cube([
                sprocket_tooth_depth * 2,
                track_link_pitch * 0.36,
                sprocket_thickness
            ], center = true);
}

module SCOUT_Drive_Sprocket_BLACK_V1() {
    difference() {
        union() {
            cylinder(d = sprocket_root_diameter, h = sprocket_thickness, center = true);

            for (tooth = [0 : sprocket_teeth - 1]) {
                sprocket_tooth(tooth * 360 / sprocket_teeth);
            }

            cylinder(d = sprocket_hub_diameter, h = sprocket_hub_height, center = true);
        }

        cylinder(
            d = sprocket_axle_clearance_diameter,
            h = sprocket_hub_height + 2,
            center = true
        );
    }
}

// ==================================================
// C) IDLER WHEEL
// ==================================================

module SCOUT_Idler_Wheel_BLACK_V1() {
    difference() {
        union() {
            cylinder(d = idler_diameter, h = idler_thickness, center = true);
            cylinder(d = idler_hub_diameter, h = idler_hub_height, center = true);
        }

        cylinder(
            d = idler_axle_clearance_diameter,
            h = idler_hub_height + 2,
            center = true
        );
    }
}

// ==================================================
// D) TRACK FRAME
// ==================================================

module frame_outer_side_rail(side = 1) {
    translate([0, side * frame_outer_rail_offset, frame_side_plate_height / 2])
        cube([
            frame_side_plate_length,
            frame_side_plate_width,
            frame_side_plate_height
        ], center = true);
}

module frame_mount_bosses(side = 1) {
    for (xpos = track_frame_mount_x_positions) {
        translate([xpos, 0, frame_boss_height / 2])
            cube([frame_boss_length, frame_boss_width, frame_boss_height], center = true);
    }
}

module frame_gussets(side = 1) {
    for (xpos = track_frame_mount_x_positions) {
        for (xside = [-1, 1]) {
            translate([
                xpos + xside * frame_gusset_length / 2,
                side * frame_outer_rail_offset / 2,
                frame_boss_height + frame_gusset_length / 4
            ])
                rotate([0, xside * 45, 0])
                    cube([
                        frame_gusset_length,
                        frame_gusset_thickness,
                        frame_gusset_thickness
                    ], center = true);
        }
    }

    for (xpos = track_frame_mount_x_positions) {
        translate([
            xpos,
            side * frame_outer_rail_offset / 2,
            frame_boss_height / 2
        ])
            cube([
                frame_boss_length,
                frame_outer_rail_offset,
                frame_gusset_thickness
            ], center = true);
    }
}

module wheel_axle_bosses(side = 1) {
    for (xpos = [drive_wheel_x, idler_wheel_x]) {
        translate([xpos, side * frame_outer_rail_offset, wheel_center_z])
            rotate([90, 0, 0])
                cylinder(
                    d = sprocket_hub_diameter + 4,
                    h = frame_side_plate_width,
                    center = true
                );
    }
}

module motor_mount_interface_plate(side = 1) {
    translate([
        motor_mount_plate_x,
        -side * motor_mount_plate_y,
        motor_mount_plate_z
    ])
        cube([
            motor_mount_plate_length,
            motor_mount_plate_thickness,
            motor_mount_plate_height
        ], center = true);
}

module motor_mount_upper_ribs(side = 1) {
    rib_y_center = -side * motor_mount_plate_y / 2;
    rib_y_length = motor_mount_plate_y;

    for (xoff = [-motor_mount_plate_length * 0.32, motor_mount_plate_length * 0.32]) {
        translate([
            motor_mount_plate_x + xoff,
            rib_y_center,
            motor_bridge_rib_z
        ])
            cube([
                motor_bridge_rib_thickness,
                rib_y_length,
                motor_bridge_rib_thickness
            ], center = true);
    }

    translate([
        motor_mount_plate_x,
        rib_y_center,
        motor_mount_plate_z + motor_mount_plate_height / 2 - motor_bridge_rib_thickness / 2
    ])
        cube([
            motor_mount_plate_length,
            rib_y_length,
            motor_bridge_rib_thickness
        ], center = true);
}

module motor_mount_solid_features(side = 1) {
    motor_mount_interface_plate(side);
    motor_mount_upper_ribs(side);
}

module motor_mount_slot_cuts(side = 1) {
    plate_y = -side * motor_mount_plate_y;
    cut_depth = motor_mount_plate_thickness + 2;

    for (xoff = [-motor_slot_x_spacing, motor_slot_x_spacing]) {
        translate([
            motor_mount_plate_x + xoff,
            plate_y,
            wheel_center_z
        ])
            vertical_slot_through_y(
                motor_vertical_adjustment,
                motor_mount_slot_width,
                cut_depth
            );
    }

    for (zoff = [-motor_slot_z_spacing, motor_slot_z_spacing]) {
        translate([
            motor_mount_plate_x,
            plate_y,
            wheel_center_z + zoff
        ])
            slot_through_y(
                motor_horizontal_adjustment,
                motor_mount_slot_width,
                cut_depth
            );
    }

    translate([drive_wheel_x, plate_y, wheel_center_z])
        rotate([90, 0, 0])
            cylinder(
                d = motor_shaft_clearance_diameter,
                h = cut_depth,
                center = true
            );
}

module frame_hole_cuts(side = 1) {
    for (xpos = track_frame_mount_x_positions) {
        translate([xpos, 0, frame_boss_height / 2])
            m3_vertical_hole(frame_boss_height + 2);
    }

    translate([drive_wheel_x, side * frame_outer_rail_offset, wheel_center_z])
        rotate([90, 0, 0])
            cylinder(
                d = drive_sprocket_axle_diameter + rotating_clearance,
                h = frame_side_plate_width + 2,
                center = true
            );

    translate([idler_wheel_x, side * frame_outer_rail_offset, wheel_center_z])
        rotate([90, 0, 0])
            cylinder(
                d = idler_axle_diameter + rotating_clearance,
                h = frame_side_plate_width + 2,
                center = true
            );
}

module SCOUT_Track_Frame_BLACK_V1(side = 1) {
    difference() {
        union() {
            frame_outer_side_rail(side);
            frame_mount_bosses(side);
            frame_gussets(side);
            wheel_axle_bosses(side);
            motor_mount_solid_features(side);
        }

        frame_hole_cuts(side);
        motor_mount_slot_cuts(side);
    }
}

// ==================================================
// E) ASSEMBLY PREVIEW MODULES
// ==================================================

module preview_track_link_at(x, z, angle = 0) {
    translate([x, 0, z])
        rotate([0, angle, 0])
            SCOUT_Track_Link_BLACK_V1();
}

module preview_track_loop() {
    bottom_z = hinge_outer_diameter / 2;
    top_z = min(chassis_height - hinge_outer_diameter / 2, wheel_center_z + sprocket_pitch_radius);

    for (xpos = [-49 : track_link_pitch : 49]) {
        preview_track_link_at(xpos, bottom_z, 0);
    }

    for (xpos = [-42 : track_link_pitch : 42]) {
        preview_track_link_at(xpos, top_z, 180);
    }

    for (i = [0 : 4]) {
        angle = -72 + i * 18;
        translate([drive_wheel_x, 0, wheel_center_z])
            rotate([0, angle, 0])
                translate([sprocket_pitch_radius, 0, 0])
                    rotate([0, 90 + angle, 0])
                        SCOUT_Track_Link_BLACK_V1();

        translate([idler_wheel_x, 0, wheel_center_z])
            rotate([0, 108 + i * 18, 0])
                translate([sprocket_pitch_radius, 0, 0])
                    rotate([0, 90 + 108 + i * 18, 0])
                        SCOUT_Track_Link_BLACK_V1();
    }
}

module single_side_track_assembly(side = 1) {
    translate([0, side * track_side_y, 0]) {
        SCOUT_Track_Frame_BLACK_V1(side);

        translate([drive_wheel_x, 0, wheel_center_z])
            rotate([90, 0, 0])
                SCOUT_Drive_Sprocket_BLACK_V1();

        translate([idler_wheel_x, 0, wheel_center_z])
            rotate([90, 0, 0])
                SCOUT_Idler_Wheel_BLACK_V1();

        preview_track_loop();
    }
}

module complete_track_system_preview() {
    single_side_track_assembly(1);
    single_side_track_assembly(-1);
}

// ==================================================
// F) PRINT / TEST MODE
// ==================================================

module track_test_print_set() {
    for (i = [0 : track_link_count_test - 1]) {
        translate([i * link_print_spacing, 0, 0])
            SCOUT_Track_Link_BLACK_V1();
    }

    translate([0, link_width + 30, sprocket_thickness / 2])
        SCOUT_Drive_Sprocket_BLACK_V1();

    translate([sprocket_outer_diameter + idler_diameter / 2 + 18, link_width + 30, idler_thickness / 2])
        SCOUT_Idler_Wheel_BLACK_V1();
}

module SCOUT_Tracks_BLACK_V1() {
    if (track_test_mode) {
        track_test_print_set();
    } else {
        complete_track_system_preview();
    }
}

SCOUT_Tracks_BLACK_V1();
