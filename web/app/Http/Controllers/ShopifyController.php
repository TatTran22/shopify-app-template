<?php

namespace App\Http\Controllers;

use App\Lib\AuthRedirection;
use App\Lib\EnsureBilling;
use App\Models\Session;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Shopify\Auth\OAuth;
use Shopify\Clients\HttpHeaders;
use Shopify\Context;
use Shopify\Exception\InvalidWebhookException;
use Shopify\Utils;
use Shopify\Webhooks\Registry;
use Shopify\Webhooks\Topics;

class ShopifyController extends Controller
{

    /**
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function auth(Request $request)
    {
        $shop = Utils::sanitizeShopDomain($request->query('shop'));

        // Delete any previously created OAuth sessions that were not completed (don't have an access token)
        Session::where('shop', $shop)->where('access_token', null)->delete();

        return AuthRedirection::redirect($request);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Foundation\Application|\Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     * @throws \Psr\Http\Client\ClientExceptionInterface
     * @throws \Shopify\Exception\HttpRequestException
     * @throws \Shopify\Exception\InvalidArgumentException
     * @throws \Shopify\Exception\InvalidOAuthException
     * @throws \Shopify\Exception\OAuthCookieNotFoundException
     * @throws \Shopify\Exception\OAuthSessionNotFoundException
     * @throws \Shopify\Exception\PrivateAppException
     * @throws \Shopify\Exception\SessionStorageException
     * @throws \Shopify\Exception\UninitializedContextException
     * @throws \Shopify\Exception\WebhookRegistrationException
     */
    public function authCallback(Request $request)
    {
        $session = OAuth::callback(
            $request->cookie(),
            $request->query(),
            ['App\Lib\CookieHandler', 'saveShopifyCookie'],
        );

        $host = $request->query('host');
        $shop = Utils::sanitizeShopDomain($request->query('shop'));

        $response = Registry::register('/api/webhooks', Topics::APP_UNINSTALLED, $shop, $session->getAccessToken());
        if ($response->isSuccess()) {
            Log::debug("Registered APP_UNINSTALLED webhook for shop $shop");
        } else {
            Log::error(
                "Failed to register APP_UNINSTALLED webhook for shop $shop with response body: " .
                print_r($response->getBody(), true)
            );
        }

        $redirectUrl = Utils::getEmbeddedAppUrl($host);
        if (Config::get('shopify.billing.required')) {
            list($hasPayment, $confirmationUrl) = EnsureBilling::check($session, Config::get('shopify.billing'));

            if (!$hasPayment) {
                $redirectUrl = $confirmationUrl;
            }
        }

        return redirect($redirectUrl);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|void
     */
    public function webhooks(Request $request)
    {
        try {
            $topic = $request->header(HttpHeaders::X_SHOPIFY_TOPIC, '');

            $response = Registry::process($request->header(), $request->getContent());
            if (!$response->isSuccess()) {
                Log::error("Failed to process '$topic' webhook: {$response->getErrorMessage()}");
                return response()->json(['message' => "Failed to process '$topic' webhook"], 500);
            }
        } catch (InvalidWebhookException $e) {
            Log::error("Got invalid webhook request for topic '$topic': {$e->getMessage()}");
            return response()->json(['message' => "Got invalid webhook request for topic '$topic'"], 401);
        } catch (\Exception $e) {
            Log::error("Got an exception when handling '$topic' webhook: {$e->getMessage()}");
            return response()->json(['message' => "Got an exception when handling '$topic' webhook"], 500);
        }
    }

    /**
     * @param Request $request
     * @return false|\Illuminate\Contracts\Foundation\Application|\Illuminate\Foundation\Application|\Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector|string
     * @throws \Shopify\Exception\InvalidArgumentException
     */
    public function fallback(Request $request)
    {
        if (Context::$IS_EMBEDDED_APP && $request->query("embedded", false) === "1") {
            if (env('APP_ENV') === 'production') {
                return file_get_contents(public_path('index.html'));
            } else {
                return file_get_contents(base_path('frontend/index.html'));
            }
        } else {
            return redirect(Utils::getEmbeddedAppUrl($request->query("host", null)) . "/" . $request->path());
        }
    }
}
