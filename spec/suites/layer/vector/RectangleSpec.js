describe('Rectangle', () => {
	var map, container;

	beforeEach(() => {
		container = createContainer();
		map = L.map(container, {center: [55.8, 37.6], zoom: 6});
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	describe("#initialize", () => {
		it("should never be flat", () => {
			var latLngs = [[1, 2], [3, 4]];

			var rectangle = L.rectangle(latLngs);

			expect(L.LineUtil.isFlat(rectangle._latlngs)).to.be(false);
			expect(rectangle.getLatLngs()).to.eql(rectangle._latlngs);
		});

		it("doesn't overwrite the given latlng array", () => {
			var originalLatLngs = [
				[1, 2],
				[3, 4]
			];
			var sourceLatLngs = originalLatLngs.slice();

			var rectangle = L.rectangle(sourceLatLngs);

			expect(sourceLatLngs).to.eql(originalLatLngs);
			expect(rectangle._latlngs).to.not.eql(sourceLatLngs);
		});

		it("cannot be called with an empty array", () => {
			// Throws error due to undefined lat
			expect(() => {
				L.rectangle([]);
			}).to.throwException();
		});

		it("can be initialized with extending bounds", () => {
			var originalLatLngs = [
				[0, 10], [20, 30],
				[40, 50], [60, 70] // extended bounds
			];

			var rectangle = L.rectangle(originalLatLngs);

			expect(rectangle._latlngs).to.eql([
				[L.latLng([0, 10]), L.latLng([60, 10]), L.latLng([60, 70]), L.latLng([0, 70])]
			]);
			expect(rectangle.getLatLngs()).to.eql(rectangle._latlngs);
		});
	});

	describe("#setBounds", () => {
		it("doesn't overwrite the given latlng array", () => {
			var originalLatLngs = [
				[1, 2],
				[3, 4]
			];
			var sourceLatLngs = originalLatLngs.slice();

			var rectangle = L.rectangle(sourceLatLngs);

			rectangle.setBounds(sourceLatLngs);

			expect(sourceLatLngs).to.eql(originalLatLngs);
		});

		it("changes original bounds to new bounds", () => {
			var originalLatLngs = [
				[1, 2],
				[3, 4]
			];

			var newLatLngs = [
				[5, 6],
				[7, 8]
			];

			var rectangle = L.rectangle(originalLatLngs);
			rectangle.setBounds(newLatLngs);

			expect(rectangle._latlngs).to.eql([
				[L.latLng([5, 6]), L.latLng([7, 6]), L.latLng([7, 8]), L.latLng([5, 8])]
			]);

			expect(rectangle.getLatLngs()).to.eql(rectangle._latlngs);
		});

		it("can be set with extending bounds", () => {
			var originalLatLngs = [
				[[2, 3], [4, 5]]
			];

			var newLatLngs = [
				[0, 10], [20, 30],
				[40, 50], [60, 70] // extending bounds
			];

			var rectangle = L.rectangle(originalLatLngs);
			rectangle.setBounds(newLatLngs);

			expect(rectangle._latlngs).to.eql([
				[L.latLng([0, 10]), L.latLng([60, 10]), L.latLng([60, 70]), L.latLng([0, 70])]
			]);
			expect(rectangle.getLatLngs()).to.eql(rectangle._latlngs);
		});
	});

	describe("#Canvas", () => {
		it("doesn't apply `focus` listener if element is undefined", () => {
			map.remove();

			map = L.map(container, {renderer: L.canvas()});
			map.setView([0, 0], 6);
			expect(() => {
				L.polygon([[[2, 3], [4, 5]]]).addTo(map).bindTooltip('test');
			}).to.not.throwException();
		});
	});
});
