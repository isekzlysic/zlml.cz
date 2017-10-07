export default {
  "attributes": {
    "id": "ef0027e0-1814-4c1f-9fcd-395b68cfcb85",
    "timestamp": 1393588145000,
    "title": "Čteme QR kódy bez čtečky",
    "slug": "cteme-qr-kody-bez-ctecky"
  },
  "body": "![](https://zlmlcz-media.s3-eu-west-1.amazonaws.com/2139a61c-efc4-4e3c-b630-5c3cbf9258df/qrcode-ahoj.png)\n\nPatříte mezi lidi, kteří se nespokojí pouze se čtečkou QR kódů, ale chcete vědět jak fungují? Nebo co víc jak je přečíst bez použité takové čtečky? Tak to jste na správné adrese. Dnes budu řešit zejména právě čtení QR kódu bez použití čtečky. Celou dobu budu řešit tento QR kód na levé straně, takže doporučuji nepoužívat telefon a počkat až na konec, kde se jeho obsah dozvíte. Zároveň se nebudu nijak opírat o korekci chyb a další jinak důležité věci, ale budu se co nejvíce soustředit právě na přečtení kódu bez použití jakéhokoliv přístroje. Pojďme na to...\n\n# Trocha nezbytné teorie\n\n![](https://zlmlcz-media.s3-eu-west-1.amazonaws.com/312d5904-ab94-4877-9743-8ec902fbc50a/qrcode-parts.png)\n\nQR kód asi viděl každý. Stejně tak předpokládám, že spoustu lidí tuší, že QR kód dodržuji určitá pravidla, aby jej šlo přečíst strojově. Jedná se zejména o \"finder pattern\", tedy ty velké čtverce, které slouží k zaměření čtečky a určení orientace kódu. Díky tomu, že jsou tři, tak lze QR kód přečíst i pokud je vzhůru nohama. Dalším významným prvkem jsou separátory, které obklopují právě tyto čtverce a slouží k oddělení zaměřovačů od zbytku kódu. Žlutě jsem zvýraznil tzv. \"timing patterns\". Ty se táhnout z rohu do rohu zaměřovacích čtverců, kdy se celou dobu střídá černá a bílá barva a slouží opět pro čtečky například k určení velikosti celého kódu. Na takto malém kódu nejsou žádní informace i verzi, ani korekční body.\n\nNejdůležitější jsou však červené a zelené části. Zde jsou uloženy informace i formátu, které následně také využijeme. Je zajímavé, že se jak červená část, tak zelená část na kódu vždy dvakrát opakuje. Informace je očíslována čísly 1-15 s tím, že kolem levého horního zaměřovače je informace celá a ta samá informace je ještě rozdělena a umístěna kolem zbylých dvou zaměřovačů. Je zde ještě jedna zajímavost. V levém dolním rohu nad číslem 9 je černé místo, tzv. \"dark module\". Toto místo by mělo být na všech kódech černé. Jedná se přebytečné místo, které vzniká při zdvojování informace o formátu. Podle specifikace by to tak mělo být, ale ne vždy to platí. Pro nás je však zajímavá jediná část z celé 15 bitů dlouhé informace a to konkrétně bity umístněné na pozici 11, 12 a 13, tedy v zelené části. Právě ty si nesou tu nejdůležitější informaci o masce. Všechny ostatní části informace slouží ke korekci chyb. Celkově se ve výsledku ukáže, že kromě samotné informace je v QR kódu sloustu \"zbytečných\" věcí, které informaci nenesou. V mašem případě je tedy maska `111` (černé místo je 1 a bílé 0). Tuto informaci je však ještě potřeba dekódovat pomocí XOR součtu přičtením hodnoty `101`, tedy:\n\n```\n111\n101 /XOR\n---\n010\n```\n\nCelá dekódovací maska je `101010000010010`, ale pro naší potřebu je potřeba pouze část `101`. Ještě než vysvětlím co to maska je, uvedu zde všechny hodnoty jaké může maska mít:\n\n<table class=\"table table-bordered\">\n  <thead>\n    <tr><td>Hodnota masky</td><td>Podmínka masky</td></tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>000</td>\n      <td>(i + j) mod 2 = 0</td>\n    </tr>\n    <tr>\n      <td>001</td>\n      <td>i mod 2 = 0</td>\n    </tr>\n    <tr>\n      <td>**010**</td>\n      <td>**j mod 3 = 0**</td>\n    </tr>\n    <tr>\n      <td>011</td>\n      <td>(i + j) mod 3 = 0</td>\n    </tr>\n    <tr>\n      <td>100</td>\n      <td>((i div 2) + (j div 3)) mod 2 = 0</td>\n    </tr>\n    <tr>\n      <td>101</td>\n      <td>(i j) mod 2 + (i j) mod 3 = 0</td>\n    </tr>\n    <tr>\n      <td>110</td>\n      <td>((i j) mod 2 + (i j) mod 3) mod 2 = 0</td>\n    </tr>\n    <tr>\n      <td>111</td>\n      <td>((i+j) mod 2 + (i j) mod 3) mod 2 = 0</td>\n    </tr>\n  </tbody>\n</table>\n\nTo může vypadat děsivě, ale hned vysvětlím. Podle toho jakou má kód masku vezmeme vzorec a dosadíme za **j** číslo sloupce. V našem případě se tedy bavíme o prvním a pak každém třetím sloupci. Pro tyto sloupce platí, že na nich musíme provést negaci, tedy otočit barvy. Tím QR kód odmaskujeme. Toto však platí pouze pro částí kde je opravdu nějaká informace, nikoliv pro zaměřovače, nebo například části nesoucí formátovací informaci. Toto maskování slouží k zamíchání barevných polí. Nestane se tak, že by byl kód nejednoznačný. Při kódování se totiž porovnávají jednotlivé masky, každá maska má nějaké skóré jednoznačnosti a ve výsledku se vybere ta nejjednoznačnější. Celé odmaskování je znázorněno na obrázku níže. Pravý černý QR kód je již odmaskovaný a nic nebrání jej přečíst. V tuto chvíli však již pouze bez použití čtečky.\n\n![](https://zlmlcz-media.s3-eu-west-1.amazonaws.com/63e85abb-b86a-4877-9640-fb70b4cd2542/qrcode-important.png)\n![](https://zlmlcz-media.s3-eu-west-1.amazonaws.com/3951a3ea-5f53-4af9-9c01-a45fd71dd5b0/qrcode-unmasked.png)\n\n# Hrajeme si na čtečku\n\n![](https://zlmlcz-media.s3-eu-west-1.amazonaws.com/0ed74ba7-ddec-40da-ab12-4e6b8d82103c/qrcode-decode.png)\n\nPředchozí část byla možná trošku složitější, ale když se na to podíváte zpětně je to vlastně velice jednoduché. Stačí přečíst 3 bity z celého kódu, provést jednoduchý XOR a jak se ukáže dále, tak stačí invertovat pouze jeden sloupec, protože více jich není potřeba.\n\nPodívejte se nyní na levý obrázek. Ten ukazuje, jak budeme číst uloženou informaci. Barevně znázorněná část je kompletní informace. Zbytek kódu je pro nás v tuto chvíli jen odpad. Barevně zvýrazněná část se ještě dělí na tři podčásti. Červená oblast obsahuje informaci o módu. Bity čteme vždy podle čísel a šipek. Tento QR kód je tedy v módu `0100` což je mód \"BYTE\". Data tedy budeme rozdělovat tak, aby měla každý část 1 byte, tedy 8 bitů. Tyto módy a další informace jsou velmi podrobně popsány v oficiální dokumentaci. Modrá část nám ještě prozrazuje informaci o délce, binárně tedy `00000100` což je v desítkové soustavě číslo 4. Takže informace v tomto QR kódu má délku 4 znaky. Opíšeme si tedy řadu bitů:\n\n```\n01100001 01101000 01101111 01101010\n```\n\nZde by mohl být trošku zádrhel pro lidi, co neumí ASCII tabulku. Prozradím tedy malý fígl. Pokud binární čásla prevedeme do decimální soustavy, což je velmi jednoduché, získáme následující zápis:\n\n```\n97 104 111 106\n```\n\nA teď už je to jen posunutá abeceda, protože číslo 97 je malé **a**. Výsledkem je tedy po chvilce abecedování:\n\n```\na h o j\n```\n\nTo nebylo tak těžké, že? Je to sice absurdní a pravděpodobně nikdy nikoho neuvidím s tužkou a papírem před QR kódem, ale i tak si myslím, že je dobré tyto věci vědět, když už se QR kód používá tak často. Doporučuji všem přečíst si dokument *ISO/IEC 18004:2006*, který řeší právě QR kódy. Je to nesmírně zajímavý dokument plný obrázků a úplných popisků, ačkoliv je i v tomto dokumentu pár drobných chyb."
}
