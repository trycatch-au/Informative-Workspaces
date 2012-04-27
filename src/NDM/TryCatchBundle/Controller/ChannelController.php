<?php

namespace NDM\TryCatchBundle\Controller;
use NDM\TryCatchBundle\Entity\Channel;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use FOS\RestBundle\Controller\Annotations as FOS;

/**
 * @author davidmann
 *
 * @ApiDoc(
 *  description="Channel Resource"
 * )
 */
class ChannelController extends Controller {

	/**
     * @param string $_format The format to return the data in
	 * @ApiDoc(
	 *  resource=true,
	 *  description="List all available release channels"
	 * )
	 *
	 * @FOS\View(templateVar="channels")
	 */
	public function getChannelsAction() {
		return $this->get('ndm_try_catch.model.channel_finder')
				->findAllAsArray();
	}

	/**
     * @param scalar $idOrName The name or id of the channel
     * @param string $_format The format to return the data in
     *
	 * @ApiDoc(
	 *  resource=true,
	 *  description="List a single available channel and it's components"
	 * )
	 * @FOS\View(templateVar="channel")
	 */
	public function getChannelAction($idOrName) {
		$key = is_numeric($idOrName) ? 'id' : 'name';

		return $this->get('ndm_try_catch.model.channel_finder')
				->findOne($key, $idOrName);
	}

	/**
     * @param scalar $idOrName The name or id of the channel
     * @param string $_format The format to return the data in
	 *
	 * @ApiDoc(
	 *  resource=true,
	 *  description="List the components for a specific channel"
	 * )
	 * @FOS\View(templateVar="channels")
	 */
	public function getChannelComponentsAction($idOrName) {
		$key = is_numeric($idOrName) ? 'id' : 'name';

		return $this->get('ndm_try_catch.model.component_channel_finder')
				->findForChannel($key, $idOrName);
	}

	/**
	 * @param scalar $idOrName The name or id of the channel
     * @param scalar $component The ID or Name of the component
     * @param string $_format The format to return the data in
	 *
	 * @ApiDoc(
	 *  resource=true,
	 *  description="List the component details for a specific channel"
	 * )
	 *
	 * @FOS\View(templateVar="channels")
	 */
	public function getChannelComponentAction($idOrName, $component) {
		$key = is_numeric($idOrName) ? 'id' : 'name';
		$key2 = is_numeric($component) ? 'id' : 'name';

		return $this->get('ndm_try_catch.model.component_channel_finder')
				->findOneForChannel($key, $idOrName, $key2, $component);
	}

	/**
	 * @param scalar $idOrName The name or id of the channel
     * @param string $_format The format to return the data in
	 *
	 * @ApiDoc(
	 *  resource=true,
	 *  description="List the upcoming planned releases for a channel"
	 * )
	 *
	 * @FOS\View(templateVar="channels")
	 */
	public function getChannelReleasedatesAction($idOrName) {
		$key = is_numeric($idOrName) ? 'id' : 'name';
		return $this->get('ndm_try_catch.model.release_finder')
				->findForChannel($key, $idOrName);
	}
}
