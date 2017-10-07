export default {
  "attributes": {
    "id": "8e78cf63-c20a-4fc9-b19e-46984abcb314",
    "timestamp": 1469363764000,
    "title": "Testbench 2.3 is out (finally)",
    "slug": "testbench-2-3-is-out-finally"
  },
  "body": "Yeah, you heard that correctly. Testbench 2.3 has been released and it brings a lot of new features. I don't want to write about small bugfixes but about real improvements in testing environment. There was always one important mission in Testbench - to make testing easier for newcomers. And I am happy to show you biggest feature in this release: **scaffold**.\n\nImagine you have your own application but without tests (this is the best situation for scaffolding). Now you can generate whole testing environment using this single command:\n\n```\nvendor/bin/run-tests --scaffold tests/bootstrap.php\n```\n\nAs you can see, you have to prepare `bootstrap.php` before scaffold. You can find default one in [readme](https://github.com/mrtnzlml/testbench/blob/master/readme.md). Content of this file can be very simple:\n\n```php\n<?php\n\nrequire __DIR__ . '/../vendor/autoload.php';\n\nTestbench\\Bootstrap::setup(__DIR__ . '/_temp', function (\\Nette\\Configurator $configurator) {\n    $configurator->createRobotLoader()->addDirectory([\n        __DIR__ . '/../app',\n    ])->register();\n\n    $configurator->addParameters([\n        'appDir' => __DIR__ . '/../app',\n    ]);\n\n    $configurator->addConfig(__DIR__ . '/../app/config/config.neon');\n    //$configurator->addConfig(__DIR__ . '/tests.neon');\n});\n```\n\nJust remember, that it has to be possible to run application using this bootstrap in test environment. Look at this video where you can see how to use it:\n\n<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/63Vn6Udg3xQ\" frameborder=\"0\" allowfullscreen></iframe>\n\nAnd how does it work exactly? At this very moment there is very simple idea in Testbench. Scaffold is firstly trying to find every possible presenter in Nette appliaction. Then there are two parts of scaffold process: collecting information and generating PHP code. Collecting information is the most challenging part of scaffold, but it's basically looking for *action*, *render*, *handle* and *createComponent\\** methods using reflection. It looks at the signature of the method and then it tries to run these methods to get the response. Now it's possible to generate whole testing class for every presenter in application.\n\nThis approach is great, because it's possible to generate tests according to the response, but there are some drawbacks as well. It may not be accurate. The most problematic part is parameter (even optional) guessing, because application can response on different parameters differently and it's not possible to figure out if it's expected behavior or not. This means that you always have to look at the generated tests and fix them if needed.\n\n# Another improvements and news\n\nI dropped support for PHP 5.4 and 5.5 because [they are dead](http://php.net/supported-versions.php). Currently supported PHP versions are only PHP 5.6 (LTS) and PHP 7.0 until 31 Dec 2018 and 3 Dec 2018 respectively. Deal with it if you are running older PHP. You shouldn't do that anyway.\n\nAnother big change has been introduced to the database behavior during tests. Now every single request to the database is going to the fake clean database even if you are not using TDoctrine or TNetteDatabase trait. At the very begining it was expected behavior to create databases only if you are using those traits, but it wasn't programmer friendly and sometimes it causes weird situations. I am working on another completely different transactional approach in [this branch](https://github.com/mrtnzlml/testbench/tree/transactional-db-tests), but it's going to be in next release (maybe). \n\nThere is another improvement in database testing. Testbench now supports **Doctrine migrations**! If you have migrations configured in your project, you can enable them in Testbench config like this:\n\n```neon\ntestbench\n\tmigrations: yes\n\tsqls:\n\t\t- %testsDir%/_helpers/sqls/mysql_1.sql\n\t\t- %testsDir%/_helpers/sqls/mysql_2.sql\n```\n\nTestbench will load SQLs and then it will run migrations to the latest version.\n\nThe last but not least important note is, that Testbench is at this moment using `dev-master` of Nette\\Tester. Mostly because of new awesome `-C` switch in command line. But this means that if you want to use Testbench 2.3, you have to omit Nette\\Tester version in `composer.json`, or use something line this:\n\n```js\n\"require-dev\": {\n\t\"nette/tester\": \"2.0.x-dev as v1.7\",\n\t\"mrtnzlml/testbench\": \"^2.3\"\n},\n```\n\nPlease [read release notes](https://github.com/mrtnzlml/testbench/releases/tag/v2.3) for further details. I hope you'll enjoy this release and Testbench becomes much more useful and powerful tool for testing thanks to you - Testbench user."
}
