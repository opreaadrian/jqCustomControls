      /////////////////////////////////////////////
     /* jQuery Custom Controls by Florin Danciu */
    /*  version 1.0                            */
   /*   http://danciu.github.com/             */
  /*    Released under the MIT License       */
 /*     http://opensource.org/licenses/MIT  */
/////////////////////////////////////////////
;(function($, window, document, undefined){
'use strict';
    var jqcc = 'jqCustomControls',
        /*
            Plugin default options
            **********************
            - preserveMargins   - preserve any margins the original element may have had - false;
            - preserveClasses   - keep class(es) of original element - false;
            - newPreservedId    - set an ID on the new element, composed from the "jqcc-" keyword and the old element's ID - true;
            - additionalClasses - list of additional classes (or a single class for that matter) to set on the new element - empty.
        */
        defaults = {
            preserveMargins   : false,
            preserveClasses   : false,
            newPreservedId    : true,
            additionalClasses : ""
        };
    function Plugin(element, options) {
        /*
            Setting variables
            *****************
            - Element and element as jQuery object;
            - Element type (checkbox or radio);
            - Is the element jqCustomControls is applied on a checkbox or radio element? (boolean);
            - Plugin-specific: Replace default options with custom ones; defaults and name variables.
        */
        this.element = element;
        this.$element = $(element);
        this.elementType = this.$element.attr("type");
        this.elementOfCorrectType = this.elementType === "checkbox" || this.elementType === "radio";
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = jqcc;
        /*
            If the element jqCustomControls is applied on is of correct type (checkbox or radio element),
            find out whether it has an ID or/and class(es), then set an ID variable if there is an ID on the element,
            and then initialize the plugin.
        */
        if (this.elementOfCorrectType) {
            this.elementHasID = this.$element.attr("id").length;
            this.elementHasClass = this.$element.attr("class").length;
            if (this.elementHasID) {
                this.elementID = this.$element.attr("id");
            }
            this.init();
        }
    }

    Plugin.prototype = {

        init: function() {
            /*
                init function
                *************
                Handles calling the createElement function
            */
            this.createElement();
        },


        createElement: function() {
            /*
                createElement function
                **********************
                Handles hiding the original element, then creates the new element and its span, sets the specific element type class
                (checkbox or radio) and the specific checked element class, verifies the plugin options and takes actions accordingly
                and then calls the "newElementEvents" plugin function.
            */
            this.$element.hide();
            this.$newElement = $("<a/>").insertAfter(this.$element).addClass("jqcc-anchor");
            this.$spanElement = $("<span/>").appendTo(this.$newElement);
            if (this.elementType === "checkbox") {
                this.$newElement.addClass("checkbox");
            } else {
                this.$newElement.addClass("radio");
            }
            if (this.$element.is(":checked")) {
                this.$newElement.addClass("checked");
            }
            if (this.options.preserveMargins) {
                this.elementMargins = this.$element.css("margin");
                this.$newElement.css("margin", this.elementMargins);
            }
            if (this.options.newPreservedId && this.elementHasID) {
                this.newElementID = "jqcc-" + this.elementID;
                this.$newElement.attr("id", this.newElementID);
            }
            if (this.options.preserveClasses && this.elementHasClass) {
                this.elementClass = this.$element.attr("class");
                this.$newElement.addClass(this.elementClass);
            }
            if ($.trim(this.options.additionalClasses) !== "") {
                this.$newElement.addClass(this.options.additionalClasses);
            }
            this.newElementEvents();
        },


        newElementEvents: function() {
            /*
                newElementEvents function
                *************************
                Handles the events for the new element (click and touchstart), but also the change event of the hidden element.
                The first event will call the newElementChangeState function, while the second calls the elementChangeState function directly.
                "this" object is passed as data and stored in a variable for usage.
            */
            this.$newElement.on("click", this, function(e) {
                var thisPlugin = e.data;
                thisPlugin.newElementChangeState();
            });
            this.$element.on("change", this, function(e) {
                var thisPlugin = e.data;
                thisPlugin.elementChangeState();
            });
        },

        newElementChangeState: function() {
            /*
                newElementChangeState function
                ******************************
                Handles setting the checked property and attribute to the hidden element - to false if the element was already checked,
                and true otherwise. The false value may be set only if the element is a checkbox, because radios can't be unchecked.
                Using the jQuery "prop" method would be enough here, however the "checked" attribute is also set or unset in order to cover
                everything - like a wrong check verifying for this attribute.
                Finally, the plugin triggers a change event on the hidden element, which means the elementChangeState function will be called.
            */
            if (this.$element.is(":checked") && this.elementType === "checkbox") {
                this.$element.prop("checked", false);
                this.$element.attr("checked", false);
            } else {
                this.$element.prop("checked", true);
                this.$element.attr("checked", true);
            }
            this.$element.trigger("change");
        },


        elementChangeState: function() {
            /*
                elementChangeState function
                ***************************
                Handles adding or removing the checked class depending on whether the hidden element is actually checked or not
            */
            if (this.$element.is(":checked")) {
                this.$newElement.addClass("checked");
            } else if (this.elementType === "checkbox") {
                this.$newElement.removeClass("checked");
            }
        }
    };
    
    
    /*
        Plugin wrapper
        **************
        Prevents against multiple instantiations
    */
    $.fn[jqcc] = function (options) {
        return this.each(function() {
            if (!$.data(this, 'plugin_' + jqcc)) {
                $.data(this, 'plugin_' + jqcc, new Plugin(this, options));
            }
        });
    };
})(jQuery, window, document);