<?php

namespace NDM\TryCatchBundle\Controller;


use NDM\TryCatchBundle\Entity\Channel;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

use FOS\RestBundle\Controller\Annotations as FOS;

/**
 * @author davidmann
 *
 */
class ChannelController extends Controller
{

    /**
     *
     * @param string $name The name of the channel
     * @return multitype:unknown
     *
     * @FOS\View(templateVar="channels")
     */
    public function getChannelsAction()
    {
        return $this->get('ndm_try_catch.model.channel_finder')->findAllAsArray();
    }

    /**
     * @param string $name The name of the channel
     * @return multitype:unknown
     *
     * @FOS\View(templateVar="channel")
     */
    public function getChannelAction($idOrName)
    {
        $key = is_numeric($idOrName) ? 'id' : 'name';

        return $this->get('ndm_try_catch.model.channel_finder')->findOne($key, $idOrName);
    }

    /**
     * @param string $name The name of the component
     * @return multitype:unknown
     *
     *
     * @FOS\View(templateVar="channels")
     */
    public function getChannelComponentsAction($idOrName)
    {
        $key = is_numeric($idOrName) ? 'id' : 'name';

        return $this->get('ndm_try_catch.model.component_channel_finder')->findForChannel($key, $idOrName);
    }

    /**
     * @param string $name The name of the component
     * @return multitype:unknown
     *
     *
     * @FOS\View(templateVar="channels")
     */
    public function getChannelComponentAction($idOrName, $component)
    {
        $key = is_numeric($idOrName) ? 'id' : 'name';
        $key2 = is_numeric($component) ? 'id' : 'name';

        return $this->get('ndm_try_catch.model.component_channel_finder')->findOneForChannel($key, $idOrName, $key2, $component);
    }

    /**
     * @param string $name The name of the component
     * @return multitype:unknown
     *
     *
     * @FOS\View(templateVar="channels")
     */
    public function getChannelReleasedatesAction($idOrName)
    {
        $key = is_numeric($idOrName) ? 'id' : 'name';
        return $this->get('ndm_try_catch.model.release_finder')->findForChannel($key, $idOrName);
    }
}
