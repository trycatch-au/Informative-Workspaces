<?php

/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace NDM\TryCatchBundle\Tests\DependencyInjection;

use NDM\TryCatchBundle\DependencyInjection\Configuration;

use Symfony\Component\Config\Definition\Processor;

class ConfigurationTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @dataProvider getDebugModes
     */
    public function testConfigTree($options, $results)
    {
        $processor = new Processor();
        $configuration = new Configuration(array());
        $config = $processor->processConfiguration($configuration, array($options));

        $this->assertEquals($results, $config);
    }

    public function getDebugModes()
    {
        return array(
            array(array(), array('ingesters' => array())),
            array(array('ingesters' => array(array('name' => 'foo', 'class' => '\stdClass'))), array('ingesters' => array('foo' => array('class' => '\stdClass', 'mappings' => array())))),
            array(array('ingesters' => array(array('name' => 'foo', 'mappings' => array(array('from' => 'foo')), 'class' => '\stdClass'))), array('ingesters' => array('foo' => array('class' => '\stdClass', 'mappings' => array(array('to' => 'foo', 'from' => 'foo', 'transformers' => array())))))),
            array(array('ingesters' => array(array('name' => 'foo', 'mappings' => array(array('from' => 'foo', 'type' => 'bar')), 'class' => '\stdClass'))), array('ingesters' => array('foo' => array('class' => '\stdClass', 'mappings' => array(array('to' => 'foo', 'from' => 'foo', 'transformers' => array('bar')))))))
        );
    }
}
