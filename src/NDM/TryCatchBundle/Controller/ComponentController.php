<?php

namespace NDM\TryCatchBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

use FOS\RestBundle\Controller\Annotations as FOS;


class ComponentController extends Controller
{
	
    /**
     * @param string $name The name of the component
     * @return multitype:unknown 
     * 
     * @View
     */
    public function getComponentAction($name)
    {
        return array('name' => $name);
    }
}
