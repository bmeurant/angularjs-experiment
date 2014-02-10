describe('Comics App', function() {

    describe('Comics list view', function() {

        beforeEach(function() {
            browser().navigateTo('/');
        });

        it('should redirect to series index', function() {
            expect(browser().location().path(), 'Redirects to /series').toBe('/series');
        });

        it('should display seven series plus creation element', function() {
            expect(repeater('ul.series-listing li', 'Seven series displayed + one creation item').count()).toBe(8);
            element('ul.series-listing li', 'last list element is the creation item').query(function ($el, done) {
                expect($el.find('a').get($el.length -1).className.match('add')).not().toBeNull();
                done();
            });
        });
    });

    describe('Comics SeriesItem view', function() {

        beforeEach(function() {
            browser().navigateTo('#/series/1');
        });

        it('should display correctly seriesItem', function() {
            expect(element('.series-details h3').text()).toBe("BlackSad");

            element('.series-details .series-desc dd').query(function ($el, done) {
                sleep(1000); // headache ... special kassdedi to @loicfrering !!
                expect($el.get(0).innerText).toBe('Juan Diaz Canales');
                expect($el.get(1).innerText).toBe('Juanjo Guarnido');
                expect($el.get(2).innerText).toBe('Dargaud');
                expect($el.get(3).innerText).toBe('5');
                done();
            });

        });
    });
});