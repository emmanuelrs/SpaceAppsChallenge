<?php
require_once 'vendor/autoload.php';

use GraphAware\Neo4j\Client\ClientBuilder;

$client = ClientBuilder::create()
    ->addConnection('default', 'http://Admin:b.ewzHlLMPO7iE.p4QPHQcIVwxYek5p@hobby-kgianjaijildgbkeannhlgpl.dbs.graphenedb.com:24789') // Example for HTTP connection configuration (port is optional)
    ->build();


  $result = $client->run("CREATE (n:Person {name: 'Bob'}) RETURN id(n)");
  echo $result->getRecord()->value("id(n)");

?>
