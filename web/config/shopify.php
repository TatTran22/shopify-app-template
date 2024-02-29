<?php

use App\Lib\EnsureBilling;

return [

    /*
    |--------------------------------------------------------------------------
    | Shopify billing
    |--------------------------------------------------------------------------
    |
    | You may want to charge merchants for using your app. Setting required to true will cause the EnsureShopifySession
    | middleware to also ensure that the session is for a merchant that has an active one-time payment or subscription.
    | If no payment is found, it starts off the process and sends the merchant to a confirmation URL so that they can
    | approve the purchase.
    |
    | Learn more about billing in our documentation: https://shopify.dev/docs/apps/billing
    |
    */
    "billing" => [
        "required" => false,

        // Example set of values to create a charge for $5 one time
        "chargeName" => "My Shopify App One-Time Billing",
        "amount" => 5.0,
        "currencyCode" => "USD", // Currently only supports USD
        "interval" => EnsureBilling::INTERVAL_ONE_TIME,
    ],
    'credentials' => [
        'api_key' => env('SHOPIFY_APP_CLIENT_ID'),
        'api_secret' => env('SHOPIFY_APP_CLIENT_SECRET'),
    ],
    'custom_domain' => env('SHOP_CUSTOM_DOMAIN', null),
    'scopes' => [
        'read_products',
        'write_products',
    ],
];
