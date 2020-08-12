var ItemFactory = extend(Pawn, function ItemFactory() {});

var weightedItemsCollection = [Grass, Grass, Grass, CarrotPowerup, CarrotPowerup, IcePowerup];

ItemFactory.prototype.constructItem = function() {
	var cls = weightedItemsCollection[Math.floor(Math.random() * weightedItemsCollection.length)];

	var powerup = new (cls);
	powerup.x = this.x;
	powerup.y = this.y;

	return powerup;
};
