<?php

namespace NDM\Bundle\TryCatch\ApiBundle\Controller;

use Symfony\Component\DependencyInjection\Container;

use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use Symfony\Component\HttpFoundation\Response;
use NDM\Bundle\TryCatch\ApiBundle\Ingester\Resource\StringResource;
use FOS\RestBundle\Controller\Annotations as FOS;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * @author davidmann
 *
 */
class ApiController extends Controller {

	/**
     * @param string $type The type of data being ingested (incidents, components)
     * @param string $_format The format to return the data in
     *
     * @FOS\View(templateVar="resources")
     *
	 * @ApiDoc(
	 *  resource=true,
	 *  description="Ingests data",
	 *  filters = {
	 *      { "name" = "data","dataType" = "string", "description" = "The data to be imported, urlencoded", "required" = "true" }
	 *  }
	 * )
	 */
	public function postIngestAction($type) {
		$ingester = $this->get(sprintf('ndm_try_catch.%s_ingester', $type), Container::NULL_ON_INVALID_REFERENCE);
		if($ingester === null) {
			throw $this->createNotFoundException(sprintf('Invalid ingester "%s"', $type), $e);
		}

		$data = stripslashes($_POST['data']);

		if(!$data) {
			throw $this->createNotFoundException('Invalid ingestment data');
		}

		$ingested = $ingester->ingest(new StringResource($data));

		$this->getDoctrine()->getEntityManager()->flush();

		return new Response(count($ingested));
	}
}