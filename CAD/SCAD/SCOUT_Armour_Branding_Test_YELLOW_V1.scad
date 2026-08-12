// =======================================
// SCOUT Armour Branding Test YELLOW V1
// Standalone Version
// =======================================

$fn = 48;


// ===============================
// LOCAL DIMENSIONS
// ===============================

pla_wall_thickness = 3;


// Branding
brand_main_text = "SCOUT";
brand_sub_text = "SAMI M.";
brand_version_text = "V1";

brand_font = "Liberation Sans:style=Bold";

brand_text_depth = 0.8;

brand_main_text_height = 12;
brand_sub_text_height = 6;
brand_version_text_height = 5;



// ===============================
// MODEL
// ===============================


module SCOUT_Armour_Branding_Test_YELLOW_V1() {


    plaque_width = 90;
    plaque_length = 50;
    plaque_height = pla_wall_thickness;



    difference() {


        // Main plaque

        translate([
            0,
            0,
            plaque_height / 2
        ])

        cube([
            plaque_length,
            plaque_width,
            plaque_height
        ], center=true);



        // Main branding

        translate([
            0,
            10,
            plaque_height - brand_text_depth + 0.1
        ])

        linear_extrude(
            brand_text_depth + 1
        )

        text(
            brand_main_text,
            font=brand_font,
            size=brand_main_text_height,
            halign="center",
            valign="center"
        );



        // Subtitle

        translate([
            0,
            -3,
            plaque_height - brand_text_depth + 0.1
        ])

        linear_extrude(
            brand_text_depth + 1
        )

        text(
            brand_sub_text,
            font=brand_font,
            size=brand_sub_text_height,
            halign="center",
            valign="center"
        );



        // Version

        translate([
            0,
            -12,
            plaque_height - brand_text_depth + 0.1
        ])

        linear_extrude(
            brand_text_depth + 1
        )

        text(
            brand_version_text,
            font=brand_font,
            size=brand_version_text_height,
            halign="center",
            valign="center"
        );
    }
}



SCOUT_Armour_Branding_Test_YELLOW_V1();