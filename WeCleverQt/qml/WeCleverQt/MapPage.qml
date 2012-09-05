import QtQuick 1.1
import com.nokia.symbian 1.1

import QtMobility.location 1.2

import "code.js" as Code
import "engine.js" as Engine


Page {
    id: actionPage
    property int actionId: 0
    property variant actionPacket: []
    Component.onCompleted: {
        print("Component.onCompleted actionPacket.length = " + actionPacket.length)
        if (actionPacket.length > 0) {
            print("actionPacket.length > 0")
            mapCenter.longitude = actionPacket[0][0];
            mapCenter.latitude = actionPacket[0][1];
            print("center lat = " + mapCenter.latitude +
                  " lon = " + mapCenter.longitude)
        }

        for (var i = 0; i < actionPacket.length; ++i) {
            mapImagesModel.append({lat: actionPacket[i][0], lng: actionPacket[i][1]})
        }
    }
    ListModel {
        id: mapImagesModel
    }

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
                        model: mapImagesModel
                        MapImage {
                            source: "mapIcon.png"
                            coordinate: Coordinate {latitude: lat; longitude: lng}
                        }
                    }
                }
                Component {
                    id: mapImageComponent
                    MapImage {
                        source: "mapIcon.png"
                        property double lat
                        property double lon
                        coordinate: Coordinate {latitude: lat; longitude: lon}
                    }
                }

                Coordinate {
                    id: mapCenter
                }

                Map {
                   id: mapId
                   plugin : Plugin {
                       name : "nokia"
                   }
                   size.width: parent.width
                   anchors.top: parent.top//descriptionText.bottom
                   height: 200
                   zoomLevel: 14
                   center: mapCenter
                   //center: Coordinate {latitude: 53; longitude: 12}
                }
                MouseArea {
                    id: mousearea
                    z: 100
                    property bool __isPanning: false
                    property int __lastX: -1
                    property int __lastY: -1

                    width: parent.width
                    anchors.top: parent.top//descriptionText.bottom
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
            print("onStatusChanged actionPacket.length = " + actionPacket.length)
            for(var i = 0; i < actionPacket.length; i++){
                console.log(Code.obj2json(actionPacket[i]));
                var mapImage = mapImageComponent.createObject(mapId, {lon: actionPacket[i][0], lat: actionPacket[i][1]});
                mapId.addMapObject(mapImage);
//                mapImagesModel.append({lng: actionPacket[i][0], lat: actionPacket[i][1]})
            }
            if (actionPacket.length > 0) {
                print("actionPacket.length > 0")
                mapCenter.longitude = actionPacket[0][0];
                mapCenter.latitude = actionPacket[0][1];
                print("center lat = " + mapCenter.latitude +
                      " lon = " + mapCenter.longitude)
            }
            console.log('----------------------------------');
            //mapId.addMapObject(mapIcons);
        }
    }

}
