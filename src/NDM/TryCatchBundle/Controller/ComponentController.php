<?php

namespace NDM\TryCatchBundle\Controller;

use NDM\TryCatchBundle\Entity\Component;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

use FOS\RestBundle\Controller\Annotations as FOS;


/**
 * @author davidmann
 *
 * @IgnoreAnnotation("Get")
 * @IgnoreAnnotation("Put")
 * @IgnoreAnnotation("ApiPath")
 * @IgnoreAnnotation("ApiOperation")
 * @IgnoreAnnotation("ApiError")
 * @IgnoreAnnotation("ApiParam")
 */
class ComponentController extends Controller
{

    /**
     * @param string $name The name of the component
     * @return multitype:unknown
     *
     * @Get
     * @ApiPath /components
     * @ApiOperation(
     *     value="Get all of the available componenents",
     * )
     *
     * @FOS\View(templateVar="components")
     */
    public function getComponentsAction()
    {
        return $this->get('ndm_try_catch.model.component_finder')->findAllAsArray();
    }

    /**
     * @param string $name The name of the component
     * @return multitype:unknown
     *
     * @Get
     * @ApiPath /components/{idOrName}
     * @ApiOperation(
     *     value="Get the details about an available component",
     * )
     *
     * @ApiError(code=400,reason="Invalid name or ID provided")
     * @ApiParam(
     *     description="ID or Name of the component to retrieve",
     *     required=true,
     *     dataType="mixed",
     *     name="idOrName"
     * )
     * @FOS\View(templateVar="component")
     */
    public function getComponentAction($idOrName)
    {
        $key = is_numeric($idOrName) ? 'id' : 'name';

        return $this->get('ndm_try_catch.model.component_finder')->findOne($key, $idOrName);
    }

    /**
     * @param string $name The name of the component
     * @return multitype:unknown
     *
     * @Get
     * @ApiPath /components/{idOrName}/channels
     * @ApiOperation(
     *     value="Get the channels for a component",
     * )
     *
     * @ApiError(code=400,reason="Invalid name or ID provided")
     * @ApiParam(
     *     description="ID or Name of the component to retrieve",
     *     required=true,
     *     dataType="mixed",
     *     name="idOrName"
     * )
     * @FOS\View(templateVar="channels")
     */
    public function getComponentChannelsAction($idOrName)
    {
        $key = is_numeric($idOrName) ? 'id' : 'name';

        return $this->get('ndm_try_catch.model.component_channel_finder')->findForComponent($key, $idOrName);
    }

    /**
     * @param string $name The name of the component
     * @return multitype:unknown
     *
     *
     * @FOS\View(templateVar="channels")
     */
    public function getComponentReleasedatesAction($idOrName)
    {
        $key = is_numeric($idOrName) ? 'id' : 'name';
        return $this->get('ndm_try_catch.model.release_finder')->findForComponent($key, $idOrName);
    }
}
