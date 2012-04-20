<?php
namespace NDM\TryCatchBundle\View;
use Symfony\Component\HttpFoundation\Response;

use FOS\Rest\Util\Codes;

use Symfony\Component\HttpFoundation\Request;

use FOS\RestBundle\View\View;

use FOS\RestBundle\View\ViewHandlerInterface;

use Symfony\Component\HttpKernel\Log\LoggerInterface;

class JsonpHandler {

    private $logger;

    public function __construct(LoggerInterface $logger = null)
    {
        $this->logger = $logger;
    }

    /**
     * Converts the viewdata to a RSS feed. Modify to suit your datastructure.
     * @return Response
     */
    public function createResponse(ViewHandlerInterface $handler, View $view, Request $request)
    {
        try {
        	$cb = $request->get('_callback', 'callback');

            $content = sprintf('%s(%s);', $cb, json_encode($view->getData()));
            $code = Codes::HTTP_OK;
        } catch (\Exception $e) {
            if ($this->logger) {
                $this->logger->addError($e);
            }

            $content = sprintf("%s:<br/><pre>%s</pre>", $e->getMessage(), $e->getTraceAsString());
            $code = Codes::HTTP_BAD_REQUEST;
        }

        return new Response($content, $code, $view->getHeaders());
    }

}