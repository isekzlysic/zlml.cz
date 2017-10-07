export default {
  "attributes": {
    "id": "a285c880-267e-4070-9139-98b86d63772e",
    "timestamp": 1375044812000,
    "title": "CRON validátor",
    "slug": "cron-validator"
  },
  "body": "<p>A jak už to tak bývá, tak opět ohnutý pro Nette. Tentokráte inspirovaný řešením ISPConfigu.</p>\n<h2 id=\"m-e-tohle-nesm-tamto\">Můžeš tohle, nesmíš tamto <a href=\"#m-e-tohle-nesm-tamto\">#</a></h2><p>Samotný CRON zápis je velmi rozmanitý a proto se omezím pouze na základní požadavky:</p>\n<ol>\n<li>obecně jsou povolené znaky <code>0-9</code>, <code>čárka</code>, <code>*</code>, <code>-</code>, <code>/</code></li>\n<li><code>čárka</code>, <code>-</code> a <code>/</code> nesmí být nikdy vedle sebe</li>\n<li><code>x</code>, <code>x-y</code>, <code>x/y</code>, <code>x-y/z</code>, <code>*/x</code>, kde x,y,z jsou čísla z povolených časových rozsahů</li>\n<li>povolený rozsah pro minuty: <strong>0-59</strong></li>\n<li>povolený rozsah pro hodiny: <strong>0-23</strong></li>\n<li>povolený rozsah pro dny měsíce: <strong>1-31</strong></li>\n<li>povolený rozsah pro měsíce: <strong>1-12</strong></li>\n<li>povolený rozsah pro dny v týdnu: <strong>0-6</strong></li>\n</ol>\n<p>To je myslím slušný výčet pravidel pro zvalidování jednoho příkazu.\nÚkolem tohoto článku není ukázat jak tvořit a zpracovávat formulář, ale bude vhodné\numístit sem celý kód alespoň vytvoření:</p>\n<pre><code class=\"lang-php\">/**\n  * @return Nette\\Application\\UI\\Form\n  */\nprotected function createComponentAddCron() {\n    $form = new Nette\\Application\\UI\\Form;\n    $form-&gt;addProtection();\n    $form-&gt;addText(&#39;minutes&#39;, &#39;Minuty:&#39;)\n        -&gt;addRule(\\Fresh\\ValidateCron::MINUTES, &#39;Nevalidní CRON zápis - minuty.&#39;);\n    $form-&gt;addText(&#39;hours&#39;, &#39;Hodiny:&#39;)\n        -&gt;addRule(\\Fresh\\ValidateCron::HOURS, &#39;Nevalidní CRON zápis - hodiny.&#39;);\n    $form-&gt;addText(&#39;mdays&#39;, &#39;Dny měsíce:&#39;)\n        -&gt;addRule(\\Fresh\\ValidateCron::MDAYS, &#39;Nevalidní CRON zápis - mdays.&#39;);\n    $form-&gt;addText(&#39;months&#39;, &#39;Měsíce:&#39;)\n        -&gt;addRule(\\Fresh\\ValidateCron::MONTHS, &#39;Nevalidní CRON zápis - měsíce.&#39;);\n    $form-&gt;addText(&#39;wdays&#39;, &#39;Dny v týdnu:&#39;)\n        -&gt;addRule(\\Fresh\\ValidateCron::WDAYS, &#39;Nevalidní CRON zápis - wdays.&#39;);\n    $form-&gt;addText(&#39;command&#39;, &#39;Příkaz:&#39;)\n        -&gt;setRequired(&#39;Vyplňte prosím příkaz, který bude CRON spouštět.&#39;);\n    $form-&gt;addSubmit(&#39;save&#39;, &#39;Přidat nový CRON&#39;);\n    $form-&gt;onSuccess[] = $this-&gt;addCronSucceeded;\n    return $form;\n}\n</code></pre>\n<p>A rovnou bez hloupých povídání celý validátor:</p>\n<pre><code class=\"lang-php\">&lt;?php\n\nnamespace Fresh;\n\n/**\n * Class ValidateCron - inspired by ISPConfig\n * @package Fresh\n */\nclass ValidateCron extends \\Nette\\Object {\n\n        const MINUTES = &#39;\\Fresh\\ValidateCron::validateMinutes&#39;;\n        const HOURS = &#39;\\Fresh\\ValidateCron::validateHours&#39;;\n        const MDAYS = &#39;\\Fresh\\ValidateCron::validateMdays&#39;;\n        const MONTHS = &#39;\\Fresh\\ValidateCron::validateMonths&#39;;\n        const WDAYS = &#39;\\Fresh\\ValidateCron::validateWdays&#39;;\n\n        public static function validateMinutes(\\Nette\\Forms\\IControl $control) {\n                return \\Fresh\\ValidateCron::validateTimeFormat($control-&gt;getValue(), 0, 59);\n        }\n\n        public static function validateHours(\\Nette\\Forms\\IControl $control) {\n                return \\Fresh\\ValidateCron::validateTimeFormat($control-&gt;getValue(), 0, 23);\n        }\n\n        public static function validateMdays(\\Nette\\Forms\\IControl $control) {\n                return \\Fresh\\ValidateCron::validateTimeFormat($control-&gt;getValue(), 1, 31);\n        }\n\n        public static function validateMonths(\\Nette\\Forms\\IControl $control) {\n                if($control-&gt;getValue() != &#39;@reboot&#39;) { // allow value @reboot in month field\n                        return \\Fresh\\ValidateCron::validateTimeFormat($control-&gt;getValue(), 1, 12);\n                } else {\n                        return TRUE;\n                }\n        }\n\n        public static function validateWdays(\\Nette\\Forms\\IControl $control) {\n                return \\Fresh\\ValidateCron::validateTimeFormat($control-&gt;getValue(), 0, 6);\n        }\n\n        private static function validateTimeFormat($value, $min_entry = 0, $max_entry = 0) {\n                if (preg_match(&quot;&#39;^[0-9\\-\\,\\/\\*]+$&#39;&quot;, $value) == false) { // allowed characters are 0-9, comma, *, -, /\n                        return FALSE;\n                } elseif (preg_match(&quot;&#39;[\\-\\,\\/][\\-\\,\\/]&#39;&quot;, $value) == true) { // comma, - and / never stand together\n                        return FALSE;\n                }\n                $time_list = explode(&quot;,&quot;, $value);\n                foreach ($time_list as $entry) {\n                        // possible value combinations:\n                        // x               =&gt;      ^(\\d+)$\n                        // x-y             =&gt;      ^(\\d+)\\-(\\d+)$\n                        // x/y             =&gt;      ^(\\d+)\\/([1-9]\\d*)$\n                        // x-y/z           =&gt;      ^(\\d+)\\-(\\d+)\\/([1-9]\\d*)$\n                        // */x             =&gt;      ^\\*\\/([1-9]\\d*)$\n                        // combined regex  =&gt;      ^(\\d+|\\*)(\\-(\\d+))?(\\/([1-9]\\d*))?$\n                        if (preg_match(&quot;&#39;^(((\\d+)(\\-(\\d+))?)|\\*)(\\/([1-9]\\d*))?$&#39;&quot;, $entry, $matches) == false) {\n                                return FALSE;\n                        }\n                        // matches contains:\n                        // 1       =&gt;      * or value or x-y range\n                        // 2       =&gt;      unused\n                        // 3       =&gt;      value if [1] != *\n                        // 4       =&gt;      empty if no range was used\n                        // 5       =&gt;      2nd value of range if [1] != * and range was used\n                        // 6       =&gt;      empty if step was not used\n                        // 7       =&gt;      step\n                        if ($matches[1] == &quot;*&quot;) {\n                                // not to check\n                        } else {\n                                if ($matches[3] &lt; $min_entry || $matches[3] &gt; $max_entry) { // check if value is in allowed range\n                                        return FALSE;\n                                } elseif (isset($matches[4]) &amp;&amp; ($matches[5] &lt; $min_entry || $matches[5] &gt; $max_entry || $matches[5] &lt;= $matches[3])) {\n                                        // check if value is in allowed range and not less or equal to first value\n                                        return FALSE;\n                                }\n                        }\n                        if (isset($matches[6]) &amp;&amp; ($matches[7] &lt; 2 || $matches[7] &gt; $max_entry - 1)) { // check if step value is valid\n                                return FALSE;\n                        }\n                } // end foreach entry loop\n                return TRUE;\n        }\n\n}\n</code></pre>\n<p>Validátorem navrácené errory lze vykreslit například takto ručně (nově v DEV Nette):</p>\n<pre><code class=\"lang-html\">{form $form}\n\n&lt;ul class=&quot;error&quot; n:if=&quot;$form-&gt;allErrors&quot;&gt;\n        &lt;li n:foreach=&quot;$form-&gt;allErrors as $error&quot;&gt;{$error}&lt;/li&gt;\n&lt;/ul&gt;\n\n...\n\n{/form}\n</code></pre>\n"
}
