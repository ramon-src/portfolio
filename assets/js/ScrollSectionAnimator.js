(function ($, window) {

    $.fn.SectionAnimator = function (opts) {
        var sectionElements = this,
            sectionProp = [],
            config = $.extend({}, {
                sections: [
                    {
                        sectionId: null,
                        children: [
                            {
                                el: null,
                                animationClass: [null, null],
                                startAt: 0,
                                visible: true
                            }
                        ]
                    }
                ],
                classDefault: 'animated'
            }, opts);

        config.sections.forEach(function (sections) {
            sections.children.forEach(function (child) {
                $(child.el).hide();
            });
        });

        sectionElements.each(function () {
            var section = $(this);
            sectionProp.push({id: section.attr('id'), el: section, pos: section.offset().top});
        });

        $(window).bind('scroll', function () {
            var windowScrolled = $(this);
            var scrollPos = windowScrolled.scrollTop();

            if (windowScrolled.data('scrollTimeout')) {
                clearTimeout(windowScrolled.data('scrollTimeout'));
            }

            windowScrolled.data('scrollTimeout', setTimeout(function () {
                for (var i = 0; i < sectionProp.length - 1; i++) {
                    if (i > 0 && i < sectionProp.length - 1) {
                        if (!(sectionProp[i - 1].pos >= scrollPos) && !(scrollPos >= sectionProp[i + 1].pos)) {
                            addEffects(sectionProp[i].id);
                            break;
                        }
                    }
                }
            }, 500));

            function addEffects(sectionId) {
                config.sections.forEach(function (sections) {
                    if (sections.sectionId === sectionId) {
                        var sectionQuery = '#' + sections.sectionId + ' ';

                        sections.children.sort(orderComparingTime);

                        sections.children.forEach(function (child) {
                            var classes = config.classDefault;

                            child.animationClass.forEach(function (animatedClass) {
                                classes += ' ' + animatedClass;
                            });

                            setTimeout(function () {
                                $(sectionQuery + child.el).show().addClass(classes);
                            }, child.startAt);
                        });
                    }
                });
            }

            function orderComparingTime(a, b) {
                if (a.startAt < b.startAt)
                    return -1;
                if (a.startAt > b.startAt)
                    return 1;
                return 0;
            }
        });
    };

}(jQuery, window));