angular.module('templates.app', ['series/series-detail.html', 'series/series-edit.html', 'series/series-item.html', 'series/series-list.html']);

angular.module("series/series-detail.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("series/series-detail.html",
    "<div class=\"col-xs-12 col-md-5 series-details\">\n" +
    "    <button class=\"btn btn-default btn-icon edit\" ng-click=\"edit()\"><i class=\"fa fa-pencil\"></i></button>\n" +
    "    <h3>{{seriesItem.title}}</h3>\n" +
    "    <img ng-src=\"/dist/static/images/series/covers/{{seriesItem.coverName}}\" alt=\"Series's first album cover\" class=\"cover img-responsive img-thumbnail\"/>\n" +
    "    <dl class=\"series-desc dl-horizontal\">\n" +
    "        <dt>{{'seriesItem.scriptwriter' | translate}}</dt>\n" +
    "        <dd>{{seriesItem.scriptwriter}}</dd>\n" +
    "        <dt>{{'seriesItem.illustrator' | translate}}</dt>\n" +
    "        <dd>{{seriesItem.illustrator}}</dd>\n" +
    "        <dt>{{'seriesItem.publisher' | translate}}</dt>\n" +
    "        <dd>{{seriesItem.publisher}}</dd>\n" +
    "        <dt>{{'seriesItem.volumes' | translate}}</dt>\n" +
    "        <dd>{{seriesItem.albums.length || 0}}</dd>\n" +
    "    </dl>\n" +
    "    <p class=\"series-desc\">\n" +
    "        {{seriesItem.summary}}\n" +
    "    </p>\n" +
    "</div>");
}]);

angular.module("series/series-edit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("series/series-edit.html",
    "<div class=\"col-xs-12 col-md-5 series-details\">\n" +
    "    <form rh-form name=\"seriesItemForm\" class=\"form-horizontal\" rh-model=\"seriesItem\" rh-submit=\"save()\" novalidate>\n" +
    "    <button type=\"submit\" class=\"btn btn-success btn-icon submit\">\n" +
    "        <i class=\"fa fa-check\"></i>\n" +
    "    </button>\n" +
    "    <button type=\"cancel\" class=\"btn btn-danger btn-icon cancel\" ng-click=\"cancel()\">\n" +
    "    <i class=\"fa fa-times\"></i>\n" +
    "    </button>\n" +
    "    <div class=\"form-group title\">\n" +
    "        <input id=\"title\" name=\"title\" type=\"text\" ng-model=\"seriesItem.title\" class=\"form-control\"/>\n" +
    "        <span class=\"help-block\"></span>\n" +
    "    </div>\n" +
    "    <img ng-src=\"/dist/static/images/series/covers/{{seriesItem.coverName || 'default.jpg'}}\" alt=\"Series's first album cover\" class=\"cover img-responsive img-thumbnail\"/>\n" +
    "\n" +
    "    <div class=\"series-desc\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <label for=\"scriptwriter\" class=\"col-sm-3 control-label\">{{'seriesItem.scriptwriter' | translate}}</label>\n" +
    "            <div class=\"col-sm-9\">\n" +
    "                <input id=\"scriptwriter\" name=\"scriptwriter\" type=\"text\" ng-model=\"seriesItem.scriptwriter\" class=\"form-control\"/>\n" +
    "                <span class=\"help-block\"></span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label for=\"illustrator\" class=\"col-sm-3 control-label\">{{'seriesItem.illustrator' | translate}}</label>\n" +
    "            <div class=\"col-sm-9\">\n" +
    "                <input id=\"illustrator\" name=\"illustrator\" type=\"text\" ng-model=\"seriesItem.illustrator\" class=\"form-control\"/>\n" +
    "                <span class=\"help-block\"></span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label for=\"publisher\" class=\"col-sm-3 control-label\">{{'seriesItem.publisher' | translate}}</label>\n" +
    "            <div class=\"col-sm-9\">\n" +
    "                <input id=\"publisher\" name=\"publisher\" type=\"text\" ng-model=\"seriesItem.publisher\" class=\"form-control\"/>\n" +
    "                <span class=\"help-block\"></span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label for=\"albums\" class=\"col-sm-3 control-label\">{{'seriesItem.volumes' | translate}}</label>\n" +
    "                <span class=\"col-sm-9\">\n" +
    "                    <input id=\"albums\" type=\"text\" ng-model=\"seriesItem.albums.length\" class=\"form-control\" disabled=\"disabled\"/>\n" +
    "                </span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"series-desc\">\n" +
    "        <textarea class=\"form-control\" rows=\"10\" ng-model=\"seriesItem.summary\"></textarea>\n" +
    "    </div>\n" +
    "    </form>\n" +
    "</div>");
}]);

angular.module("series/series-item.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("series/series-item.html",
    "<div ui-view>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"col-xs-12 col-md-4 series-albums\">\n" +
    "    <ul>\n" +
    "        <li ng-repeat=\"album in seriesItem.albums\" class=\"row\">\n" +
    "            <img ng-src=\"/dist/static/images/albums/covers/{{album.coverName}}\" alt=\"Album cover\" class=\"col-xs-2 cover img-responsive img-thumbnail\"/>\n" +
    "\n" +
    "            <div class=\"col-xs-10\">\n" +
    "                <h4>{{album.title}}</h4>\n" +
    "                <dl class=\"album-desc dl-horizontal\">\n" +
    "                    <dt>{{'album.volume' | translate}}</dt>\n" +
    "                    <dd>{{album.number}}</dd>\n" +
    "                    <dt>{{'album.date' | translate}}</dt>\n" +
    "                    <dd>{{album.publicationDate | rhMoment: 'MMMM YYYY'}}</dd>\n" +
    "                </dl>\n" +
    "            </div>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);

angular.module("series/series-list.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("series/series-list.html",
    "<div class=\"col-xs-12 col-md-3\">\n" +
    "    <h2> {{'series.title' | translate}} </h2>\n" +
    "\n" +
    "    <input type=\"text\" ng-model=\"query\" class=\"filter form-control\"/>\n" +
    "    <button class=\"sort btn btn-icon btn-default\" ng-click=\"reverse=!reverse\">\n" +
    "        <i class=\"fa\" ng-class=\"reverse ? 'fa-caret-up' : 'fa-caret-down'\"></i>\n" +
    "    </button>\n" +
    "\n" +
    "    <ul class=\"series-listing\">\n" +
    "        <li ng-repeat=\"seriesItem in series | filter:{title:query} | orderBy:'title':reverse\" class=\"series-item\" ng-model=\"seriesItem\">\n" +
    "            <a ui-sref-active=\"active\" ui-sref=\"series.item.detail(seriesItem)\" title=\"{{seriesItem.title}}\">\n" +
    "                {{seriesItem.title}}\n" +
    "            </a>\n" +
    "        </li>\n" +
    "        <li class=\"series-item\">\n" +
    "            <a href=\"\" title=\"add series\" class=\"add\" ui-sref=\"series.create\">\n" +
    "            <i class=\"fa fa-2x fa-plus-square\"></i>\n" +
    "            </a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "\n" +
    "    <span>{{'series.number' | translate}} {{(series|filter:{title:query}).length}}</span>\n" +
    "</div>\n" +
    "\n" +
    "<div ui-view>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);
