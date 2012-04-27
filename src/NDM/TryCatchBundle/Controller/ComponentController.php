<?php

namespace NDM\TryCatchBundle\Controller;

use Nelmio\ApiDocBundle\Annotation\ApiDoc;

use NDM\TryCatchBundle\Entity\Component;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

use FOS\RestBundle\Controller\Annotations as FOS;

/**
 * @author davidmann
 */
class ComponentController extends Controller
{

    /**
     * @param string $_format The format to return the data in
     *
     * @ApiDoc(
	 *  resource=true,
	 *  description="List all of the available component channels"
	 * )
     *
     * @FOS\View(templateVar="components")
     */
    public function getComponentsAction()
    {
        return $this->get('ndm_try_catch.model.component_finder')->findAllAsArray();
    }

    /**
     * @param scalar $idOrName The name or id of the component
     * @param string $_format The format to return the data in
     *
     * @ApiDoc(
	 *  resource=true,
	 *  description="List the details of a single component"
	 * )
	 *
     * @FOS\View(templateVar="component")
     *
     */
    public function getComponentAction($idOrName)
    {
        $key = is_numeric($idOrName) ? 'id' : 'name';

        return $this->get('ndm_try_catch.model.component_finder')->findOne($key, $idOrName);
    }

    /**
     * @param scalar $idOrName The name or id of the component
     * @param string $_format The format to return the data in
     *
     * @ApiDoc(
	 *  resource=true,
	 *  description="List the channels available to a single component"
	 * )
	 *
     * @FOS\View(templateVar="channels")
     */
    public function getComponentChannelsAction($idOrName)
    {
        $key = is_numeric($idOrName) ? 'id' : 'name';

        return $this->get('ndm_try_catch.model.component_channel_finder')->findForComponent($key, $idOrName);
    }

    /**
     * @param scalar $idOrName The name or id of the component
     * @param string $_format The format to return the data in
     *
     * @ApiDoc(
	 *  resource=true,
	 *  description="List all of the upcoming release dates for a component"
	 * )
     *
     * @FOS\View(templateVar="channels")
     */
    public function getComponentReleasedatesAction($idOrName)
    {
        $key = is_numeric($idOrName) ? 'id' : 'name';
        return $this->get('ndm_try_catch.model.release_finder')->findForComponent($key, $idOrName);
    }
}
