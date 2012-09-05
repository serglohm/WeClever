import QtQuick 1.1
import com.nokia.symbian 1.1

import QtMobility.location 1.2

import "code.js" as Code
import "engine.js" as Engine


Page {
    id: actionPage
    property int actionId: 0
    property variant actionPacket: []
    property bool initialized: false

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
                height: cnameText.height +
                        itemImage.height +
                        annotationText.height +
                        priceText.height +
                        basketButton.height +
                        descriptionText.height +
                        6*20 + 200

                Text{
                    id: cnameText
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
                Image{
                    id: itemImage
                    fillMode: Image.PreserveAspectFit
                    anchors.top: cnameText.bottom
                    anchors.horizontalCenter: parent.horizontalCenter
                    anchors.margins: 10
                    smooth: true
                    height: 162
                }
                Text{
                    id: annotationText
                    text: ""
                    anchors.top: itemImage.bottom
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.margins: 10
                    wrapMode: Text.WordWrap
                    color: '#333'
                }
                Text{
                    id: priceText
                    text: ""
                    anchors.top: annotationText.bottom
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.margins: 10
                    wrapMode: Text.WordWrap
                    font.pixelSize: 30
                    color: '#FF1170'
                }
                Button{
                    id: basketButton
                    text: "В корзину"
                    anchors.top: priceText.bottom
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.margins: 10
                    //color: '#FF1170'
                    onClicked: {


                    }
                }
                Text{
                    id: descriptionText
                    text: description
                    anchors.top: basketButton.bottom
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.margins: 10
                    wrapMode: Text.WordWrap
                    color: '#333'
                }                
                Button {
                    width: parent.width
                    height: 30
                    anchors.bottom: parent.bottom
                    text: "click"
                    onClicked: {
                        showMap(actionPacket);
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

    function getActionCallback(data){
        console.log('----------- getActionCallback -----------');
        //console.log(data[0].name);
        console.log(Code.obj2json(data));

        indicator.visible = false;
        indicator.running = false;

        cnameText.text = data[0].act_name;
        var imageSource = data[0].act_image;
        imageSource = imageSource.replace("med-1.jpg", "1-300x162.jpg");
        itemImage.source = imageSource;

        var desc = data[0].conditions;

        desc = desc.split('\\n').join('\n');
        //desc = desc.replace('<li>', '<li style="margin: 0px; padding: 0px;">');
        //desc = desc.replace('<ul>', '<ul style="margin: 0px; padding: 0px;">');

        /*desc = desc.split('<ul>').join('<ul>');
        desc = desc.split('</ul>').join('</ul>');
        */
        var testDesc = "<style>UL,LI{margin-left: -10px; padding-right: 0px;}</style>" + desc;
        //UL,
        var tempArray = new Array();
        descriptionText.text = testDesc;
        for (var i = 0; i < data[0].packet.length; i++){
            console.log(data[0].packet[i]);
            var coords = data[0].packet[i].coords.split(',');
            print("data[0].packet[" + i + "] = " + data[0].packet[i] );
            print("coords = " + coords);
//            packet[i].lng = coords[0];
//            packet[i].lat = coords[1];
            tempArray.push(coords);//data[0].packet[i]
        }
        actionPacket = tempArray;
    }

    onStatusChanged: {
        if(status == 2 && !initialized){
            initialized = true;
            var url = Engine.getUrlStart() + "/iphone_app/AppDataActions/" + actionId + "/"
            console.log(url);
            Code.getJSON(url, getActionCallback);
            indicator.visible = true;
            indicator.running = true;
        }
    }



}
