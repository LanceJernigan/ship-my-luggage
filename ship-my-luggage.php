<?php

    /*
     *  Plugin Name:  Ship My Luggage
     *  Description:  Functionality for Ship My Luggage
     *  Version:      0.0.29
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

        wp_register_script( 'stripe', 'https://js.stripe.com/v2/', '', '1.0', true );

    }

    add_action('wp_enqueue_scripts', 'sml_enqueue');

    /*
     * sml_order() - Callback for sml_order shortcode
     *
     *     return - string - string to replace shortcode
     */

    function sml_order() {

        wp_enqueue_script('sml_order');
        wp_enqueue_script('stripe');

        $stripeSettings = get_option('woocommerce_stripe_settings');

        wp_localize_script('sml_order', 'sml', [
            'ajax_url' => admin_url('admin-ajax.php'),
            'products' => get_sml_products(),
            'gettingStarted' => get_page_by_title('Getting Started'),
            'checkout' => get_sml_checkout_defaults(),
            'isLoggedIn' => is_user_logged_in() ? 'true' : 'false',
            'productMarkup' => get_option('sml_product_markup'),
            'stripePublishableKey' => 'yes' === $stripeSettings['testmode'] ? $stripeSettings['test_publishable_key'] : $stripeSettings['publishable_key']
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

        $shipping = sml_request_rates($products, $addresses);

        wp_send_json([
            'shipping' => $shipping
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
                $user_id = wc_create_new_customer($email, $username);

                wp_set_auth_cookie($user_id);

                $current_user = get_user_by('ID', $user_id);

            }

        }

        do_action('sml_new_user', $current_user->ID, $_checkout['fields']);

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

        update_post_meta($order->id, 'origin', $_order['addresses']['origin']);
        update_post_meta($order->id, 'destination', $_order['addresses']['destination']);
        update_post_meta($order->id, 'delivery_date', $_order['date']);
        update_post_meta($order->id, 'shipping_method', $_order['delivery']);

        $order->set_address($billing, 'billing');

        $order->calculate_totals();

        $available_gateways = WC()->payment_gateways->get_available_payment_gateways();
        $result = $available_gateways[ 'stripe' ]->process_payment( $order->id );

        if ($result['result'] === 'fail') {

            $errors[] = 'There was an error processing your card.  Please try again and contact us if the problem persists.';

        }

        wp_send_json([
            'errors' => $errors
        ]);

    }

    add_action('wp_ajax_sml_checkout', 'sml_ajax_checkout');
    add_action('wp_ajax_nopriv_sml_checkout', 'sml_ajax_checkout');

    function sml_update_user_billing($billing) {

        $user_id = get_current_user_id();

        foreach($billing as $key => $value) {

            if ($key === 'credit_card')
                continue;

            update_user_meta($user_id, $key, $value);
        }

    }

    add_action('sml_update_user_billing', 'sml_update_user_billing');

    /*
     *  sml_input_new_user_meta() - Input new user meta into database
     *
     *      args - $user_id - id of user
     *             $user_data - array of user data
     */

    function sml_input_new_user_meta($user_id, $user_data) {

        foreach ($user_data as $key => $val) {

            update_user_meta($user_id, $key, $val['value']);

        }

    }

    add_action('sml_new_user', 'sml_input_new_user_meta', 10, 2);

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

        foreach($billing as $key => $val) {

            $value = get_user_meta($user_id, $key, true);

            $billing[$key] = $value;

        }

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

        $international = strtolower($addresses['origin']['countryCode']) !== 'us' || strtolower($addresses['destination']['countryCode']) !== 'us';

        return apply_filters('sml_filter_product_rates', array_map(function($product)use($addresses, $international) {

            $product['shipping'] = apply_filters('sml_request_product_rates', [], $product, $addresses, $international);

            return $product;

        }, $products));

    }

    function sml_request_rate_fedex($rates, $product, $addresses, $international) {

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
                        isset($addresses['destination']['address_2']) ? $addresses['destination']['address_2'] : ''
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

            if ($response->HighestSeverity !== 'ERROR' && isset($response->RateReplyDetails)) {

                foreach ($response->RateReplyDetails as $rate) {

                    if ($international) {

                        _log($rate->RatedShipmentDetails->ShipmentRateDetail->TotalNetFedExCharge->Amount);

                        $rates[] = [
                            'deliveryDate' => isset($rate->DeliveryTimestamp) ? $rate->DeliveryTimestamp : date("Y-m-d h:i:s", mktime(0, 0, 0, date("m"), date("d")+7,   date("Y"))),
                            'type' => $rate->ServiceType,
                            'price' => $rate->RatedShipmentDetails->ShipmentRateDetail->TotalNetFedExCharge->Amount
                        ];

                    } else {

                        $rates[] = [
                            'deliveryDate' => isset($rate->DeliveryTimestamp) ? $rate->DeliveryTimestamp : date("Y-m-d h:i:s", mktime(0, 0, 0, date("m"), date("d")+7,   date("Y"))),
                            'type' => $rate->ServiceType,
                            'price' => $rate->RatedShipmentDetails->RatedPackages->PackageRateDetail->NetFedExCharge->Amount
                        ];

                    }

                }

            }

            return $rates;

        } catch (SoapFault $exception) {

            _log($exception, $client);

            return $rates;

        }

    }

    add_filter('sml_request_product_rates', 'sml_request_rate_fedex', 10, 4);

    /*
     * sml_filter_product_rates() - Filter product rates before returned to the Ajax request
     */

    function sml_filter_product_rates($products) {

        $shipping = [];

        foreach ($products as $product) {

            foreach ($product['shipping'] as $rate) {

                if (isset($rate['type']) && isset($rate['deliveryDate']) && isset($rate['price'])) {

                    if (!isset($shipping[$rate['type']])) {

                        $shipping[$rate['type']] = [
                            'name' => apply_filters('sml_rename_rate', $rate['type'], $rate),
                            'type' => $rate['type'],
                            'deliveryDate' => $rate['deliveryDate'],
                            'products' => []
                        ];

                    }

                    $shipping[$rate['type']]['products'][] = [
                        'id' => $product['id'],
                        'price' => $rate['price']
                    ];

                }

            }

        }

        $maxShipping = array_reduce($shipping, function ($max, $rate) {

            return count($rate['products']) > $max ? count($rate['products']) : $max;

        }, 0);

        return array_filter($shipping, function ($rate)use($maxShipping) {

            return count($rate['products']) === $maxShipping;

        });

    }

    add_filter('sml_filter_product_rates', 'sml_filter_product_rates', 10, 1);

    function sml_rename_rate($name, $rate) {

        $lookup = [
            'FEDEX_GROUND' => 'Fedex Ground'
        ];

        return isset($lookup[$rate['type']]) ? $lookup[$rate['type']] : $name;

    }

    add_filter('sml_rename_rate', 'sml_rename_rate', 10, 2);

    /*
     *  sml_product_settings() - Add a section to the Products tab in WooCommerce Settings
     *
     *      @params - $sections - $sections within the tab
     */

    function sml_product_section($sections) {

        $sections['sml'] = 'Ship My Luggage';

        return $sections;

    }

    add_filter( 'woocommerce_get_sections_products', 'sml_product_section' );

    function sml_product_settings($settings, $current_section) {

        if ($current_section === 'sml') {

            $settings = [
                [
                    'name' => 'Ship My Luggage',
                    'type' => 'title',
                    'desc' => 'The following options are used to configure Ship My Luggage',
                    'id' => 'sml_title'
                ]
            ];

            $settings[] = [
                'name' => 'Product Markup (percentage)',
                'desc_tip' => 'This will add a markup fee to each product before a user sees the price.',
                'id' => 'sml_product_markup',
                'type' => 'number'
            ];

            $settings[] = [
                'type' => 'sectionend',
                'id' => 'sml'
            ];

        }

        return $settings;

    }

    add_filter('woocommerce_get_settings_products', 'sml_product_settings', 10, 2);

    /*
     * sml_order_customer_details () - Custom Customer Details on Order
     *
     *     @params - $order - Order Data
     */

    function sml_order_customer_details($order) {

        $origin = get_post_meta($order->id, 'origin', true);
        $destination = get_post_meta($order->id, 'destination', true);
        $delivery_date = get_post_meta($order->id, 'delivery_date', true);

        include(untrailingslashit(plugin_dir_path(__FILE__)) . '/templates/order/customer-details.php');

    }

    add_action('woocommerce_order_details_after_customer_details', 'sml_order_customer_details');

    function sml_admin_order_details($order) {

        $origin = get_post_meta($order->id, 'origin', true);
        $destination = get_post_meta($order->id, 'destination', true);
        $delivery_date = get_post_meta($order->id, 'delivery_date', true);
        $shipping_method = get_post_meta($order->id, 'shipping_method', true);

        include(untrailingslashit(plugin_dir_path(__FILE__)) . '/templates/order/customer-details-admin.php');

    }

    add_action('woocommerce_admin_order_data_after_shipping_address', 'sml_admin_order_details');

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