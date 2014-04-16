
var child_process = require('child_process');
var tennu = require('tennu');

var IRC = module.exports = function(ircItem) {
	var self = this;

	self.ircItem = ircItem;

	var client = self.client = tennu.Client({
		server: 'irc.freenode.net',
		nickname: 'OSDC_Fred_BOT',
		channels: [ '#fred.test' ]
		//channels: [ '#osdc.tw' ]
	});

	client.on('join', function(message) {
		console.log(message);
	});

	client.on('privmsg', function(privmsg) {
		console.log(privmsg);

		self.ircItem.setProperty('state', new qt.QVariant(new qt.QString('')));
		self.ircItem.setProperty('nickname', new qt.QVariant(new qt.QString(privmsg.nickname)));
		self.ircItem.setProperty('message', new qt.QVariant(new qt.QString(privmsg.message)));

		// Special commands
		var cmd = privmsg.message.split(' ');
		if (cmd[0] == 'image') {
			self.ircItem.setProperty('imageMode', new qt.QVariant(true));
			self.ircItem.setProperty('message', new qt.QVariant(new qt.QString(cmd[1])));
		} else {
			self.ircItem.setProperty('imageMode', new qt.QVariant(false));
		}

		if (cmd[0] == 'ls' && cmd.length == 2) {
			var output = [];
			var ls = child_process.spawn('ls', [ cmd[1] ]);
			ls.stdout.on('data', function(data) {
				output.push(data.toString());
			});

			ls.on('close', function(code) {
				self.ircItem.setProperty('message', new qt.QVariant(new qt.QString(output.join(''))));
				qt.emitSignal(self.ircItem, 'received(bool)', new qt.QVariant(false));
			});

			return;
		} else if (cmd[0] == 'rm' || cmd[0] == 'cat' || cmd[0] == 'reboot' || cmd[0] == 'shutdown') {
			self.ircItem.setProperty('state', new qt.QVariant(new qt.QString(cmd[0])));

			setTimeout(function() {
				self.ircItem.setProperty('state', new qt.QVariant(new qt.QString('clear')));
				qt.emitSignal(self.ircItem, 'received(bool)', new qt.QVariant(false));
			}, 1000);
		}

		qt.emitSignal(self.ircItem, 'received(bool)', new qt.QVariant(false));
	});

	client.connect();
 };
