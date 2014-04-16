import QtQuick 2.2
import QtQuick.Controls 1.1
import QtQuick.Layouts 1.1
import osdc.irc 1.0

ApplicationWindow {
    title: qsTr('OSDC IRC');
    width: 1024;
    height: 768;
	visible: true;

	FontLoader {
		source: 'DroidSansFallbackFull.ttf';
	}

	Rectangle {
		anchors.fill: parent;
		color: 'black';
	}

	Text {
		anchors.centerIn: parent;
		color: 'white';
		font.pointSize: 100;
		text: '大腸花論壇';
		opacity: 0.2;
		textFormat: Text.StyledText;
	}

	IRC {
		onReceived: {

			if (state == 'reboot' || state == 'shutdown' || state == 'rm' || state == 'cat' || state == 'clear') {
				alertDialog.state = state;
			} else {
				msgList.model.append({
					imageMode: imageMode,
					nickname: nickname,
					message: message
				});
			}
		}
	}

	ListView {
		id: msgList;
		anchors.fill: parent;
		anchors.margins: 10;
		model: ListModel {}
		delegate: Item {

			width: msgList.width;
			height: row.height;

			Row {
				id: row;
				spacing: 5;

				Text {
					color: 'white';
					text: '&lt;' + nickname + '&gt;';
					textFormat: Text.StyledText;
					font.pointSize: 20;
				}

				Text {
					visible: !imageMode;
					color: 'white';
					text: message;
					textFormat: Text.StyledText;
					font.pointSize: 20;
				}

				Image {
					visible: imageMode;
					source: imageMode ? message : '';
				}
			}
		}

		highlightRangeMode: ListView.ApplyRange;
		highlightFollowsCurrentItem: true;
		focus: true;

		onCountChanged: {
			currentIndex = count - 1;
		}

		Component.onCompleted: positionViewAtIndex(count - 1, ListView.Visible)
	}

	// Alert
	Rectangle {
		id: alertDialog;
		anchors.centerIn: parent;
		width: alertMessage.width;
		height: alertMessage.height;
		color: 'red';
		opacity: 0.8;
		scale: 0;

		Text {
			id: alertMessage;
			anchors.centerIn: parent;
			anchors.margins: 20;
			color: 'white';
			font.pointSize: 60;
			textFormat: Text.StyledText;
		}

		transitions: Transition {
			NumberAnimation {
				property: 'scale';
				duration: 100;
				easing.type: Easing.OutBack;
			}
		}

		states: [
			State {
				name: 'clear';
				PropertyChanges {
					target: alertDialog;
					scale: 0;
				}
			},
			State {
				name: 'rm';
				PropertyChanges {
					target: alertDialog;
					scale: 1;
				}

				PropertyChanges {
					target: alertMessage;
					text: '拜託不要用 rm!';
				}
			},
			State {
				name: 'cat';
				PropertyChanges {
					target: alertDialog;
					scale: 1;
				}

				PropertyChanges {
					target: alertMessage;
					text: '你想用 cat 看什麼！？';
				}
			},
			State {
				name: 'reboot';
				PropertyChanges {
					target: alertDialog;
					scale: 1;
				}

				PropertyChanges {
					target: alertMessage;
					text: '你連國防布都要用嗎？';
				}
			},
			State {
				name: 'shutdown';
				PropertyChanges {
					target: alertDialog;
					scale: 1;
				}

				PropertyChanges {
					target: alertMessage;
					text: '關機不行喔';
				}
			}
		]
	}

	Component.onCompleted: {

		msgList.model.append({
			imageMode: false,
			nickname: 'Fred',
			message: 'Test'
		});

		msgList.model.append({
			imageMode: false,
			nickname: 'Fred',
			message: 'Test'
		});
	}
}
