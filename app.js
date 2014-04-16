var path = require('path');
var IRC = require('./irc');

cpgf.import("cpgf", "builtin.core");

(function() {

	(function(){
		var irc = null;
		var item = new qt.DynamicMetaObjectBuilder();
		item.setClassName('IRC');
		item.setInit(function(self) {
			irc = new IRC(self);
		});

		// Properties
		item.addProperty('nickname', 'QString');
		item.addProperty('message', 'QString');
		item.addProperty('imageMode', 'bool');
		item.addProperty('state', 'QString');

		// Signals
		var events = new qt.QStringList();
		events._opLeftShift(new qt.QString('err'));
		item.addSignal('received(bool)', events);

/*
		// Slots
		item.addSlot('receive()', function(self) {
			qt.emitSignal(ircItem, 'received(bool)', new qt.QVariant(false));
		});
		var aa = new qt.QStringList();
		aa._opLeftShift(new qt.QString("newValue"))
		b.addSignal("incremented(int)", aa)
		b.addSlot('increment()', function ($this) {
			$this.setProperty('value',
							  new qt.QVariant($this.property(
												  "value").toInt() + 1))
			qt.emitSignal($this, "incremented(int)",
							 new qt.QVariant($this.property(
												 "value").toInt()))
		})
*/
		qt.finalizeAndRegisterMetaObjectBuilderToQml(item, "osdc.irc", 1, 0, "IRC")
	})();

	try {
		var engine = new qt.QQmlEngine();
		var component = new qt.QQmlComponent(engine, new qt.QString(path.resolve("qml/main.qml")));
		if (!component.isReady()) {
			throw component.errorString();
		}

		var topLevel = component.create();
		var window = cpgf.cast(topLevel, qt.QQuickWindow);
		var surfaceFormat = window.requestedFormat();
		window.setFormat(surfaceFormat);
		window.show();
	} catch(err) {
		throw err;
	}

	// Loop
	setInterval(function() {
	}, 1000);
})();
