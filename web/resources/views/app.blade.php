<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="shopify-api-key" content="{{ config('shopify.credentials.api_key') }}">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>
    <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
    <!-- Scripts -->
    @routes()
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>
<body class="font-sans antialiased">
@inertia
</body>
</html>
