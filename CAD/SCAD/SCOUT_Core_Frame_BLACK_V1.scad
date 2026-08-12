// SCOUT Core Frame BLACK V1
// Structural chassis
// Part of SCOUT Recon Rover V1
//
// Purpose:
// - Carry DC geared motors
// - Carry future left/right track assemblies
// - Support battery and Arduino/Grove electronics space
// - Provide black chassis-mounted camera/head interface
// - Provide removable yellow armour shell attachment points
//
// The yellow armour is cosmetic/protective and is not structural.
//
// All shared dimensions come from SCOUT_DIMENSION_MASTER.scad.

include <SCOUT_DIMENSION_MASTER.scad>

$fn = 48;

// ==================================================
// LOCAL DERIVED CHASSIS VALUES
// ==================================================

frame_floor_thickness = pla_wall_thickness;
frame_rail_height = chassis_height;
frame_rail_width = pla_wall_thickness * 2;
frame_crossmember_width = pla_wall_thickness * 2;
frame_rib_height = chassis_height * 0.55;
frame_rib_width = pla_rib_thickness;

central_bay_length = battery_placeholder_length + (2 * battery_clearance) + 16;
central_bay_width = electronics_board_width + (2 * sliding_clearance);

motor_interface_plate_length = motor_placeholder_length + motor_body_clearance * 2;
motor_interface_plate_width = pla_wall_thickness * 2;
motor_interface_plate_height = motor_placeholder_height + motor_mount_vertical_adjustment;

track_interface_boss_length = 16;
track_interface_boss_width = pla_wall_thickness * 2;
track_interface_boss_height = 10;
track_interface_x_spacing = track_wheelbase * 0.38;

head_mount_base_length = head_mount_neck_depth + 10;
head_mount_base_width = head_mount_neck_width + 16;
head_mount_base_height = 6;
head_mount_x = chassis_half_length - head_mount_base_length / 2 - screw_edge_margin;

armour_boss_diameter = m3_head_diameter + pla_wall_thickness;
armour_boss_height = 7;
armour_boss_x = chassis_half_length - screw_edge_margin - armour_boss_diameter / 2;
armour_boss_y = chassis_half_width - screw_edge_margin - armour_boss_diameter / 2;

track_inner_edge_y = track_center_to_center_width / 2 - track_width / 2;
track_relief_clearance = track_running_clearance;
track_relief_inner_y = track_inner_edge_y - track_relief_clearance;
track_relief_width = chassis_half_width - track_relief_inner_y;
track_relief_center_y = track_relief_inner_y + track_relief_width / 2;
track_relief_length = track_wheelbase + drive_sprocket_outer_diameter + (2 * track_running_clearance);
track_relief_height = min(
    chassis_height,
    track_axle_height + drive_sprocket_outer_diameter / 2 + track_running_clearance
);
relief_reinforcement_rail_y = track_relief_inner_y - pla_wall_thickness / 2;

// ==================================================
// BASIC HELPERS
// ==================================================

module rounded_slot_2d(length, width) {
    hull() {
        translate([-length / 2 + width / 2, 0, 0])
            circle(d = width);
        translate([ length / 2 - width / 2, 0, 0])
            circle(d = width);
    }
}

module vertical_slot_cut(length, width, height) {
    linear_extrude(height = height, center = true)
        rounded_slot_2d(length, width);
}

module side_vertical_slot_cut(length, width, depth) {
    hull() {
        translate([0, 0, -length / 2 + width / 2])
            rotate([90, 0, 0])
                cylinder(d = width, h = depth, center = true);

        translate([0, 0, length / 2 - width / 2])
            rotate([90, 0, 0])
                cylinder(d = width, h = depth, center = true);
    }
}

module m3_vertical_clearance(height) {
    cylinder(d = m3_clearance_diameter, h = height, center = true);
}

module m3_head_counterbore(height) {
    cylinder(d = m3_head_diameter, h = height, center = true);
}

// ==================================================
// STRUCTURAL BODY MODULES
// ==================================================

module chassis_floor() {
    translate([0, 0, frame_floor_thickness / 2])
        cube([chassis_length, chassis_width, frame_floor_thickness], center = true);
}

module side_rails() {
    for (side = [-1, 1]) {
        translate([0, side * (chassis_half_width - frame_rail_width / 2), frame_rail_height / 2])
            cube([chassis_length, frame_rail_width, frame_rail_height], center = true);
    }
}

module crossmembers() {
    for (end = [-1, 1]) {
        translate([end * (chassis_half_length - frame_crossmember_width / 2), 0, frame_rail_height / 2])
            cube([frame_crossmember_width, chassis_width, frame_rail_height], center = true);
    }
}

module internal_ribs() {
    rib_x_positions = [
        -central_bay_length / 2,
         central_bay_length / 2
    ];

    for (xpos = rib_x_positions) {
        translate([xpos, 0, frame_floor_thickness + frame_rib_height / 2])
            cube([frame_rib_width, central_bay_width, frame_rib_height], center = true);
    }

    for (side = [-1, 1]) {
        translate([0, side * (central_bay_width / 2), frame_floor_thickness + frame_rib_height / 2])
            cube([central_bay_length, frame_rib_width, frame_rib_height], center = true);
    }
}

module track_relief_reinforcement_ribs() {
    for (side = [-1, 1]) {
        translate([
            0,
            side * relief_reinforcement_rail_y,
            frame_floor_thickness + frame_rib_height / 2
        ])
            cube([
                track_relief_length,
                pla_wall_thickness,
                frame_rib_height
            ], center = true);

        for (xpos = [-track_interface_x_spacing, 0, track_interface_x_spacing]) {
            translate([
                xpos,
                side * ((central_bay_width / 2 + relief_reinforcement_rail_y) / 2),
                frame_floor_thickness + frame_rib_height / 2
            ])
                cube([
                    frame_rib_width,
                    relief_reinforcement_rail_y - central_bay_width / 2,
                    frame_rib_height
                ], center = true);
        }
    }
}

module motor_interface_pads() {
    motor_x = -chassis_half_length + screw_edge_margin + motor_interface_plate_length / 2;

    for (side = [-1, 1]) {
        translate([
            motor_x,
            side * (chassis_half_width - frame_rail_width - motor_interface_plate_width / 2),
            frame_floor_thickness + motor_interface_plate_height / 2
        ])
            cube([
                motor_interface_plate_length,
                motor_interface_plate_width,
                motor_interface_plate_height
            ], center = true);
    }
}

module track_frame_attachment_bosses() {
    for (side = [-1, 1]) {
        track_y = side * (track_center_to_center_width / 2);

        for (xpos = [-track_interface_x_spacing, track_interface_x_spacing]) {
            translate([
                xpos,
                track_y,
                frame_floor_thickness + track_interface_boss_height / 2
            ])
                cube([
                    track_interface_boss_length,
                    track_interface_boss_width,
                    track_interface_boss_height
                ], center = true);
        }
    }
}

module head_mount_chassis_base() {
    if (head_mount_attaches_to_chassis) {
        translate([head_mount_x, 0, chassis_height - head_mount_base_height / 2])
            cube([
                head_mount_base_length,
                head_mount_base_width,
                head_mount_base_height
            ], center = true);
    }
}

module armour_mount_bosses() {
    for (xside = [-1, 1]) {
        for (yside = [-1, 1]) {
            translate([
                xside * armour_boss_x,
                yside * armour_boss_y,
                chassis_height - armour_boss_height / 2
            ])
                cylinder(d = armour_boss_diameter, h = armour_boss_height, center = true);
        }
    }
}

module chassis_solid_features() {
    union() {
        chassis_floor();
        side_rails();
        crossmembers();
        internal_ribs();
        track_relief_reinforcement_ribs();
        motor_interface_pads();
        head_mount_chassis_base();
    }
}

// ==================================================
// CUT FEATURES
// ==================================================

module motor_adjustment_slot_cuts() {
    motor_x = -chassis_half_length + screw_edge_margin + motor_interface_plate_length / 2;
    slot_x_offsets = [
        -motor_interface_plate_length * 0.25,
         motor_interface_plate_length * 0.25
    ];

    for (side = [-1, 1]) {
        for (xoff = slot_x_offsets) {
            translate([
                motor_x + xoff,
                side * (chassis_half_width - frame_rail_width - motor_interface_plate_width / 2),
                frame_floor_thickness + motor_interface_plate_height / 2
            ])
                side_vertical_slot_cut(
                    motor_mount_vertical_adjustment,
                    motor_mount_slot_width,
                    motor_interface_plate_width + 2
                );
        }
    }
}

module track_clearance_relief_cuts() {
    for (side = [-1, 1]) {
        translate([
            0,
            side * track_relief_center_y,
            track_relief_height / 2
        ])
            cube([
                track_relief_length,
                track_relief_width,
                track_relief_height + 0.4
            ], center = true);
    }
}

module track_attachment_hole_cuts() {
    for (side = [-1, 1]) {
        track_y = side * (track_center_to_center_width / 2);

        for (xpos = [-track_interface_x_spacing, track_interface_x_spacing]) {
            translate([
                xpos,
                track_y,
                frame_floor_thickness + track_interface_boss_height / 2
            ])
                m3_vertical_clearance(track_interface_boss_height + frame_floor_thickness + 2);
        }
    }
}

module head_mount_hole_cuts() {
    if (head_mount_attaches_to_chassis) {
        hole_x_offsets = [
            -head_mount_base_length * 0.25,
             head_mount_base_length * 0.25
        ];

        for (xoff = hole_x_offsets) {
            translate([
                head_mount_x + xoff,
                0,
                chassis_height - head_mount_base_height / 2
            ])
                m3_vertical_clearance(head_mount_base_height + 4);
        }

        translate([
            head_mount_x,
            0,
            chassis_height - head_mount_base_height / 2
        ])
            cylinder(d = head_wire_pass_diameter, h = head_mount_base_height + 4, center = true);
    }
}

module armour_mount_hole_cuts() {
    for (xside = [-1, 1]) {
        for (yside = [-1, 1]) {
            translate([
                xside * armour_boss_x,
                yside * armour_boss_y,
                chassis_height - armour_boss_height / 2
            ])
                m3_vertical_clearance(armour_boss_height + 4);

            translate([
                xside * armour_boss_x,
                yside * armour_boss_y,
                chassis_height - m3_head_height / 2
            ])
                m3_head_counterbore(m3_head_height + 0.4);
        }
    }
}

module floor_service_cuts() {
    battery_slot_x = battery_placeholder_length * 0.28;

    for (xpos = [-battery_slot_x, battery_slot_x]) {
        translate([xpos, 0, frame_floor_thickness / 2])
            vertical_slot_cut(
                battery_strap_slot_length,
                battery_strap_slot_width,
                frame_floor_thickness + 1
            );
    }

    translate([0, 0, frame_floor_thickness / 2])
        vertical_slot_cut(
            cable_channel_width * 2,
            cable_channel_width,
            frame_floor_thickness + 1
        );
}

module all_cut_features() {
    union() {
        track_clearance_relief_cuts();
        motor_adjustment_slot_cuts();
        head_mount_hole_cuts();
        floor_service_cuts();
    }
}

module preserved_track_mounting_points() {
    difference() {
        track_frame_attachment_bosses();
        track_attachment_hole_cuts();
    }
}

module preserved_armour_mounting_points() {
    difference() {
        armour_mount_bosses();
        armour_mount_hole_cuts();
    }
}

// ==================================================
// FINAL PART
// ==================================================

module SCOUT_Core_Frame_BLACK_V1() {
    union() {
        difference() {
            chassis_solid_features();
            all_cut_features();
        }

        preserved_track_mounting_points();
        preserved_armour_mounting_points();
    }
}

SCOUT_Core_Frame_BLACK_V1();
