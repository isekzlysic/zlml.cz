export default {
  "attributes": {
    "id": "e469395b-c4f9-42db-bcf2-b2f1bc49f2e7",
    "timestamp": 1413406213000,
    "title": "Fígloidní odstranění záhlaví modulu",
    "slug": "figloidni-odstraneni-zahlavi-modulu"
  },
  "body": "Dnešní článek bude spíše zápisek, protože jsem řešení tohoto problému hledal neskutečně dlouho a jak se později ukázalo, tak řešení je sice jednoduché, ale je zakořeněné hluboko v jádru Odoo ERP systému. O co jde. Občas je potřeba schovat záhlaví (viz obrázek) u některých modulů.\n\n![](https://zlmlcz-media.s3-eu-west-1.amazonaws.com/ddfc321c-2190-4cf6-98a9-89852713e626/vystrizek.png)\n\nTento panel má sice dobrý důvod, ale existují případy, kde je prostě nadbytečný. Typický případ takové nadbytečnosti je modul Dashboards (technický název `board`) kdy je tento prostor nijak nevyužívaný. Zřejmě by tento problém šel řešit nějaký hackem, ale to prostě není dobře. Problém je [zde](https://github.com/odoo/odoo/blob/8.0/addons/web/static/src/js/views.js#L905). \"Special case for Dashboards\"...\n\n# Jak na to\n\nAsi úplně nejjasnější bude, když popíšu posloupnost kroků, které vedou ke správnému řešení. Nejedná se o nic kompikovaného. Všechny níže uváděné postupy jsou klasické postupy při vývoji modulu. Jen je (do teď) pravděpodobně nikde nenajdete, nebo nad tím zbytečně vytuhnete na zoufale dlouhou dobu. Ostatně [podívejte se](https://searchcode.com/?q=views_switcher%20lang:Javascript), jak je výskyt tohoto kousku užitečného kódu [používaný](https://github.com/odoo/odoo/search?l=javascript&q=views_switcher&type=Code&utf8=%E2%9C%93) v public repozitářích... :-)\n\n<span style=\"font-size:2em\">1.</span> Registrace XML definice v `__openerp__.conf`\n\nTato záležitost je asi celkem jasná. Jednoduše musíme definovat, že se má při compile-time brát ohled na XML soubor, ve kterém zaregistrujeme JS soubor viz další bod.\n\n```python\n{\n    #...\n    \n    'data': [\n        'views/header.xml',\n    ],\n    \n    #...\n}\n```\n\n<span style=\"font-size:2em\">2.</span> Registrace JS souboru\n\nTo jsem to ale nazval blbě... (-: V předchozím bodě je tedy definovanám soubor v podadresáři `views`, jehož obsah je např. takovýto:\n\n```html\n<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<openerp>\n    <data>\n        <template id=\"assets_backend\" name=\"queue assets\" inherit_id=\"web.assets_backend\">\n            <xpath expr=\".\" position=\"inside\">\n                <script type=\"text/javascript\" src=\"/module_name/static/src/js/header.js\"/>\n            </xpath>\n        </template>\n    </data>\n</openerp>\n```\n\nTato registrace je naprosto běžná. ERP se k tomu pak staví poměrně chytře, takže když je ERP v `?debug=` módu, tak souboru vrací tak jak jsou, jinak je všechny skládá do jednoho a provádí minimalizaci. V tomto případě je rozdíl signifikantní.\n\n<span style=\"font-size:2em\">3.</span> Javascript definice\n\nJe známá věc, že si toto ERP bez JS ani neuprdne. Na jednu stranu mě to trošku štve, na druhou stranu to nemá vůbec smysl řešit. Dalším krokem proto bude definice na straně JS, která zakáže tomuto konkrétnímu view vykreslení headeru:\n\n```javascript\nopenerp.module_name = function (instance) {\n    //var QWeb = instance.web.qweb;\n    if (!instance.module_name) {\n        instance.module_name = {};\n    }\n\n    //zde navíc např. definice pro instance.web.qweb\n\n    instance.web.ViewManagerAction.include({\n        init: function(parent, action) {\n            var flags = action.flags || {};\n            if (action.res_model == 'module_model' && action.view_mode === 'form') {\n                _.extend(flags, {\n                    views_switcher : false,\n                    display_title : false,\n                    search_view : false,\n                    pager : false,\n                    sidebar : false,\n                    action_buttons : false\n                });\n            }\n            action.flags = flags\n            this._super(parent, action);\n        },\n    });\n}\n```\n\nToto nastavení je vlastně úplně to stejné, jako je v jádru. Jedná se o naprosto korektní a čisté řešení. Bohužel je nutné jej řešit touto myškou, protože toto není funkce, která je (nebo by do budoucna měla být) přímo podporována. Dává to smysl, protože se jedná o skutečně krajní případ.\n\nA na závěr mám pro všechny čtenáře třešničku v podobě easter eggu. Vyzkoušejte si doplnit do URL parametr `?kitten=`, stejně jako se doplňuje například ten parametr pro zapnutí debug režimu... (-: *#yourewelcome*"
}