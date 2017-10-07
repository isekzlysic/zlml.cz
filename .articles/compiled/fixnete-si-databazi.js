export default {
  "attributes": {
    "id": "c8a25638-706f-4849-8965-d4aa66144ffc",
    "timestamp": 1432200241000,
    "title": "Fixněte si databázi",
    "slug": "fixnete-si-databazi"
  },
  "body": "Možná to znáte. Již nějaký čas nepoužíváte žádný SQL soubor a strukturu databáze si generujete z entit pomocí Doctrine. Je to super, rychlé a funguje to. Paráda. Jenže málokterá databáze se obejde bez nějakých inicializačních dat. Jenže jak na to?\n\n# První přístup\n\nNebudu ho popisovat moc dlouho, protože ukazuje přesně to, co nechci ukázat. Jendoduše si napíšete nějaké to SQL, které pak nahrnete do databáze. Třeba nějak takto:\n\n```sql\nREPLACE INTO `options` (`key`, `value`)\nVALUES\n('option1', 'value1'),\n('option2', 'value2'),\n('option3', 'value3');\n```\n\nTo jak si to pošlete do databáze je celkem jedno. Jestli ručně, nebo přes PHP. Pořád někde zůstává SQL. Proč mi to vadí? Tak třeba zde na blogu je nějaká instalace. A protože jsem se ještě nedokopal k tomu to přepsat, tak musím mít tyto soubory dva. Jeden pro MySQL a druhý pro PosgreSQL. _(Jo správně, blog jde nainstalovat na více databází...)_ A to je voser.\n\nAle jsou i projekty, kde jsem to udělal rovnou pořádně (i když jsou jen na jedné databázi).\n\n# Lepší přístup pomocí fixtures\n\nZnáte [Doctrine Data Fixtures Extension](https://github.com/doctrine/data-fixtures)? Neznáte? Tak to doporučuji, protože vám pomohou vyřešit přesně tento problém. Lépe tuto knihovnu poznáte pomocí composeru:\n\n```\ncomposer require doctrine/data-fixtures\n```\n\nSamozřejmě je takový nepsaný předpoklad, že používáte Doctrine... :) Co dál? Ještě než se pustím do dalšího vysvětlování, bylo by fajn napsat si nějaký command. Na takový command objekt se nejlépe hodí moje oblíbená knihovna [Kdyby/Console](https://github.com/Kdyby/Console), která integruje [command ze Symfony](http://symfony.com/doc/current/components/console/introduction.html). Už jsem o tom psal něco málo [dříve](kdyby-console). A díky této přehršli odkazů již víte jak na to a můžeme rovnou nějaký psát. A protože jsem líný programátor, tak se podívám jak to vyřešil [někdo jiný](https://github.com/doctrine/DoctrineFixturesBundle/blob/master/Command/LoadDataFixturesDoctrineCommand.php). A trošku si to zjedoduším:\n\n```php\n<?php\n\nuse Doctrine\\Common\\DataFixtures\\Executor\\ORMExecutor;\nuse Doctrine\\Common\\DataFixtures\\Loader;\nuse Doctrine\\Common\\DataFixtures\\Purger\\ORMPurger;\nuse Kdyby\\Doctrine\\EntityManager;\nuse Symfony\\Component\\Console\\Command\\Command;\nuse Symfony\\Component\\Console\\Input\\InputInterface;\nuse Symfony\\Component\\Console\\Output\\OutputInterface;\n\nclass DefaultData extends Command\n{\n\n\t/** @var EntityManager @inject */\n\tpublic $em;\n\n\tprotected function configure()\n\t{\n\t\t$this\n\t\t\t->setName('orm:demo-data:load')\n\t\t\t->setDescription('Load data fixtures to your database.');\n            //->addOption...\n    }\n    \n    protected function execute(InputInterface $input, OutputInterface $output)\n\t{\n\t\ttry {\n        \t$loader = new Loader();\n\t\t\t$loader->loadFromDirectory(__DIR__ . '/../basic');\n            $fixtures = $loader->getFixtures();\n\n\t\t\t$purger = new ORMPurger($this->em);\n            \n            $executor = new ORMExecutor($this->em, $purger);\n\t\t\t$executor->setLogger(function ($message) use ($output) {\n\t\t\t\t$output->writeln(sprintf('  <comment>></comment> <info>%s</info>', $message));\n\t\t\t});\n\t\t\t$executor->execute($fixtures);\n\t\t\treturn 0; // zero return code means everything is ok\n        } catch (\\Exception $exc) {\n\t\t\t$output->writeLn(\"<error>{$exc->getMessage()}</error>\");\n\t\t\treturn 1; // non-zero return code means error\n\t\t}\n\t}\n}\n```\n\nOk, to jsem to možná ořezal více než je třeba. Mrkněte na tu ukázku pro Symfony, bude to velmi podobné. A teď už konečně k samotným fixture objektům. To jsou ty co načítám ze složky basic pomocí `loadFromDirectory`. Jedná o objekty, které implementují interface `FixtureInterface`, nebo možná lépe dědí od abstraktní třídy `AbstractFixture`. Obojí je v `Doctrine\\Common\\DataFixtures` namespace. Objekt obsahující defaultní uživatele může vypadat takto:\n\n```php\n<?php\n\nuse Doctrine\\Common\\Persistence\\ObjectManager;\nuse Nette\\Security\\Passwords;\n\nclass UsersFixture extends \\Doctrine\\Common\\DataFixtures\\AbstractFixture\n{\n\n\tpublic function load(ObjectManager $manager)\n\t{\n\t\t$admin = new \\Users\\User('admin@nette.org');\n\t\t$admin->setPassword(Passwords::hash('admin'));\n\t\t$admin->addRole($this->getReference('admin-role'));\n\t\t$manager->persist($admin);\n\n\t\t$demo = new \\Users\\User('demo@nette.org');\n\t\t$demo->setPassword(Passwords::hash('demo'));\n\t\t$demo->addRole($this->getReference('demo-role'));\n\t\t$manager->persist($demo);\n\n\t\t$manager->flush();\n\n\t\t$this->addReference('admin-user', $admin);\n\t\t$this->addReference('demo-user', $demo);\n\t}\n\n}\n```\n\nV čem je to tak parádní? Používám PHP kód, používám vlastní nadefinované entity. Hned vidím, že mi to fugnuje, ověřuji svůj návrh databáze a rovnou poskytuji dalším ukázku toho, jak jsem to myslel. Za povšimnutí stojí funkce `addReference` a `getReference`. Je jasné, že v každé relační databázi budou nějaké relace a právě k tomu tyto funkce slouží. Vytvořím si tedy nějaké ukazatele a ty pak mohu použít v jiné části demo dat. Lépe to  bude vidět na druhé tabulce:\n\n```php\n<?php\n\nuse Doctrine\\Common\\Persistence\\ObjectManager;\n\nclass RolesFixture extends \\Doctrine\\Common\\DataFixtures\\AbstractFixture\n{\n\n\tpublic function load(ObjectManager $manager)\n\t{\n\t\t$user = new \\Users\\Role();\n\t\t$user->setName(\\Users\\Role::DEMO_USER);\n\t\t$manager->persist($user);\n\n\t\t$admin = new \\Users\\Role();\n\t\t$admin->setName(\\Users\\Role::ADMIN);\n\t\t$manager->persist($admin);\n\n\t\t$manager->flush();\n\n\t\t$this->addReference('demo-role', $user);\n\t\t$this->addReference('admin-role', $admin);\n\t}\n\n}\n```\n\nVidíte? Mám role, vytvořím si na ně odkaz a používám je při definici uživatele. Vyzkoušejte si to. Uvidíte, jak se krásně naplní referenční tabulky a vše bude tak, jak to má být...\n\nJen pozor na jedno věc. Ohlídejte si [pořadí těchto objektů](https://github.com/doctrine/data-fixtures#fixture-ordering). To lze vyřešit implementací rozhraní `OrderedFixtureInterface`, nebo `DependentFixtureInterface`, což je o něco lepší přístup.\n\nA jak toto celé použít? Však už to znáte:\n\n```\nλ php index.php\nλ php index.php orm:schema-tool:create\nλ php index.php orm:demo-data:load\n```\n\nPrvní příkaz vám nabídne všechny dostupné příkazy, druhý vygeneruje strukturu databáze bez dat a poslední spustí natažení demo dat. Pak už se jen kocháte:\n\n```\nλ php index.php orm:demo-data:load --demo\nCareful, database will be purged. Do you want to continue Y/N ? y\n  > purging database\n  > loading RolesFixture\n  > loading UsersFixture\n  > loading ArticlesFixture\n  > loading ProductsFixture\n  ...\n```"
}
