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

        add_post_type_support('page', 'excerpt');

    }

    add_action('plugins_loaded', 'sml_init');

    /*
     *  sml_redirect() - function for redirecting ship my luggage requests
     */

    function sml_redirect() {

        if (is_page('checkout')) {

            wp_redirect(site_url('/?checkout=true'));

        }

    }

    add_action('template_redirect', 'sml_redirect');

    /*
     * sml_enqueue() - Register Ship My Luggage scripts/styles for future use
     */

    function sml_enqueue() {

        wp_enqueue_style('sml_order', untrailingslashit(plugin_dir_url(__FILE__)) . '/assets/css/sml-style.css');
        wp_register_script('sml_order', untrailingslashit(plugin_dir_url(__FILE__)) . '/assets/js/bundle.js');

    }

    add_action('wp_enqueue_scripts', 'sml_enqueue');

    /*
     * sml_order() - Callback for sml_order shortcode
     *
     *     return - string - string to replace shortcode
     */

    function sml_order() {

        wp_enqueue_script('sml_order');

        wp_localize_script('sml_order', 'sml', [
            'ajax_url' => admin_url('admin-ajax.php'),
            'products' => get_sml_products(),
            'gettingStarted' => get_page_by_title('Getting Started'),
            'checkout' => get_sml_checkout_defaults(),
            'isLoggedIn' => is_user_logged_in() ? 'true' : 'false'
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

    function sml_place_order($_order) {

        global $woocommerce;

        $errors = [];

        $order = apply_filters('pre_place_order', $_order);

        $woocommerce->cart->empty_cart();

        foreach ($order['products'] as $product) {

            if (isset($product['id']) && isset($product['quantity']) && isset($product['rates'])) {

                $rate = $product['rates'][$order['delivery']];

                $woocommerce->cart->add_to_cart($product['id'], $product['quantity'], 0, [], [
                    'sml_price' => $rate['price']
                ]);

            }

        }

        return $errors;

    }

    add_filter('sml_place_order', 'sml_place_order', 10, 1);

    /*
     * sml_ajax_product_pricing - Ajax pricing for products based on user input
     */

    function sml_ajax_product_pricing() {

        $products = isset($_POST['products']) ? $_POST['products'] : false;
        $addresses = isset($_POST['addresses']) ? $_POST['addresses'] : false;

        if ($products === false || $addresses === false) {

            wp_send_json([
                'errors' => [
                    'There was an error, please try again and notify us if the problem persists.'
                ]
            ]);

        };

        $rates = sml_request_rates($products, $addresses);

        wp_send_json([
            'rates' => $rates
        ]);

    }

    add_action('wp_ajax_sml_product_pricing', 'sml_ajax_product_pricing');
    add_action('wp_ajax_nopriv_sml_product_pricing', 'sml_ajax_product_pricing');

    /*
     * sml_ajax_order - Ajax order data from frontend
     */

    function sml_ajax_order() {

        $order = isset($_POST['order']) ? $_POST['order'] : false;

        if ($order === false) {

            wp_send_json([
                'errors' => [
                    'There was an error, please try again and notify us if the problem persists.'
                ]
            ]);

        };

        $errors = sml_place_order($order);

        wp_send_json([
            'errors' => $errors
        ]);

    }

    add_action('wp_ajax_sml_order', 'sml_ajax_order');
    add_action('wp_ajax_nopriv_sml_order', 'sml_ajax_order');

    /*
     * sml_ajax_checkout - Ajax checkout data from frontend
     */

    function sml_ajax_checkout() {

        $_checkout = isset($_POST['checkout']) ? $_POST['checkout'] : false;
        $_order = isset($_POST['order']) ? $_POST['order'] : false;

        if ($_checkout === false || $_order === false) {

            wp_send_json([
                'errors' => [
                    'There was an error, please try again and notify us if the problem persists.'
                ]
            ]);

        }

        $errors = [];
        $current_user = wp_get_current_user();

        if (! ($current_user instanceof WP_User) || $current_user->ID === 0) {

            $email = $_checkout['fields']['email']['value'];

            if (email_exists($email)) {

                wp_send_json([
                    'errors' => [
                        'It appears as though you already have an account, please log into your account to continue.'
                    ]
                ]);

            } else {

                $username = $_checkout['fields']['first_name']['value'] . $_checkout['fields']['last_name']['value'];
                $password = wp_generate_password($length = 12, true);
                $user_id = wp_create_user($username, $password, $email);\

                do_action('sml_new_user', $user_id, [
                    'first_name' => $_checkout['fields']['first_name']['value'],
                    'last_name' => $_checkout['fields']['last_name']['value'],
                    'phone' => $_checkout['fields']['phone']['value'],
                    'email' => $_checkout['fields']['email']['value']
                ]);

                wp_set_auth_cookie($user_id);

                $current_user = get_user_by('ID', $user_id);

            }

        }

        global $woocommerce;

        $cart = $woocommerce->cart;
        $order = wc_create_order(['customer_id' => $current_user->ID]);

        foreach ($cart->cart_contents as $key => $_product) {

            $product = $_product['data'];
            $product->price = $_product['sml_price'];

            $order->add_product($product, $_product['quantity']);

        }

        $billing = [
            'first_name' => $_checkout['fields']['first_name']['value'],
            'last_name' => $_checkout['fields']['last_name']['value'],
            'email' => $_checkout['fields']['email']['value'],
            'phone' => $_checkout['fields']['phone']['value'],
            'address_1' => $_checkout['fields']['address_1']['value'],
            'address_2' => $_checkout['fields']['address_2']['value'],
            'city' => $_checkout['fields']['city']['value'],
            'state' => $_checkout['fields']['state']['value'],
            'postcode' => $_checkout['fields']['postcode']['value'],
            'country' => $_checkout['fields']['country']['value'],
        ];

        if (isset($_checkout['update_billing']) && $_checkout['update_billing'] === true) {

            do_action('sml_update_user_billing', $current_user->ID, $billing);

        }

        update_post_meta($order->id, 'origin', $_order['addresses']['origin']['val']);
        update_post_meta($order->id, 'destination', $_order['addresses']['destination']['val']);

        $order->set_address($billing, 'billing');

        $order->calculate_totals();

        $available_gateways = WC()->payment_gateways->get_available_payment_gateways();
        $result = $available_gateways[ 'cheque' ]->process_payment( $order->id );

        if ($result['result'] === 'fail') {

            $errors[] = 'There was an error processing your card.  Please try again and contact us if the problem persists.';

        }

        wp_send_json([
            'errors' => $errors
        ]);

    }

    add_action('wp_ajax_sml_checkout', 'sml_ajax_checkout');
    add_action('wp_ajax_nopriv_sml_checkout', 'sml_ajax_checkout');

    /*
     *  sml_new_user() - Input new user meta into database
     *
     *      args - $user_id - id of user
     *             $user_data - array of user data
     */

    function sml_new_user($user_id, $user_meta) {

        foreach ($user_meta as $key => $val) {

            update_user_meta($user_id, $key, $val);

        }

    }

    add_action('sml_new_user', 'sml_new_user', 10, 2);

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

    /*
     * get_sml_products() - Get Ship My Luggage products
     *
     *      returns - array - products
     */

    function get_sml_products() {

        $args = [
            'post_type' => 'product',
            'posts_per_page' => -1,
            'orderby' => 'menu_order title',
            'order' => 'ASC'
        ];

        $query = new WP_Query($args);

        return array_map(function($product) {

            return apply_filters('filter_sml_product_data', $product);

        }, $query->get_posts());

    }

    /*
     * get_sml_checkout_defaults() - Get user default values for checkout
     *
     *      returns - array - user default values
     */

    function get_sml_checkout_defaults() {

        $user_id = get_current_user_id();
        $billing = [
            'first_name' => '',
            'last_name' => '',
            'email' => '',
            'phone' => '',
            'address_1' => '',
            'address_2' => '',
            'city' => '',
            'state' => '',
            'postcode' => '',
            'country' => '',
            '_active' => isset($_GET['checkout']) && $_GET['checkout'] === 'true' ? 'true' : 'false'
        ];

        if (! $user_id)
            return [];

        $user = get_user_by('ID', $user_id);
        $user_meta = get_user_meta($user_id);

        foreach($billing as $key => $val) {

            $value = get_user_meta($user_id, $key, true);

            if (count($value) > 0) {

                $billing[$key] = $value;

            }

        }

//        return [
//            'first_name' => 'Lance',
//            'last_name' => 'Jernigan',
//            'email' => 'lance.t.jernigan@gmail.com',
//            'phone' => '8653041322',
//            'address_1' => '5800 Central Avenue Pike',
//            'address_2' => 'Apt 5402',
//            'city' => 'Knoxville',
//            'state' => 'Tennessee',
//            'postcode' => '37912',
//            'country' => 'United States',
//            '_active' => isset($_GET['checkout']) && $_GET['checkout'] === 'true' ? 'true' : 'false'
//        ];

        return $billing;

    }

    function filter_sml_product_data($product) {

        $product_meta = get_post_meta($product->ID);

        return [
            'id' => $product->ID,
            'title' => $product->post_title,
            'content' => $product->post_content,
            'price' => wc_get_product($product->ID)->get_price(),
            'thumbnail' => wp_get_attachment_image_src(get_post_thumbnail_id($product->ID), 'single-post-thumbnail'),
            'dimensions' => [
                'width' => $product_meta['_width'][0],
                'height' => $product_meta['_height'][0],
                'length' => $product_meta['_length'][0],
                'weight' => $product_meta['_weight'][0],
            ]
        ];

    }

    add_filter('filter_sml_product_data', 'filter_sml_product_data');

    function sml_request_rates($products, $addresses) {

        return apply_filters('sml_filter_product_rates', array_map(function($product)use($addresses) {

            return sml_request_rate($product, $addresses);

        }, $products));

    }

    function sml_request_rate($product, $addresses) {

        require_once(untrailingslashit(plugin_dir_path(__FILE__)) . '/lib/fedex/fedex-common.php5');

        $wsdl = untrailingslashit(plugin_dir_path(__FILE__)) . '/lib/fedex/RateService_v20.wsdl';

        $client = new SoapClient($wsdl, ['trace' => 1]);

        $request['WebAuthenticationDetail'] = [
            'UserCredential' => [
                'Key' => getProperty('key'),                //  Need to have field on Backend
                'Password' => getProperty('password')       //  Need to have field on Backend
            ]
        ];

        $request['ClientDetail'] = [
            'AccountNumber' => getProperty('shipaccount'),  //  Need to have field on Backend
            'MeterNumber' => getProperty('meter')           //  Need to have field on Backend
        ];

        $request['TransactionDetail'] = [
            'CustomerTransactionId' => 'xxx'
        ];

        $request['Version'] = [
            'ServiceId' => 'crs',
            'Major' => '20',
            'Intermediate' => '0',
            'Minor' => '0'
        ];

        $request['ReturnTransitAndCommit'] = true;
        $request['VariableOptionsServiceOptionType'] = 'SATURDAY_DELIVERY';

        $request['RequestedShipment'] = [
            'Shipper' => [
                'Address' => [
                    'StreetLines' => [
                        $addresses['origin']['address_1'],
                        isset($addresses['origin']['address_2']) ? $addresses['origin']['address_2'] : ''
                    ],
                    'City' => $addresses['origin']['city'],
                    'State' => $addresses['origin']['state'],
                    'PostalCode' => $addresses['origin']['postcode'],
                    'CountryCode' => $addresses['origin']['countryCode']
                ]
            ],
            'Recipient' => [
                'Address' => [
                    'StreetLines' => [
                        $addresses['destination']['address_1'],
                        $addresses['destination']['address_2']
                    ],
                    'City' => $addresses['destination']['city'],
                    'State' => $addresses['destination']['state'],
                    'PostalCode' => $addresses['destination']['postcode'],
                    'CountryCode' => $addresses['destination']['countryCode']
                ]
            ],
            'PackageCount' => 1,
            'RequestedPackageLineItems' => [
                'GroupPackageCount' => 1,
                'Weight' => [
                    'Value' => $product['dimensions']['weight'],
                    'Units' => 'LB'
                ],
                'Dimensions' => [
                    'Length' => $product['dimensions']['length'],
                    'Width' => $product['dimensions']['width'],
                    'Height' => $product['dimensions']['height'],
                    'Units' => 'IN'
                ]
            ]
        ];

        $request['FreightShipmentDetail'] = [
            'Role' => 'SHIPPER'
        ];

        try {

            $response = $client->getRates($request);

            if ($response->HighestSeverity !== 'ERROR') {

                return apply_filters('sml_product_rate', $response->RateReplyDetails);

            }

        } catch (SoapFault $exception) {

            _log($exception, $client);

        }

    }

    /*
     *  sml_product_rate_filter() - Filter rates returned from FedEx
     */

    function sml_product_rate_filter($_rates) {

        $rates = [];

        $types = [
            'FIRST_OVERNIGHT' => 'First Overnight',
            'PRIORITY_OVERNIGHT' => 'Priority Overnight',
            'STANDARD_OVERNIGHT' => 'Standard Overnight',
            'FEDEX_2_DAY_AM' => 'Fedex 2 Day AM',
            'FEDEX_2_DAY' => 'Fedex 2 Day',
            'FEDEX_EXPRESS_SAVER' => 'Fedex Express Saver',
            'FEDEX_GROUND' => 'Fedex Ground'
        ];

        foreach ($_rates as $rate) {

            $rates[$rate->ServiceType] = [
                'delivery' => isset($rate->DeliveryTimestamp) ? $rate->DeliveryTimestamp : null,
                'type' => $rate->ServiceType,
                'title' => isset($types[$rate->ServiceType]) ? $types[$rate->ServiceType] : $rate->ServiceType,
                'price' => $rate->RatedShipmentDetails->RatedPackages->PackageRateDetail->NetFedExCharge->Amount
            ];

        }

        return $rates;

    }


    add_filter('sml_product_rate', 'sml_product_rate_filter', 10, 1);

    function sml_filter_product_rates($products) {

        return $products;

    }

    add_filter('sml_filter_product_rates', 'sml_filter_product_rates', 10, 1);

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