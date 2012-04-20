<?php

namespace NDM\TryCatchBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

/**
 * This is the class that validates and merges configuration from your app/config files
 *
 * To learn more see {@link http://symfony.com/doc/current/cookbook/bundles/extension.html#cookbook-bundles-extension-config-class}
 */
class Configuration implements ConfigurationInterface
{
    /**
     * {@inheritDoc}
     */
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder();
        $rootNode = $treeBuilder->root('ndm_try_catch');

        $rootNode
        	->children()
				->arrayNode('ingesters')
					->useAttributeAsKey('name')
					->prototype('array')
						->beforeNormalization()->always(function($v) {
        					return $v;
        				})->end()
        				->children()
        					->scalarNode('class')->isRequired()->end()
	        				->arrayNode('mappings')
        						->prototype('array')
									->beforeNormalization()->always(function($v) {
        								if(!isset($v['to'])) {
        									$v['to'] = $v['from'];
        								}

        								if(isset($v['type'])) {
        									$v['filters'] = isset($v['filters']) && $v['filters'] ? array_merge(array($v['type']), $v['filters']) : array($v['type']);
        								}

			        					return $v;
			        				})->end()
		        					->children()
		        						->scalarNode('type')->end()
		        						->scalarNode('from')->end()
		        						->scalarNode('to')->defaultValue('string')->end()
		        						->arrayNode('filters')
		        							->defaultValue(array())
		        							->prototype('scalar')->end()
		        						->end()
		        					->end()
	        					->end()
	        				->end()
        				->end()
					->end()
				->end()
        	->end();

        return $treeBuilder;
    }
}
