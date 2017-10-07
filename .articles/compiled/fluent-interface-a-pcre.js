export default {
  "attributes": {
    "id": "16cdfe07-444b-48ee-ae7a-ff85893edba5",
    "timestamp": 1376166681000,
    "title": "Fluent interface a PCRE",
    "slug": "fluent-interface-a-pcre"
  },
  "body": "Na následujících řádcích předvedu dvě věci. První je úžasný nápad jak vytvářet regulární výrazy pomocí fluent zápisu ([inspirace .{target:_blank}](https://github.com/VerbalExpressions/PHPVerbalExpressions/blob/master/VerbalExpressions.php)), což je druhá věc o které bych se rád zmínil.\n\n# Regulární výrazy jsou peklo\n\nAčkoliv znám pár lidí, které regulární výrazy umí, je jich opravdu pár. A nikdo z nich o sobě neřekne, že je umí. Následuje příklad velmi triviálního výrazu, který je ovšem dosti špatný, což je dobře, protože se k tomu vrátím později:\n\n```\n/^(http)(s)?(\\:\\/\\/)(www\\.)?([^ ]*)(\\.)([^ ]*)(\\/)?$/\n```\n\nTento výraz akceptuje přibližně tvar URL. Je však zřejmé, že je to zápis, který je nesmírně náročný na vymyšlení a extrémně náchylný ke tvoření chyb. Proto je vhodné si jeho tvorbu zjednodušit například nějakou třídou:\n\n```php\n<?php\n\nclass Regexp {\n\n\tprivate $regexp = '';\n\n\tpublic function has($value) {\n\t\t$this->regexp .= \"(\" . preg_quote($value, '/') . \")\";\n\t\t//return $this;   -   potřebné pro fluent interface\n\t}\n\n\tpublic function maybe($value) {\n\t\t$this->regexp .= \"(\" . preg_quote($value, '/') . \")?\";\n\t\t//return $this;   -   potřebné pro fluent interface\n\t}\n\n\tpublic function anythingBut($value) {\n\t\t$this->regexp .= \"([^\" . preg_quote($value, '/') . \"]*)\";\n\t\t//return $this;   -   potřebné pro fluent interface\n\t}\n\n\tpublic function __toString() {\n\t\treturn \"/^$this->regexp$/\";\n\t}\n\n}\n```\n\nS tím, že její použití je prosté:\n\n```php\n$regexp = new Regexp();\n$regexp->then('http');\n$regexp->maybe('s');\n$regexp->then('://');\n$regexp->maybe('www.');\n$regexp->anythingBut(' ');\n$regexp->then('.');\n$regexp->anythingBut(' ');\n$regexp->maybe('/');\necho $regexp . '<br>';\necho preg_match($regexp, 'http://zlml.cz/') ? 'P' : 'F';\necho preg_match($regexp, 'https://zlml.cz/') ? 'P' : 'F';\n```\n\nNemusím však říkat, že to minimálně vypadá naprosto otřesně. Spousta psaní, až moc objektové chování. Elegantnější řešení přináší právě fluent interface.\n\n# Fluent interfaces, regulární peklo chladne\n\nFluent interface je způsob jak řetězit metody za sebe. Používá se poměrně často, ušetří spoustu zbytečného psaní a velmi prospívá srozumitelnosti kódu. Nevýhodou je, že se musí v každé metodě vrátit objekt <code>return $this;</code>, na což se nesmí zapomenout. Každopádně výsledek je skvostný:\n\n```php\n$regexp = new Regexp();\n$regexp->then('http')\n\t\t->maybe('s')\n\t\t->then('://')\n\t\t->maybe('www.')\n\t\t->anythingBut(' ')\n\t\t->then('.')\n\t\t->anythingBut(' ')\n\t\t->maybe('/');\necho $regexp . '<br>';\necho preg_match($regexp, 'http://zlml.cz/') ? 'P' : 'F';\necho preg_match($regexp, 'https://zlml.cz/') ? 'P' : 'F';\n```\n\nTeprve zde vynikne to, jak je důležité správně (čti stručně a jasně) pojmenovávat metody. Díky fluent interfaces lze programovat téměř ve větách, které jsou naprosto srozumitelné.\n\n# Ne, peklo je opět peklem\n\nAčkoliv by se mohlo zdát, že díky objektu, který pomáhá tvořit regulární výrazy je jejich kompozice jednoduchou záležitostí, není tomu tak. Vrátím se k původnímu výrazu, který není dobrý. Proč? V reálném světě je kontrola, resp. předpis, který musí daná adresa mít daleko složitější. Například <code>http</code> nemusí být vůbec přítomno, pokud však je, musí následovat možná <code>s</code> a zcela určitě <code>://</code>. To samé s doménou. Ta může být jen určitý počet znaků dlouhá, může obsahovat tečky (ale ne neomezené množství), samotná TLD má také určitá pravidla (minimálně co se týče délky) a to nemluvím o parametrech za adresou, které jsou téměř bez limitu.\n\nZkuste si takový objekt napsat. Ve výsledku se i nadále budou regulární výrazy psát ručně, nebo se ve složitějších případech vůbec používat nebudou."
}
