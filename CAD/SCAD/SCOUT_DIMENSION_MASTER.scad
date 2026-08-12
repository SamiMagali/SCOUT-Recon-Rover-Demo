// SCOUT Recon Rover V1
// Dimension Master
//
// This file contains shared measurements only.
// Do not create physical geometry in this file.
//
// All dimensions are in millimetres.

// ==================================================
// CAD WORKING DIMENSIONS
// ==================================================

// Black structural chassis actual CAD envelope.
// This is the load-bearing core frame, not just a limit.
chassis_length = 176;
chassis_width  = 132;
chassis_height = 42;

// Yellow removable armour actual CAD envelope.
// The shell must fit around the chassis and remain within project limits.
armour_length = 188;
armour_width  = 148;
armour_height = 54;

// Original competition/package maximum limits.
// These are retained for checks and future assertions.
max_chassis_length = 180;
max_chassis_width  = 140;
max_chassis_height = 45;

max_armour_length = 190;
max_armour_width  = 150;
max_armour_height = 55;

// ==================================================
// CLEARANCES AND PRINTING
// ==================================================

// General clearance between the black chassis and yellow armour shell.
// Applied per side where a sliding or removable fit is needed.
shell_clearance = 0.6;

// Default PLA wall thickness for structural printed parts.
pla_wall_thickness = 3.0;

// Thinner cosmetic wall for non-load-bearing armour surfaces.
pla_cosmetic_wall_thickness = 2.2;

// Minimum practical web/rib thickness for printed internal supports.
pla_rib_thickness = 2.0;

// Extra clearance for parts that need to slide together after printing.
sliding_clearance = 0.5;

// Extra clearance for loose rotating printed parts around metal axles.
rotating_clearance = 0.4;

// Small bevel/chamfer amount used to reduce sharp edges.
edge_relief = 1.0;

// ==================================================
// DEFAULT ASSEMBLY HARDWARE
// ==================================================

// SCOUT V1 uses M3 screws as default assembly hardware.
screw_standard = "M3";
screw_nominal_diameter = 3.0;

// Clearance hole for M3 screws through printed parts.
m3_clearance_diameter = 3.4;

// Pilot hole diameter for M3 screws cutting into PLA.
// Use carefully; heat-set inserts are preferred where available.
m3_pilot_diameter = 2.6;

// Optional heat-set insert reference size for future revisions.
m3_insert_outer_diameter = 4.6;
m3_insert_depth = 5.0;

// Typical M3 screw head clearance pocket.
m3_head_diameter = 6.2;
m3_head_height = 3.0;

// Default spacing from part edges to screw centres.
screw_edge_margin = 6.0;

// ==================================================
// TRACK SYSTEM PARAMETERS
// ==================================================

// Required track width.
track_width = 26;

// Track link pitch, measured pin-to-pin along the track path.
track_link_pitch = 14;

// Approximate printable track link body thickness.
track_link_thickness = 5;

// Track lug height for ground grip.
track_tread_lug_height = 2;

// Diameter of the hinge pin or screw used between track links.
track_pin_diameter = 2.0;

// Clearance around the hinge pin for reliable movement.
track_pin_clearance = 0.3;

// Drive sprocket outside diameter target.
drive_sprocket_outer_diameter = 40;

// Drive sprocket axle diameter placeholder.
drive_sprocket_axle_diameter = 4;

// Idler wheel outside diameter target.
idler_wheel_outer_diameter = 36;

// Idler axle diameter placeholder.
idler_axle_diameter = 4;

// Approximate distance between front and rear track wheel centres.
track_wheelbase = 118;

// Vertical offset from chassis bottom to wheel axle centreline.
// Lowered so the sprocket/idler tops do not nearly touch the chassis height limit.
track_axle_height = 17;

// Side-to-side centre distance between left and right track assemblies.
// Tracks sit slightly outside the 132 mm chassis envelope but inside the 148 mm armour envelope.
track_center_to_center_width = 112;

// Clearance between rotating track parts and fixed chassis/armour surfaces.
track_running_clearance = 2.0;

// ==================================================
// MOTOR PLACEHOLDER PARAMETERS
// ==================================================

// Exact DC geared motor model is not confirmed.
// These values are placeholders for clearance envelopes only.
// Final motor holes must not be locked until the motor model is confirmed.
motor_model_confirmed = false;

motor_placeholder_length = 48;
motor_placeholder_width  = 24;
motor_placeholder_height = 24;

// Placeholder round gearbox/body diameter for common TT/N20-style gearmotors.
motor_placeholder_body_diameter = 24;

// Placeholder motor shaft diameter.
motor_placeholder_shaft_diameter = 4;

// Placeholder shaft length outside motor body.
motor_placeholder_shaft_length = 10;

// Adjustable slot dimensions for future motor mount geometry.
motor_mount_slot_length = 18;
motor_mount_slot_width = m3_clearance_diameter;

// Vertical adjustment range to tune motor shaft height.
motor_mount_vertical_adjustment = 8;

// Clearance around the motor body so different models can be trial fitted.
motor_body_clearance = 1.0;

// ==================================================
// BATTERY PLACEHOLDER PARAMETERS
// ==================================================

// AA battery pack dimensions vary by holder.
// These are editable placeholders for a low central battery tray.
battery_placeholder_length = 70;
battery_placeholder_width  = 58;
battery_placeholder_height = 18;

// Clearance around battery pack for easy removal.
battery_clearance = 1.5;

// Retaining strap slot dimensions for Velcro, zip ties, or printed straps.
battery_strap_slot_width = 6;
battery_strap_slot_length = 24;

// Recommended battery tray wall and lip dimensions.
battery_tray_wall_thickness = pla_wall_thickness;
battery_retaining_lip_height = 4;

// ==================================================
// ELECTRONICS MOUNTING PARAMETERS
// ==================================================

// Editable board envelope for Arduino Grove Beginner Kit or similar.
electronics_board_length = 90;
electronics_board_width  = 70;
electronics_board_height = 16;

// Clearance above electronics for headers, jumpers, and cables.
electronics_top_clearance = 12;

// Generic mounting hole spacing for a grid-based electronics plate.
electronics_mount_grid_pitch = 10;

// Generic hole diameter for M3-compatible electronics mounting slots.
electronics_mount_hole_diameter = m3_clearance_diameter;

// Minimum edge margin around electronics mounting holes.
electronics_mount_edge_margin = 8;

// Cable channel width for routing wires away from tracks.
cable_channel_width = 8;

// Cable retainer clearance height.
cable_retainer_height = 5;

// ==================================================
// CAMERA HEAD AND CHASSIS MOUNT PARAMETERS
// ==================================================

// The camera head attaches to the black chassis/head mount.
// It must not rely on the yellow armour shell for structural support.
head_mount_attaches_to_chassis = true;

// Compact camera head envelope.
camera_head_width  = 54;
camera_head_depth  = 34;
camera_head_height = 32;

// Placeholder front camera opening.
camera_aperture_diameter = 16;

// Neck/pedestal dimensions for the black chassis-mounted head support.
head_mount_neck_width = 24;
head_mount_neck_depth = 20;
head_mount_neck_height = 18;

// Future pivot screw diameter for optional rotation.
head_pivot_screw_diameter = m3_clearance_diameter;

// Wire pass-through from chassis to head.
head_wire_pass_diameter = 8;

// Clearance between head support and armour opening.
head_to_armour_clearance = 1.0;

// ==================================================
// BRANDING PARAMETERS
// ==================================================

brand_main_text = "SCOUT";
brand_sub_text = "S.MAGALI ROBOTICS";
brand_version_text = "PROTOTYPE V1";

// Franklin Gothic requested where available.
// Change this if OpenSCAD cannot find the font on the local system.
brand_font = "Franklin Gothic";

brand_main_text_height = 10;
brand_sub_text_height = 4;
brand_version_text_height = 3;

// Emboss/recess depth for text fused into armour geometry.
brand_text_depth = 0.8;

// ==================================================
// DERIVED CHECK VALUES
// ==================================================

// Internal armour space after accounting for shell clearance only.
// Wall thickness will be handled by the armour shell file.
armour_internal_clear_length = chassis_length + (2 * shell_clearance);
armour_internal_clear_width  = chassis_width  + (2 * shell_clearance);
armour_internal_clear_height = chassis_height + shell_clearance;

// Useful half dimensions for centered modelling in part files.
chassis_half_length = chassis_length / 2;
chassis_half_width  = chassis_width / 2;
chassis_half_height = chassis_height / 2;

armour_half_length = armour_length / 2;
armour_half_width  = armour_width / 2;
armour_half_height = armour_height / 2;

track_half_width = track_width / 2;

// Sanity checks expressed as variables for future assertion use.
chassis_within_limit =
    chassis_length <= max_chassis_length &&
    chassis_width  <= max_chassis_width &&
    chassis_height <= max_chassis_height;

armour_within_limit =
    armour_length <= max_armour_length &&
    armour_width  <= max_armour_width &&
    armour_height <= max_armour_height;
