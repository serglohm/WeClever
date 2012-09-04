import QtQuick 1.1
import com.nokia.symbian 1.1

import QtMobility.location 1.2

import "code.js" as Code
import "engine.js" as Engine


Page {
    id: actionPage
    property int actionId: 0
    property variant actionPacket: []

    Rectangle{
        anchors.fill: parent
        color: "#8BB44E"
        Flickable{
            id: mainFlick
            anchors.fill: parent
            contentHeight: productItem.height + 20
            flickableDirection: Flickable.VerticalFlick
            Rectangle {
                id: productItem
                color: "#fff"
                radius: 10
                anchors.top: parent.top
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.margins: 10
                height: addressText.height +
                        6*20 + 200

                Text{
                    id: addressText
                    text: ''
                    anchors.top: parent.top
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.margins: 10
                    wrapMode: Text.WordWrap
                    color: '#FF1170'
                    font.bold: true
                    font.pixelSize: 30
                }
                MapGroup {
                    id: mapIcons
                    Repeater{
                        model: actionPacket
                        MapImage {
                            source: "mapIcon.png"
                            coordinate: Coordinate {latitude: lat; longitude: lng}
                        }
                    }
                }

                Map {
                   id: mapId
                   plugin : Plugin {
                       name : "nokia"
                   }
                   size.width: parent.width
                   anchors.top: descriptionText.bottom
                   height: 200
                   zoomLevel: 6
                   center: Coordinate {latitude: 53; longitude: 12}
                }
                MouseArea {
                    id: mousearea
                    z: 100
                    property bool __isPanning: false
                    property int __lastX: -1
                    property int __lastY: -1

                    width: parent.width
                    anchors.top: descriptionText.bottom
                    height: 200


                    onPressed: {
                        mainFlick.interactive = false;
                        __isPanning = true
                        __lastX = mouse.x
                        __lastY = mouse.y

                    }

                    onReleased: {
                        __isPanning = false
                        mainFlick.interactive = true;
                    }

                    onPositionChanged: {
                        if (__isPanning) {
                            var dx = mouse.x - __lastX
                            var dy = mouse.y - __lastY
                            mapId.pan(-dx, -dy)
                            __lastX = mouse.x
                            __lastY = mouse.y
                        }
                    }

                    onCanceled: {
                        __isPanning = false;
                        mainFlick.interactive = true;
                    }
                }
            }
        }
    }
    BusyIndicator {
        id: indicator
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.verticalCenter: parent.verticalCenter
        running: false
        width: parent.width / 3
        height: parent.width / 3
        visible: false
        z: 2
    }

    onStatusChanged: {
        if(status == 2){
            console.log('----------------------------------');
            for(var i = 0; i < actionPacket.length; i++){
                console.log(Code.obj2json(actionPacket[i]));
            }
            console.log('----------------------------------');

            //mapIcons.

            mapId.addMapObject(mapIcons);
        }
    }

}
