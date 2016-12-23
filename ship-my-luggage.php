<?php

    /*
     *  Plugin Name:  Ship My Luggage
     *  Description:  Functionality for Ship My Luggage
     *  Version:      0.0.3
     *  Author:       Lance Jernigan
     *  Author URI:   http://www.LanceJernigan.com
     */

?>

<?php

    /*
     * sml_init() - Initialize Ship My Luggage Plugin
     */

    function sml_init() {

        add_shortcode('sml_order', 'sml_order');

    }

    add_action('plugins_loaded', 'sml_init');

    /*
     * sml_enqueue() - Register Ship My Luggage scripts/styles for future use
     */

    function sml_enqueue() {

        wp_register_style('sml_order', untrailingslashit(plugin_dir_url(__FILE__)) . '/assets/css/sml-style.css');
        wp_register_script('sml_order', untrailingslashit(plugin_dir_url(__FILE__)) . '/assets/js/bundle.js');

    }

    add_action('wp_enqueue_scripts', 'sml_enqueue');

    /*
     * sml_order() - Callback for sml_order shortcode
     *
     *     return - string - string to replace shortcode
     */

    function sml_order() {

        wp_enqueue_style('sml_order');
        wp_enqueue_script('sml_order');

        wp_localize_script('sml_order', 'sml', [
            'ajax_url' => admin_url('admin-ajax.php')
        ]);

        return '<div id="mount"></div>';

    }

    /*
     * sml_valid_order() - Callback after sml_valid_order is called
     *
     *     params - $order_data - data sent from frontend
     *
     *     return - boolean - whether the order was successful or not
     */

    function sml_place_order($_order_data) {

        global $woocommerce;

        $errors = [];

        $order_data = apply_filters('pre_place_order');

        foreach ($order_data['products'] as $product) {

            $woocommerce->cart->add_to_cart($product['id'], $product['quantity'], 0, [], [
                'sml_price' => $product['price']
            ]);

        }

        return $errors;

    }

    add_filter('sml_place_order', 'sml_place_order', 10, 1);

    function sml_ajax_order() {

        $order_data = isset($_POST['orderData']) ? $_POST['orderData'] : false;

        if ($order_data === false) {

            wp_send_json([
                'errors' => [
                    'There was an error, please try again and notify us if the problem persists.'
                ]
            ]);

        };

        $errors = sml_place_order();

        wp_send_json([
            'errors' => $errors
        ]);

    }

    add_action('wp_ajax_sml_order', 'sml_ajax_order');

    /*
     * sml_before_calculate_totals() - adjust product prices based on item data
     */

    function sml_before_calculate_totals($cart_object) {

        global $woocommerce;

        $cart = $woocommerce->cart;

        foreach ($cart_object->cart_contents as $product) {

            $product['data']->price = $product['sml_price'];

        }

    }

    add_action('woocommerce_before_calculate_totals', 'sml_before_calculate_totals');

    function _log( $message ) {
        if( WP_DEBUG === true ){
            error_log("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*");
            foreach (func_get_args() as $arg) {
                if( is_array( $arg ) || is_object( $arg ) ){
                    error_log( print_r( $arg, true ) );
                } else {
                    error_log( $arg );
                }
            }
            error_log("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*");
        }
    }

?>